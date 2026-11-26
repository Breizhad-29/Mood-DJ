// Mood DJ — panneau et moteur DJ (monde isolé de l’extension) : pont avec la page YouTube Music, appels à l’IA, son, recherche, J’aime et nouveautés, artistes similaires.
// Les fichiers mdj-*.js puis content.js sont chargés dans l’ordre du manifest et partagent la même portée :
// une fonction d’un fichier peut appeler celle d’un autre, mais le code exécuté au chargement ne doit
// utiliser que ce qui est défini dans les fichiers précédents (vérifié par tests/split.test.js).
'use strict';

// ======================================================== pont (RPC)
const pending = new Map();
let rpcSeq = 0;
function call(method) {
  const args = Array.prototype.slice.call(arguments, 1);
  return new Promise((resolve, reject) => {
    const id = (++rpcSeq) + '-' + uid();
    // La réponse de playVoice arrive à la fin de la voix : le délai suit la durée réelle (un dialogue
    // en duo dépasse parfois la minute ; avant, Mood DJ croyait la voix perdue et lançait celle de
    // l'ordinateur par-dessus).
    const ms = method === 'playVoice' ? Math.max(60000, (wavSeconds(args[0]) + 20) * 1000) : method === 'search' || method === 'createPlaylist' || method === 'findArtist' || method === 'artistPage' ? 20000
      : method === 'play' ? 16000 : method === 'browseTracks' ? 90000 : method === 'playJingle' ? 10000 : 8000;
    const timeout = setTimeout(() => {
      pending.delete(id);
      dlog('pont', 'pas de réponse : ' + method);
      reject(new Error('YouTube Music ne répond pas (' + method + ')'));
    }, ms);
    const logIt = !!LOGGED_RPC[method];
    if (logIt) dlog('pont→', method, args.length ? args : undefined);
    pending.set(id, { resolve, reject, timeout, method, logIt, t0: Date.now() });
    window.postMessage({ __mdj: 'content', kind: 'req', id, method, args }, location.origin);
  });
}
const LOGGED_RPC = { play: 1, pause: 1, resume: 1, fadeTo: 1, xfadePrep: 1, xfadeGo: 1, playVoice: 1, playJingle: 1, bedStart: 1, bedStop: 1, stopVoice: 1, seek: 1, initAudio: 1, setInterceptNext: 1, setRate: 1 };
function callSafe() {
  return call.apply(null, arguments).catch(() => null);
}

window.addEventListener('message', (e) => {
  if (e.source !== window) return;
  const m = e.data;
  if (!m || m.__mdj !== 'bridge') return;
  if (m.kind === 'res') {
    const p = pending.get(m.id);
    if (!p) return;
    pending.delete(m.id);
    clearTimeout(p.timeout);
    if (p.logIt) dlog('pont←', p.method + ' (' + (Date.now() - p.t0) + ' ms)', m.ok ? m.result : { erreur: m.error });
    if (m.ok) p.resolve(m.result); else p.reject(new Error(m.error));
  } else if (m.kind === 'evt') {
    if (m.type === 'state') {
      ps = m.data || {};
      if (!bridgeReady) { bridgeReady = true; applySound(); }
      autoplayGuard();
      onTick();
    } else if (m.type === 'next') {
      onUserNext();
    } else if (m.type === 'prev') {
      onUserPrev();
    } else if (m.type === 'log') {
      dlog('pont', m.msg, m.data);
    } else if (m.type === 'youthere') {
      if (session) radioLog(session, 'YouTube Music demandait « Toujours là ? » : confirmé, la musique continue.');
    } else if (m.type === 'ready') {
      bridgeReady = true;
      applySound();
    }
  }
});

// ======================================================== Claude
function claude(action, payload) {
  const t0 = Date.now();
  const info = payload && payload.kind ? ' (' + payload.kind + (payload.duo ? ', duo' : '') + ')' : payload && payload.turns ? ' (' + payload.turns.length + ' réplique' + (payload.turns.length > 1 ? 's' : '') + ')' : '';
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage({ type: 'mdj-claude', action, payload }, (res) => {
        const err = chrome.runtime.lastError;
        const ms = Date.now() - t0;
        if (err) { dlog('api', action + info + ' échec ' + ms + ' ms : ' + err.message); reject(new Error(err.message)); return; }
        if (!res) { dlog('api', action + info + ' sans réponse ' + ms + ' ms'); reject(new Error('pas de réponse')); return; }
        if (res.ok) {
          const d = res.data;
          dlog('api', action + info + ' ok ' + ms + ' ms', typeof d === 'string' ? { texte: d } : d && d.b64 ? { audio: Math.round(d.b64.length * 0.75) + ' octets', type: d.mime } : undefined);
          resolve(d);
        } else { dlog('api', action + info + ' échec ' + ms + ' ms : ' + res.error); reject(new Error(res.error)); }
      });
    } catch (e) {
      reject(new Error('extension rechargée : actualise la page'));
    }
  });
}

