// Mood DJ — panneau et moteur DJ (monde isolé de l’extension) : anecdotes déjà racontées, Wikipédia, catalogue personnel, artistes de départ, réserve de titres.
// Les fichiers mdj-*.js puis content.js sont chargés dans l’ordre du manifest et partagent la même portée :
// une fonction d’un fichier peut appeler celle d’un autre, mais le code exécuté au chargement ne doit
// utiliser que ce qui est défini dans les fichiers précédents (vérifié par tests/split.test.js).
'use strict';

// Anecdotes déjà racontées (par artiste, par titre et par style), gardées 90 jours :
// elles sont rappelées à Claude pour qu'il raconte autre chose la fois suivante.
let toldCache = {};
let toldSaveTimer = null;
const TOLD_TTL = 90 * 86400000;
function toldFor(subjects) {
  const now = Date.now();
  const out = [];
  for (const k of subjects) for (const e of toldCache[k] || []) if (now - e.at < TOLD_TTL && !out.includes(e.t)) out.push(e.t);
  return out.slice(-5);
}
function rememberTold(subjects, text) {
  const t = String(text || '').replace(/\s+/g, ' ').trim().slice(0, 400);
  if (!t || !subjects.length) return;
  const now = Date.now();
  for (const k of subjects) toldCache[k] = (toldCache[k] || []).filter((e) => now - e.at < TOLD_TTL).concat([{ t, at: now }]).slice(-4);
  clearTimeout(toldSaveTimer);
  toldSaveTimer = setTimeout(() => {
    const keys = Object.keys(toldCache);
    if (keys.length > 500) {
      const last = (k) => Math.max(0, ...toldCache[k].map((e) => e.at));
      keys.sort((a, b) => last(a) - last(b));
      for (const k of keys.slice(0, keys.length - 500)) delete toldCache[k];
    }
    store({ toldCache });
  }, 3000);
}

// Article Wikipédia du style joué (culture musicale).
const STYLE_WIKI = {
  rock: 'Rock', 'rock/hard': 'Hard rock', 'rock/sudiste': 'Rock sudiste', 'rock/inde': 'Rock indépendant', poprock: 'Pop rock',
  country: 'Musique country', 'country/outlaw': 'Outlaw country', pop: 'Pop (musique)', electro: 'Musique électronique', 'electro/house': 'House music',
  'electro/techno': 'Techno', 'electro/synthwave': 'Synthwave', rap: 'Rap', hiphop: 'Hip-hop', metal: 'Metal', 'metal/symphonique': 'Metal symphonique',
  blues: 'Blues', 'blues/folk': 'Musique folk', soul: 'Musique soul', 'soul/funk': 'Funk', 'soul/disco': 'Disco', reggae: 'Reggae', 'reggae/dancehall': 'Dancehall',
  jazz: 'Jazz', latino: 'Musique latine', 'latino/reggaeton': 'Reggaeton', 'latino/flamenco': 'Flamenco',
  classique: 'Musique classique', bo: 'Musique de film', 'bo/jeux': 'Musique de jeu vidéo', lofi: 'Lofi hip-hop',
  asie: 'K-pop', 'asie/jpop': 'J-pop', 'asie/anime': 'Anison', 'asie/citypop': 'City pop', monde: 'Musiques du monde', 'monde/afro': 'Afrobeats',
  'rock/punk': 'Punk rock', 'rock/grunge': 'Grunge', 'rock/prog': 'Rock progressif', 'electro/dnb': 'Drum and bass', 'electro/trance': 'Trance (musique)',
  'electro/ambient': 'Ambient', 'pop/synth': 'Synthpop', 'pop/indie': 'Indie pop', 'jazz/manouche': 'Jazz manouche',
  'monde/zouk': 'Zouk'
};
async function genreFacts(t, sel) {
  const st = (t && t.style) || (sel ? C.onlyStyle(sel) : '');
  const sub = (t && t.sub) || (sel ? C.onlySub(sel) : '');
  const custom = C.STYLES.find((x) => x.id === st && x.custom);
  const title = STYLE_WIKI[st + '/' + sub] || STYLE_WIKI[st] || (custom ? custom.label : '');
  if (!title) return null;
  const k = 'style2:' + title;
  let c = wikiCache[k];
  if (!c || Date.now() - c.at >= WIKI_TTL) {
    try {
      const r = await withTimeout(claude('wikipage', { title, lang: 'fr', parts: true }), 7000);
      c = wikiCache[k] = { at: Date.now(), text: (r && r.text) || '', parts: Array.isArray(r && r.parts) ? r.parts.slice(0, 14) : [], rot: 0, lang: 'fr' };
    } catch (e) { return null; }
  }
  if (!c.text && !(c.parts && c.parts.length)) return null;
  let text = c.text;
  const parts = c.parts || [];
  if (parts.length) {
    // Deux parties de l'article, différentes à chaque fois : on ne raconte pas toujours la même histoire.
    const r0 = (c.rot || 0) % parts.length;
    const picked = [parts[r0]].concat(parts.length > 1 ? [parts[(r0 + 1) % parts.length]] : []);
    c.rot = (r0 + 2) % parts.length;
    text = (text ? text + '\n' : '') + picked.join('\n');
  }
  saveWikiCache();
  return { title, text, lang: 'fr' };
}

async function songFacts(t) {
  if (!t || !t.title || !t.artist) return null;
  const k = C.keyOf(t.artist, t.title);
  const c = wikiCache[k];
  if (wikiFresh(c)) return c.text ? c : null;
  try {
    const r = await withTimeout(claude('wiki', { title: t.title, artist: t.artist }), 9000);
    wikiCache[k] = { at: Date.now(), rev: WIKI_REV, text: (r && r.text) || '', lang: (r && r.lang) || '', kind: (r && r.kind) || '' };
    saveWikiCache();
    return wikiCache[k].text ? wikiCache[k] : null;
  } catch (e) { return null; }
}

function saveArtistCache() {
  clearTimeout(artistSaveTimer);
  artistSaveTimer = setTimeout(() => {
    const ids = Object.keys(artistCache.pages);
    if (ids.length > 1500) {
      ids.sort((a, b) => artistCache.pages[a].at - artistCache.pages[b].at);
      for (const id of ids.slice(0, ids.length - 1500)) delete artistCache.pages[id];
    }
    // Les noms d'artistes (nom → identifiant) n'étaient jamais élagués : on garde les 3 000 derniers.
    const names = Object.keys(artistCache.names);
    if (names.length > 3000) for (const k of names.slice(0, names.length - 3000)) delete artistCache.names[k];
    store({ artistCache });
  }, 3000);
}
function learnedToTrack(r) {
  return {
    artist: r[0], title: r[1], style: r[2] || '', sub: r[3] || '', energy: r[4] || 3, year: r[5] || 0, flags: r[6] || '',
    videoId: r[7] || '', type: r[8] || '', key: C.keyOf(r[0], r[1]), learned: true
  };
}
// Ajoute (ou retire) le catalogue personnel au catalogue utilisé par les sélections.
function mergeLearnedIntoCatalog() {
  for (let i = CATALOG.length - 1; i >= 0; i--) if (CATALOG[i].learned) CATALOG.splice(i, 1);
  if (settings.useLearned === false) return;
  const ok = new Set(C.STYLES.map((s) => s.id));
  for (const r of learned) {
    const t = learnedToTrack(r);
    if (t.style && ok.has(t.style) && !CAT_BY_KEY.has(t.key)) CATALOG.push(t);
  }
}
function addLearned(tracks) {
  const have = new Set(learned.map((r) => C.keyOf(r[0], r[1])));
  let n = 0;
  for (const t of tracks) {
    if (!t.videoId || !t.style || !t.key || have.has(t.key) || CAT_BY_KEY.has(t.key)) continue;
    have.add(t.key);
    learned.push([t.artist, t.title, t.style, t.sub || '', t.energy || 3, t.year || 0, t.flags || '', t.videoId, t.type || '']);
    n++;
  }
  if (learned.length > LEARNED_MAX) learned = learned.slice(-LEARNED_MAX);
  if (n) { store({ learnedCat: learned }); mergeLearnedIntoCatalog(); }
  return n;
}