// ======================================================== son
function soundSel() {
  return session && session.status !== 'ended' ? session.sel : sel;
}
function effectiveEq() {
  return settings.autoSound ? C.autoEq(soundSel()) : settings.eq;
}
function effectiveFade() {
  const f = Number(settings.fade) || 0;
  return settings.autoSound ? C.autoFade(soundSel(), f) : f;
}
function effectiveRate() {
  return session && session.status === 'playing' ? (Number(settings.tempo) || 100) / 100 : 1;
}
function applySound() {
  if (!bridgeReady) return;
  callSafe('setEq', effectiveEq());
  callSafe('setBoost', !!settings.boost);
}

// ======================================================== recherche
async function resolveTrack(t) {
  const lenient = t.style === 'classique' || t.style === 'bo';
  const c = cache[t.key];
  if (c) {
    if (c.v) return { videoId: c.v, duration: c.d || 0, type: c.t || '', ytTitle: c.n || t.title };
    if (Date.now() - (c.at || 0) < 7 * 864e5) return null;
  }
  const q = t.title + ' ' + t.artist;
  let items;
  try {
    items = await call('search', q, true);
  } catch (e) {
    return undefined; // erreur réseau : on ne met rien en cache
  }
  let m = C.bestMatch(t, items, lenient);
  if (!m) {
    try { m = C.bestMatch(t, await call('search', q, false), lenient); } catch (e) { /* ignore */ }
  }
  if (!m) {
    cache[t.key] = { v: null, at: Date.now() };
    saveCache();
    return null;
  }
  cache[t.key] = { v: m.videoId, d: m.duration || 0, t: m.type || '', n: m.title, at: Date.now() };
  saveCache();
  return { videoId: m.videoId, duration: m.duration || 0, type: m.type || '', ytTitle: m.title };
}

// ===================================================== J'aime et nouveautés
function indexLikes() {
  likedKeys = new Set(likes.items.map((x) => C.keyOf(x.a, x.t)));
  likedIds = new Set(likes.items.map((x) => x.v));
}

function firstArtist(it) {
  if (it.artists && it.artists.length) return it.artists[0];
  return String(it.subtitle || '').split(' • ')[0] || '';
}

async function loadLikes(force) {
  if (!force && likes.items.length && Date.now() - likes.at < 12 * 3600e3) return likes.items;
  if (!ps.loggedIn) throw new Error("Connecte-toi à YouTube Music pour utiliser tes J'aime.");
  likesLoading = true;
  render();
  try {
    const items = await call('browseTracks', 'VLLM', 3000, true);
    likes = {
      at: Date.now(),
      items: (items || []).map((it) => ({ v: it.videoId, t: it.title, a: firstArtist(it), d: it.duration || 0, y: it.type || '' }))
    };
    indexLikes();
    store({ likes });
    return likes.items;
  } finally {
    likesLoading = false;
    render();
  }
}

function applyMeta(t) {
  const c = CAT_BY_KEY.get(t.key);
  if (c) {
    Object.assign(t, { style: c.style, sub: c.sub, energy: c.energy, year: c.year, flags: c.flags, tagged: true });
    return t;
  }
  const m = meta[t.key];
  if (m) Object.assign(t, { style: m.s || '', sub: m.ss || '', energy: m.e || 3, year: m.y || 0, flags: m.f || '', tagged: true });
  return t;
}

function trackFromItem(it, defaults) {
  const artist = it.a !== undefined ? it.a : firstArtist(it);
  const title = it.t !== undefined ? it.t : it.title;
  const t = Object.assign({
    artist, title, key: C.keyOf(artist, title),
    videoId: it.v || it.videoId, duration: it.d || it.duration || 0, type: it.y || it.type || '',
    style: '', sub: '', energy: 3, year: 0, flags: '', tagged: false
  }, defaults || {});
  return applyMeta(t);
}

async function classify(tracks, prompt) {
  classifying++;
  try {
    for (let i = 0; i < tracks.length; i += 80) {
      const batch = tracks.slice(i, i + 80);
      const res = await claude('classify', {
        items: batch.map((t, j) => ({ id: String(j), artist: t.artist, title: t.title })),
        prompt: prompt || '', styleGuide: styleGuideText()
      });
      for (const r of res || []) {
        const t = batch[Number(r.id)];
        if (!t) continue;
        meta[t.key] = { s: r.style, ss: r.sub, e: r.energy, y: r.year, f: r.flags };
        if (typeof r.fit === 'number') t.fit = r.fit;
        if (!CAT_BY_KEY.has(t.key)) applyMeta(t);
      }
      saveMeta();
    }
  } finally {
    classifying--;
  }
}