async function artistByName(name) {
  const k = normName(name);
  if (artistCache.names[k]) return { id: artistCache.names[k], name };
  const r = await call('findArtist', name).catch(() => null);
  if (r && r.id) { artistCache.names[k] = r.id; saveArtistCache(); }
  return r;
}
async function artistPageCached(id, n) {
  const c = artistCache.pages[id];
  if (c && Date.now() - c.at < ARTIST_TTL && (c.max >= n || c.songs.length < c.max) && c.about !== undefined) {
    return {
      id, name: c.name, about: c.about, similar: c.similar.map((x) => ({ id: x[0], name: x[1] })),
      songs: c.songs.slice(0, n).map((x) => ({ videoId: x[0], title: x[1], artists: [x[2]], type: x[3], duration: x[4] }))
    };
  }
  const p = await call('artistPage', id, n);
  if (p) {
    artistCache.pages[id] = {
      name: p.name, at: Date.now(), max: n, about: String(p.about || '').slice(0, 1000),
      similar: (p.similar || []).map((x) => [x.id, x.name]),
      songs: (p.songs || []).map((x) => [x.videoId, x.title, (x.artists && x.artists[0]) || p.name, x.type || '', x.duration || 0])
    };
    if (p.name) artistCache.names[normName(p.name)] = id;
    saveArtistCache();
  }
  return p;
}

// Artistes de départ : ceux du catalogue intégré qui collent à l'ambiance.
// Morceaux qui collent à l'ambiance : style obligatoire, sous-style et époque si assez de choix.
function matchSel(pool, sel) {
  let p = pool;
  p = p.filter((t) => C.styleFits(t, sel));
  if (C.hasSubs(sel)) { const p2 = p.filter((t) => C.subFits(t, sel)); if (p2.length >= 3) p = p2; }
  if (sel.era && sel.era !== 'all' && sel.era !== 'actuel') {
    const p3 = p.filter((t) => C.eraMatch(t.year, sel.era, new Date().getFullYear()));
    if (p3.length >= 3) p = p3;
  }
  return p;
}
// Un artiste par morceau tiré au sort, favorisé si son énergie colle et s'il revient souvent.
function rankArtists(pool, sel) {
  const target = Number(sel.energy) || 3;
  const best = new Map();
  const count = new Map();
  for (const t of pool) count.set(t.artist, (count.get(t.artist) || 0) + 1);
  for (const t of pool) {
    const v = Math.random() + (Math.abs((t.energy || 3) - target) <= 1 ? 1 : 0) + Math.min(1, Math.log2(count.get(t.artist)) * 0.4);
    if (!best.has(t.artist) || best.get(t.artist) < v) best.set(t.artist, v);
  }
  return Array.from(best.entries()).sort((a, b) => b[1] - a[1]).map((x) => x[0]);
}

// Artistes de départ : d'abord ceux de tes J'aime qui collent à l'ambiance (une fois classés
// par style), puis le catalogue intégré pour compléter.
function similarSeeds(sel, max) {
  // « Mix de ce titre » : on part de l'artiste du titre aimé.
  if (sel.seed && sel.seed.artist) return { names: [sel.seed.artist], likes: 0 };
  const n = max || 6;
  const liked = likes.items.map((it) => trackFromItem(it)).filter((t) => t.tagged && t.artist);
  const notBanned = (a) => !C.isBanned(bannedSet(), a);
  const fromLikes = liked.length ? rankArtists(matchSel(liked, sel), sel).filter(notBanned).slice(0, n) : [];
  const have = new Set(fromLikes.map(normName));
  let cat = matchSel(CATALOG.filter((t) => !t.learned), sel);
  if (!cat.length) cat = CATALOG.filter((t) => !t.learned);
  const fromCat = rankArtists(cat, sel).filter((a) => !have.has(normName(a)) && notBanned(a)).slice(0, n - fromLikes.length);
  return { names: fromLikes.concat(fromCat), likes: fromLikes.length };
}

// J'aime pas encore classés : Claude les classe en arrière-plan pour les prochaines fois.
function classifyLikesLater() {
  if (!hasKey || classifying) return;
  const missing = likes.items.map((it) => trackFromItem(it)).filter((t) => !t.tagged).slice(0, 400);
  if (!missing.length) return;
  dlog('similaires', "classement en arrière-plan de " + missing.length + " J'aime");
  classify(missing).catch((e) => dlog('similaires', "classement des J'aime raté : " + e.message));
}

async function buildSimilarPool(s) {
  const far = settings.similarDepth === 'loin';
  s.sim = { queue: [], seen: new Set(), done: [], far, busy: false, energy: Number(s.sel.energy) || 3 };
  if (!likes.items.length && ps.loggedIn) {
    s.note = "Lecture de tes J'aime…";
    render();
    await withTimeout(loadLikes(false), 10000).catch(() => null);
    if (session !== s) return;
  }
  const picked = similarSeeds(s.sel, 6);
  const seeds = picked.names;
  if (!seeds.length) throw new Error("pas d'artiste de départ pour cette ambiance");
  for (const n of seeds) s.sim.seen.add(normName(n));
  s.sim.seeds = seeds;
  s.sim.fromLikes = picked.likes;
  s.note = 'Recherche des artistes proches de ' + seeds.slice(0, 3).join(', ') + (picked.likes ? " (tes J'aime)" : '') + '…';
  render();
  dlog('similaires', 'artistes de départ', { graines: seeds, depuis_mes_jaime: picked.likes, loin: far });
  classifyLikesLater();
  const level1 = [];
  for (const name of seeds) {
    if (session !== s) return;
    const a = await artistByName(name).catch(() => null);
    if (!a || !a.id) continue;
    const pg = await artistPageCached(a.id, 5).catch(() => null);
    if (!pg) continue;
    for (const x of pg.similar || []) {
      const k = normName(x.name);
      if (s.sim.seen.has(k)) continue;
      s.sim.seen.add(k);
      level1.push(Object.assign({ depth: 1, from: pg.name || name }, x));
    }
  }
  if (!level1.length) throw new Error("YouTube Music ne propose pas d'artistes similaires pour cette ambiance");
  if (far) {
    // Similaires des similaires : on s'éloigne des artistes de départ.
    s.note = 'Exploration plus loin dans les artistes similaires…';
    render();
    const level2 = [];
    for (const a of shuffle(level1).slice(0, 6)) {
      if (session !== s) return;
      const pg = await artistPageCached(a.id, 5).catch(() => null);
      if (!pg) continue;
      for (const x of pg.similar || []) {
        const k = normName(x.name);
        if (s.sim.seen.has(k)) continue;
        s.sim.seen.add(k);
        level2.push(Object.assign({ depth: 2, from: pg.name || a.name }, x));
      }
    }
    s.sim.queue = shuffle(level2).concat(shuffle(level1));
  } else {
    s.sim.queue = shuffle(level1);
  }
  // Mix de ce titre : l'artiste de départ ouvre le bal avec ses autres titres.
  if (s.sel.seed && s.sel.seed.artist) {
    const a = await artistByName(s.sel.seed.artist).catch(() => null);
    // Avec Last.fm : les artistes proches selon ses auditeurs s'intercalent avec ceux de YouTube Music.
    if (hasLastfm) {
      const r = await withTimeout(claude('lastfmsimilar', { artist: s.sel.seed.artist, limit: 25 }), 6000).catch(() => null);
      const extra = [];
      for (const x of ((r && r.artists) || []).slice(0, 10)) {
        if (session !== s || extra.length >= 6) break;
        const k = normName(x.name);
        if (s.sim.seen.has(k)) continue;
        const b = await withTimeout(artistByName(x.name), 4000).catch(() => null);
        if (!b || !b.id) continue;
        s.sim.seen.add(k);
        extra.push({ depth: 1, from: s.sel.seed.artist, id: b.id, name: b.name || x.name, lastfm: true });
      }
      if (session !== s) return;
      const rest = s.sim.queue.splice(0);
      while (extra.length || rest.length) {
        if (rest.length) s.sim.queue.push(rest.shift());
        if (extra.length) s.sim.queue.push(extra.shift());
      }
      dlog('similaires', 'artistes proches ajoutés par Last.fm', { depart: s.sel.seed.artist, noms: s.sim.queue.filter((q) => q.lastfm).map((q) => q.name) });
    }
    if (a && a.id) s.sim.queue.unshift({ depth: 0, from: '', id: a.id, name: a.name || s.sel.seed.artist });
  }
  const tgt = s.mix || s;
  tgt.pool = [];
  tgt.poolKeys = new Set();
  await expandSimilar(s, 8);
  if (session !== s) return;
  if (!tgt.pool.length) throw new Error('aucun titre trouvé chez les artistes similaires');
}