async function buildLikesPool(s) {
  const items = await loadLikes(false);
  if (!items.length) throw new Error("Aucun titre J'aime trouvé sur ton compte.");
  const tracks = items.map((it) => trackFromItem(it));
  if (hasKey) {
    const missing = tracks.filter((t) => !t.tagged);
    if (missing.length) {
      s.note = "Claude classe tes J'aime (" + missing.length + ' titres à découvrir)…';
      render();
      try { await classify(missing.slice(0, 160)); } catch (e) { toast('Classement : ' + e.message); }
      if (missing.length > 160) {
        classify(missing.slice(160)).then(() => {
          if (session === s) s.levels = C.poolLevels(s.pool, s.sel);
        }).catch(() => {});
      }
    }
  }
  s.pool = tracks;
  s.levels = C.poolLevels(tracks, s.sel);
}

const NEW_WORDS = /nouveaut|new|fresh|release|hotlist|hits|today|radar|sorties/i;
const GENERIC = new Set(['nouveautes', 'new', 'hits', 'hotlist', 'musique']);

function rankPlaylists(pls, query) {
  const year = new Date().getFullYear();
  const keys = C.tokens(query).filter((w) => !GENERIC.has(w) && w.length >= 3);
  return (pls || [])
    .map((p, i) => {
      const yrs = (p.title.match(/(19|20)\d\d/g) || []).map(Number);
      const old = yrs.some((y) => y < year - 1) || /ann[ée]es\s/i.test(p.title);
      const tt = C.tokens(p.title);
      const rel = keys.length ? keys.some((k) => tt.includes(k)) : true;
      const score = (NEW_WORDS.test(p.title) ? 2 : 0) + (rel ? 2 : 0) + (6 - Math.min(i, 6)) * 0.1;
      return { p, score, ok: /youtube music/i.test(p.subtitle) && !old };
    })
    .filter((x) => x.ok)
    .sort((a, b) => b.score - a.score);
}

async function buildLivePool(s) {
  // Une recherche par style choisi (4 au plus) ; chaque titre garde le style de sa playlist.
  const queries = C.liveQueries(s.sel).slice(0, 4);
  const perQuery = queries.length > 1 ? 1 : 2;
  const perList = Math.max(40, Math.round(150 / queries.length));
  s.note = 'Recherche des nouveautés sur YouTube Music…';
  render();
  const seen = new Set();
  const tracks = [];
  const chosen = [];
  const tagOf = new Map();
  for (const q of queries) {
    let ranked = [];
    try { ranked = rankPlaylists(await call('searchPlaylists', q.query), q.query); } catch (e) { continue; }
    let picks = ranked.filter((x) => x.score >= 2).slice(0, perQuery).map((x) => x.p);
    if (!picks.length && ranked.length) picks = [ranked[0].p];
    for (const p of picks) {
      if (chosen.some((c) => c.browseId === p.browseId)) continue;
      chosen.push(p);
      const items = await call('browseTracks', p.browseId, perList, false).catch(() => []);
      for (const it of items || []) {
        if (!it.videoId || seen.has(it.videoId)) continue;
        seen.add(it.videoId);
        const t = trackFromItem(it, { style: q.style, sub: q.sub, year: new Date().getFullYear() });
        tagOf.set(t, q);
        tracks.push(t);
      }
    }
  }
  if (!chosen.length) throw new Error('aucune playlist de nouveautés trouvée');
  if (!tracks.length) throw new Error('playlists vides');
  s.liveNames = chosen.map((p) => p.title);
  const prompt = (s.sel.prompt || '').trim();
  if (hasKey) {
    s.note = 'Claude écoute les nouveautés…';
    render();
    try { await classify(tracks.slice(0, 160), prompt); } catch (e) { toast('Classement : ' + e.message); }
    // Le style vient de la playlist ; on garde l'énergie et l'humeur estimées.
    for (const t of tracks) {
      const q = tagOf.get(t);
      // Le style vient de la playlist ; si elle couvre « tous styles », on garde celui estimé par Claude.
      if (q && q.style) { t.style = q.style; t.sub = q.sub; }
      t.year = new Date().getFullYear();
    }
  }
  s.pool = tracks;
  s.levels = [tracks];
}

// ================================================== artistes similaires
// Catalogue personnel : titres découverts chez les artistes similaires, classés, gardés ici.
// Une entrée : [artiste, titre, style, sous-style, énergie, année, humeurs, videoId, type].
let learned = [];
const LEARNED_MAX = 20000;
let artistCache = { names: {}, pages: {} };
const ARTIST_TTL = 30 * 86400000;
const normName = (x) => String(x || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '');
const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
let artistSaveTimer = 0;
// Fiches Wikipédia des morceaux (anecdotes), gardées 60 jours.
let wikiCache = {};
let wikiSaveTimer = null;
const WIKI_TTL = 60 * 86400000;
function saveWikiCache() {
  clearTimeout(wikiSaveTimer);
  wikiSaveTimer = setTimeout(() => {
    const keys = Object.keys(wikiCache);
    if (keys.length > 4000) {
      keys.sort((a, b) => wikiCache[a].at - wikiCache[b].at);
      for (const k of keys.slice(0, keys.length - 4000)) delete wikiCache[k];
    }
    store({ wikiCache });
  }, 3000);
}