const SKIP_VERSION = /\b(live|en concert|remix|karaok[ée]|sped up|slowed|nightcore)\b/i;
// Ajoute à la réserve les titres de quelques artistes similaires de plus.
async function expandSimilar(s, nArtists) {
  if (!s.sim || s.sim.busy) return 0;
  s.sim.busy = true;
  const tgt = s.mix || s;
  try {
    const fresh = [];
    const names = [];
    let used = 0;
    const wantLive = /\blive\b|concert/i.test(s.sel.prompt || '');
    while (used < nArtists && s.sim.queue.length) {
      if (session !== s) return 0;
      const a = s.sim.queue.shift();
      if (C.isBanned(bannedSet(), a.name)) continue;
      const pg = await artistPageCached(a.id, 8).catch(() => null);
      if (!pg) continue;
      used++;
      const artistName = pg.name || a.name;
      names.push(artistName);
      // Les similaires de cet artiste nourrissent les explorations suivantes.
      for (const x of pg.similar || []) {
        const k = normName(x.name);
        if (s.sim.seen.has(k)) continue;
        s.sim.seen.add(k);
        s.sim.queue.push(Object.assign({ depth: (a.depth || 1) + 1, from: artistName }, x));
      }
      let kept = 0;
      for (const it of pg.songs || []) {
        if (kept >= 6) break;
        if (!wantLive && SKIP_VERSION.test(it.title || '')) continue;
        const t = trackFromItem(it, { style: C.onlyStyle(s.sel), sub: C.onlySub(s.sel), energy: s.sim.energy });
        if (!t.artist) { t.artist = artistName; t.key = C.keyOf(t.artist, t.title); }
        if (!t.key || !t.videoId || tgt.poolKeys.has(t.key) || s.usedKeys.has(t.key)) continue;
        if ((s.discover || s.mix) && likedIds.has(t.videoId)) continue;
        t.simFrom = a.from;
        tgt.poolKeys.add(t.key);
        fresh.push(t);
        kept++;
      }
    }
    if (!fresh.length) return 0;
    const missing = fresh.filter((t) => !t.tagged);
    if (hasKey && missing.length) {
      s.note = 'Claude classe ' + missing.length + ' titres découverts (style, énergie, époque)…';
      renderSoon();
      try { await classify(missing, (s.sel.prompt || '').trim()); } catch (e) { dlog('similaires', 'classement raté : ' + e.message); }
    }
    if (session !== s) return 0;
    tgt.pool.push(...fresh);
    tgt.levels = C.poolLevels(tgt.pool, s.sel);
    s.sim.done.push(...names);
    const added = addLearned(fresh.filter((t) => t.tagged));
    dlog('similaires', 'exploration', { artistes: names, titres: fresh.length, classes: fresh.filter((t) => t.tagged).length, catalogue_perso: learned.length, nouveaux: added, en_attente: s.sim.queue.length });
    if (s.status === 'preparing') s.note = 'Préparation des titres…';
    return fresh.length;
  } finally {
    s.sim.busy = false;
  }
}

function knownArtists() {
  const count = new Map();
  for (const it of likes.items) {
    const a = it.a || '';
    if (a) count.set(a, (count.get(a) || 0) + 1);
  }
  return Array.from(count.entries()).sort((a, b) => b[1] - a[1]).slice(0, 40).map((x) => x[0]);
}
