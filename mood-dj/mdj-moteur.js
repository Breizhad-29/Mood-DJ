// Mood DJ — panneau et moteur DJ (monde isolé de l’extension) : moteur de lecture : file d’attente, choix des titres, liste noire.
// Les fichiers mdj-*.js puis content.js sont chargés dans l’ordre du manifest et partagent la même portée :
// une fonction d’un fichier peut appeler celle d’un autre, mais le code exécuté au chargement ne doit
// utiliser que ce qui est défini dans les fichiers précédents (vérifié par tests/split.test.js).
'use strict';

// ======================================================== moteur
const styleText = (s) => C.styleText(s);
function plainLabel(s) {
  if (s.prompt && s.prompt.trim()) return s.prompt.trim();
  return styleText(s) + ' · ' + C.momentById(s.moment).label.toLowerCase();
}
function selLabel(s) {
  if (s.seed && s.seed.artist && s.source === 'similar') return 'Dans l’esprit de ' + s.seed.artist + (s.seed.title ? ' – ' + s.seed.title : '');
  return s.prompt && s.prompt.trim() ? '« ' + s.prompt.trim() + ' »' : plainLabel(s);
}
// Ambiance dite en anglais par les phrases toutes faites (styles et moment traduits par le dictionnaire).
function ambianceEn(s) {
  if (s.prompt && s.prompt.trim()) return s.prompt.trim();
  const en = (x) => tr(x, true);
  const names = C.styleList(s.style).map((id) => { const st = C.styleById(id); return st ? en(st.label) : id; });
  const styles = !names.length ? 'all styles' : names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] : names[0];
  const m = C.momentById(s.moment);
  return styles + (m ? ' · ' + en(m.label).toLowerCase() : '');
}
const moodLabel = (id) => (C.MOODS.find((m) => m[0] === id) || [])[1] || '';
const eraLabel = (id) => C.eraText(id);

function newSession(snap, opts) {
  const useClaude = !!(snap.prompt && snap.prompt.trim()) && hasKey;
  const mo = C.momentById(snap.moment);
  let source = useClaude ? 'claude' : 'catalog';
  if (snap.source === 'similar') source = 'similar';
  else if (snap.source === 'likes') source = 'likes';
  else if (snap.era === 'actuel') source = 'live';
  const s = {
    id: uid(), startedAt: Date.now(), mode: snap.mode, source, discover: snap.source === 'discover', sel: snap,
    label: selLabel(snap), levels: C.catalogLevels(CATALOG, snap),
    pool: [], poolKeys: new Set(), poolExhausted: false, fetchingPool: false,
    usedKeys: new Set(), failedKeys: new Set(Object.keys(learn.disliked || {})),
    queue: [], played: [], current: null, playedSec: 0,
    status: 'preparing', note: 'Préparation des titres…', transitions: 0,
    timer: { kind: 'off', endAt: 0 }, timerFading: false, lastUserNextAt: 0,
    saveOnly: !!opts.saveOnly, span: C.cycleMinutes(snap), loop: mo.loop, spanOffset: 0, targetSec: 0, endAt: 0,
    announceNext: true, filling: false, fillPromise: null, advancing: false, ending: false,
    expecting: null, lastRemaining: null, silentSince: 0,
    show: opts.show || null
  };
  // Mix de ce titre : le titre de départ ne revient pas tout de suite.
  if (snap.seed && snap.seed.artist) s.usedKeys.add(C.keyOf(snap.seed.artist, snap.seed.title || ''));
  if (s.mode === 'fixe') {
    const min = snap.duration === 'until' ? C.minutesUntil(snap.until) : (Number(snap.duration) || 90);
    s.targetSec = min * 60;
    if (snap.duration === 'until') s.endAt = Date.now() + min * 60000;
  }
  // L'onglet Ambiance montre l'ambiance de l'émission lancée (grille, mix de ce titre…) : sinon il
  // afficherait des « modifications en attente » qui n'en sont pas.
  if (!opts.saveOnly) revertSelToSession(s);
  return s;
}

const sumDur = (list) => list.reduce((a, t) => a + (t && t.duration ? t.duration : 0), 0);
function plannedTotal(s) {
  return s.playedSec + (s.current ? (s.current.duration || 0) : 0) + sumDur(s.queue);
}
function contentTime(s) {
  const cur = s.current;
  const t = cur && ps.videoId === cur.videoId ? (ps.time || 0) : 0;
  return s.playedSec + t;
}
function posFromSec(s, sec) {
  if (s.mode === 'fixe') return C.clamp(s.targetSec ? sec / s.targetSec : 0, 0, 1);
  const x = Math.max(0, sec - (s.spanOffset || 0)) / (Math.max(5, s.span) * 60);
  return s.loop ? x - Math.floor(x) : Math.min(1, x);
}

// Change la durée du cycle sans faire sauter la courbe : on garde la position actuelle.
function setSpan(s, minutes) {
  const now = contentTime(s);
  const p = posFromSec(s, now);
  s.span = Math.max(5, Number(minutes) || 60);
  s.spanOffset = now - p * s.span * 60;
}

function recentSet() {
  return new Set(learn.recent || []);
}
function remember(t) {
  if (!t || !t.key) return;
  learn.recent = (learn.recent || []).filter((k) => k !== t.key);
  learn.recent.push(t.key);
  if (learn.recent.length > 250) learn.recent = learn.recent.slice(-250);
  // Écoutes datées (60 jours) pour les clins d'œil de l'animateur.
  const now = Date.now();
  const plays = learn.plays || (learn.plays = {});
  const add = (k, max) => { plays[k] = (plays[k] || []).filter((x) => now - x < 60 * 86400000).concat([now]).slice(-max); };
  add(t.key, 20);
  if (t.artist) add('a:' + C.artistKey(t.artist), 60);
  const keys = Object.keys(plays);
  if (keys.length > 1500) {
    keys.sort((a, b) => plays[a][plays[a].length - 1] - plays[b][plays[b].length - 1]);
    for (const k of keys.slice(0, keys.length - 1200)) delete plays[k];
  }
  saveLearn();
}

// Artistes déjà passés 2 fois dans la dernière heure (titres prévus compris) : un artiste
// découvert par les similaires n'est pas reprogrammé avant qu'un autre ait eu sa chance.
const SIM_CAP = 2;
function cappedArtists(s) {
  const now = Date.now();
  const count = new Map();
  const recent = s.played.filter((t) => !t.playAt || now - t.playAt < 3600e3).concat(s.current ? [s.current] : [], s.queue);
  for (const t of recent) { const ak = C.artistKey(t.artist); count.set(ak, (count.get(ak) || 0) + 1); }
  return new Set([...count.entries()].filter((e) => e[1] >= SIM_CAP).map((e) => e[0]));
}
// Nombre d'artistes encore disponibles (titres non joués, artiste pas au plafond) dans une réserve de similaires.
function simArtistsLeft(s, levels) {
  const capped = cappedArtists(s);
  const left = new Set();
  for (const pool of levels || []) for (const t of pool) {
    if (s.usedKeys.has(t.key) || s.failedKeys.has(t.key)) continue;
    const ak = C.artistKey(t.artist);
    if (!capped.has(ak)) left.add(ak);
  }
  return left.size;
}
// Relance l'exploration quand la réserve n'offre plus assez d'artistes différents (au plus toutes les 3 min).
function needSimDiversity(s, levels) {
  if (!s.sim || !s.sim.queue.length || Date.now() - (s.sim.divAt || 0) < 180000) return false;
  if (simArtistsLeft(s, levels) >= 6) return false;
  s.sim.divAt = Date.now();
  dlog('similaires', "peu d'artistes différents en réserve : nouvelle exploration", { disponibles: simArtistsLeft(s, levels), en_attente: s.sim.queue.length });
  return true;
}

function pickCtx(s, target) {
  const seq = s.played.concat(s.current ? [s.current] : [], s.queue);
  // Distance (en titres) depuis le dernier passage de chaque artiste : on évite de le reprogrammer trop tôt.
  const artistDist = {};
  for (let i = seq.length - 1, d = 1; i >= 0 && d <= 10; i--, d++) {
    const ak = C.artistKey(seq[i].artist);
    if (!(ak in artistDist)) artistDist[ak] = d;
  }
  return {
    target, used: s.usedKeys, failed: s.failedKeys, artistDist, banned: bannedSet(),
    lastArtists: seq.slice(-3).map((t) => C.artistKey(t.artist)),
    skips: learn.skips, recent: recentSet(), sel: s.sel,
    excluded: s.discover ? discoverExcluded() : null
  };
}

// ---------------------------------------------------------- liste noire
// Artistes à ne plus jamais passer (learn.banned : clé → nom affiché). Vaut pour toutes les sources.
let bannedCache = null;
function bannedSet() {
  if (!bannedCache) bannedCache = new Set(Object.keys(learn.banned || {}));
  return bannedCache;
}
function banArtist(name) {
  const n = String(name || '').trim();
  if (!n) return;
  learn.banned = learn.banned || {};
  learn.banned[C.artistKey(n)] = n;
  bannedCache = null;
  saveLearn();
  dlog('session', 'artiste en liste noire', { artiste: n });
  const s = session;
  let skipNow = false;
  if (s) {
    const before = s.queue.length;
    s.queue = s.queue.filter((t) => !C.isBanned(bannedSet(), t.artist));
    if (s.pool) s.pool = s.pool.filter((t) => !C.isBanned(bannedSet(), t.artist));
    if (s.queue.length < before && s.status === 'playing') ensureQueue();
    skipNow = !!(s.current && s.status === 'playing' && C.isBanned(bannedSet(), s.current.artist));
  }
  toast(n + ' est en liste noire : plus aucun de ses titres ne passera.', { label: 'Annuler', fn: () => unbanArtist(C.artistKey(n)) }, 8000);
  if (skipNow) skip();
  render();
}
function unbanArtist(key) {
  if (!learn.banned || !learn.banned[key]) return;
  const n = learn.banned[key];
  delete learn.banned[key];
  bannedCache = null;
  saveLearn();
  toast(n + ' peut de nouveau passer.', null, 3000);
  render();
}

function discoverExcluded() {
  const ex = new Set(likedKeys);
  for (const id of likedIds) ex.add(id);
  for (const k of learn.recent || []) ex.add(k);
  return ex;
}

function availablePool(s) {
  return s.pool.filter((t) => !s.usedKeys.has(t.key) && !s.failedKeys.has(t.key)).length;
}

async function fetchClaudePool(s, count) {
  if (s.fetchingPool) return;
  s.fetchingPool = true;
  try {
    const seq = s.played.concat(s.current ? [s.current] : [], s.queue, s.pool);
    const exclude = seq.map((t) => t.artist + ' – ' + t.title).slice(-120);
    const avoidArtists = Object.keys(learn.skips || {})
      .filter((k) => learn.skips[k] >= 2)
      .map((k) => (learn.skipNames && learn.skipNames[k]) || k)
      .slice(0, 15);
    const list = await claude('tracks', {
      prompt: (s.sel.prompt || '').trim(),
      styleHint: C.styleList(s.sel.style).length ? styleText(s.sel) : '',
      moment: C.momentById(s.sel.moment).label,
      energy: s.sel.energy,
      mood: moodLabel(s.sel.mood),
      era: s.sel.era && s.sel.era !== 'all' ? eraLabel(s.sel.era) : '',
      instrumental: s.sel.moment === 'concentration' || s.sel.moment === 'meditation',
      count, exclude, avoidArtists, bannedArtists: Object.values(learn.banned || {}).slice(0, 60),
      discover: !!s.discover,
      knownArtists: s.discover ? knownArtists() : []
    });
    for (const t of list || []) {
      const key = C.keyOf(t.artist, t.title);
      if (s.poolKeys.has(key) || s.usedKeys.has(key) || C.isBanned(bannedSet(), t.artist)) continue;
      s.poolKeys.add(key);
      s.pool.push({ artist: t.artist, title: t.title, energy: t.energy, year: t.year, flags: '', style: '', sub: '', key });
    }
  } finally {
    s.fetchingPool = false;
  }
}

// Mélange « Mes J'aime » : 1 titre de tes J'aime, puis 1, 2 ou 3 titres d'artistes similaires.
function pickMix(s, target) {
  const m = s.mix;
  const wantSim = m.n % (m.ratio + 1) !== 0;
  const fromSim = () => (m.levels && m.levels.length
    ? C.pickTrack(m.levels, Object.assign(pickCtx(s, target), { capped: cappedArtists(s) })) || C.pickTrack(m.levels, pickCtx(s, target)) : null);
  const fromLikes = () => C.pickTrack(s.levels, pickCtx(s, target));
  const t = wantSim ? (fromSim() || fromLikes()) : (fromLikes() || fromSim());
  if (t) m.n++;
  return t;
}
function availableMix(s) {
  return s.mix ? s.mix.pool.filter((t) => !s.usedKeys.has(t.key) && !s.failedKeys.has(t.key)).length : 0;
}

function pickFor(s, target) {
  if (s.source === 'claude') return C.pickTrack([s.pool], pickCtx(s, target));
  if (s.mix) {
    const m = pickMix(s, target);
    if (m) return m;
  }
  let t = s.source === 'similar' ? C.pickTrack(s.levels, Object.assign(pickCtx(s, target), { capped: cappedArtists(s) })) : null;
  if (!t) t = C.pickTrack(s.levels, pickCtx(s, target));
  if (!t && s.source !== 'catalog' && s.discover) return null;
  if (!t) {
    // Catalogue épuisé pour cette ambiance : on autorise les reprises sauf les 15 derniers titres.
    const seq = s.played.concat(s.current ? [s.current] : [], s.queue);
    s.usedKeys = new Set(seq.slice(-15).map((x) => x.key));
    t = C.pickTrack(s.levels, pickCtx(s, target));
  }
  return t;
}

// Sélection fixe : la durée est une cible, pas un compte à la seconde. On ajoute un titre tant
// qu'il manque plus de 2 min : la sélection finit donc un peu avant ou un peu après la cible,
// toujours à la fin d'un titre.
const FIXE_SLACK = 120;
function needMore(s) {
  if (s.mode === 'fixe') return !s.finishing && plannedTotal(s) < s.targetSec - FIXE_SLACK;
  return s.queue.length < LOOKAHEAD;
}

function ensureQueue() {
  const s = session;
  if (!s) return Promise.resolve();
  if (s.filling) return s.fillPromise;
  s.filling = true;
  s.fillPromise = (async () => {
    try {
      let guard = 0;
      let misses = 0;
      while (session === s && s.status !== 'ended' && guard++ < 300 && needMore(s)) {
        if (s.source === 'claude' && availablePool(s) < 3 && !s.poolExhausted) {
          const before = s.pool.length;
          try { await fetchClaudePool(s, 12); } catch (e) { s.poolError = e.message; }
          if (session !== s) return;
          if (s.pool.length === before) s.poolExhausted = true;
        }
        if (s.source === 'similar' && s.sim && (availablePool(s) < 4 || needSimDiversity(s, s.levels)) && !s.poolExhausted) {
          const got = await expandSimilar(s, 5).catch(() => 0);
          if (session !== s) return;
          if (!got && !s.sim.queue.length) s.poolExhausted = true;
        }
        if (s.mix && s.sim && (availableMix(s) < 4 || needSimDiversity(s, s.mix.levels)) && !s.mix.exhausted) {
          const got = await expandSimilar(s, 4).catch(() => 0);
          if (session !== s) return;
          if (!got && !s.sim.queue.length) s.mix.exhausted = true;
        }
        const target = C.targetEnergy(s.sel, posFromSec(s, plannedTotal(s)));
        let cand = pickFor(s, target);
        if (!cand && s.source === 'claude') {
          s.source = 'catalog';
          s.levels = C.catalogLevels(CATALOG, s.sel);
          toast('Claude ne propose plus de titres : je continue avec le catalogue intégré.');
          cand = pickFor(s, target);
        }
        if (!cand) break;
        s.usedKeys.add(cand.key);
        let res = cand.videoId ? { videoId: cand.videoId, duration: cand.duration || 0, type: cand.type || '' } : await resolveTrack(cand);
        if (session !== s) return;
        if (res && s.discover && likedIds.has(res.videoId)) res = null;
        if (!res) {
          s.usedKeys.delete(cand.key);
          s.failedKeys.add(cand.key);
          if (++misses > 25) break;
          continue;
        }
        misses = 0;
        s.queue.push(Object.assign({}, cand, res, { id: uid() }));
        if (s.saveOnly || s.status === 'preparing') {
          s.note = s.saveOnly ? 'Préparation de la playlist : ' + s.queue.length + ' titres trouvés…' : s.note;
        }
        renderSoon();
      }
    } finally {
      s.filling = false;
    }
  })();
  return s.fillPromise;
}

async function waitQueue(s, n, ms) {
  const end = Date.now() + ms;
  while (Date.now() < end && session === s) {
    if (s.queue.length >= n) return true;
    if (!s.filling) return s.queue.length >= n;
    await sleep(200);
  }
  return s.queue.length >= n;
}

async function startSession(snap, opts) {
  if (!bridgeReady) {
    toast("YouTube Music n'est pas encore prêt. Si ça dure, actualise la page.");
    return;
  }
  if (snap.prompt.trim() && !hasKey) toast('Pas de clé API : sélection tirée du catalogue intégré.');
  if (!opts.saveOnly) {
    const a = await call('initAudio').catch(() => null);
    if (!a || !a.ok) toast("Le son passe par le volume du lecteur (l'égaliseur sera actif à la prochaine sélection).");
  }
  checkDuplicate(true);
  dlog('session', 'lancement', {
    source: snap.source, mode: snap.mode, style: snap.style, sous: snap.sub, moment: snap.moment, energie: snap.energy, humeur: snap.mood,
    epoque: snap.era, cycle: snap.cycle, duree: snap.duration, libre: snap.prompt ? 'oui' : 'non', melange: snap.source === 'likes' ? snap.likesMix || 'off' : undefined,
    fondu: effectiveFade(), radio: settings.radio, annonces: settings.radioFreq, interludes: settings.interludes, moment_annonce: settings.announceAt,
    voix: settings.voiceEngine, duo: settings.duo, prioritaire: settings.priority, jingles: settings.jingles, fond: settings.radioBed, claude: settings.claudeAnnounce
  });
  if (session && session.status !== 'ended') { session.status = 'ended'; session.endedReason = 'replaced'; }
  const s = newSession(snap, opts);
  session = s;
  if (!opts.saveOnly) tab = 'encours';
  render();

  if (s.discover || s.source === 'likes') {
    try {
      s.note = "Lecture de tes J'aime…";
      render();
      await loadLikes(false);
    } catch (e) {
      if (s.source === 'likes') {
        s.status = 'ended';
        s.note = e.message;
        render();
        toast(e.message);
        return;
      }
      toast(e.message + ' La découverte écarte seulement ton historique Mood DJ.', null, 8000);
    }
    if (session !== s) return;
  }
  if (s.source === 'likes') {
    try {
      await buildLikesPool(s);
    } catch (e) {
      s.status = 'ended';
      s.note = e.message;
      render();
      toast(e.message);
      return;
    }
    if (session !== s) return;
    const ratio = Number(s.sel.likesMix) || 0;
    if (ratio > 0) {
      s.mix = { ratio, n: 0, pool: [], poolKeys: new Set(), levels: [], exhausted: false };
      try {
        await buildSimilarPool(s);
        dlog('similaires', "mélange avec tes J'aime", { pour_un_jaime: ratio, titres_similaires: s.mix.pool.length });
      } catch (e) {
        dlog('similaires', 'mélange impossible : ' + e.message);
        toast('Titres similaires indisponibles (' + e.message + "). Je joue tes J'aime seuls.", null, 7000);
        s.mix = null;
      }
      if (session !== s) return;
    }
  } else if (s.source === 'similar') {
    try {
      await buildSimilarPool(s);
    } catch (e) {
      toast('Artistes similaires : ' + e.message + '. Je prends le catalogue intégré.', null, 8000);
      dlog('similaires', 'échec : ' + e.message);
      s.source = 'catalog';
      s.levels = C.catalogLevels(CATALOG, s.sel);
    }
    if (session !== s) return;
  } else if (s.source === 'live') {
    try {
      await buildLivePool(s);
    } catch (e) {
      toast('Nouveautés : ' + e.message + '. Je prends les années 2020 à la place.', null, 8000);
      s.sel.era = '2020';
      s.source = snap.prompt.trim() && hasKey ? 'claude' : 'catalog';
      s.levels = C.catalogLevels(CATALOG, s.sel);
    }
    if (session !== s) return;
  }

  if (s.source === 'claude') {
    s.note = 'Claude prépare la sélection…';
    render();
    try {
      const n = s.mode === 'fixe' ? Math.ceil(s.targetSec / 220) + 6 : 16;
      await fetchClaudePool(s, Math.min(60, n));
      if (!s.pool.length) throw new Error('aucun titre reçu');
    } catch (e) {
      s.source = 'catalog';
      toast('Claude : ' + e.message + '. Je prends le catalogue intégré.');
    }
    if (session !== s) return;
  }

  if (opts.saveOnly) {
    s.note = 'Préparation de la playlist…';
    render();
    await ensureQueue();
    if (session !== s) return;
    await savePlaylist(s);
    s.status = 'ended';
    s.endedReason = 'saved';
    s.note = 'Playlist préparée.';
    render();
    return;
  }

  s.note = 'Recherche des titres sur YouTube Music…';
  render();
  ensureQueue();
  const ok = await waitQueue(s, 1, 40000);
  if (session !== s) return;
  if (!ok) {
    s.status = 'ended';
    s.endedReason = 'vide';
    s.note = 'Aucun titre trouvé sur YouTube Music.';
    render();
    toast("Aucun titre trouvé. Vérifie ta connexion ou change d'ambiance.");
    return;
  }
  // Programme : les 3 premiers titres doivent être connus pour l'annonce d'ouverture.
  if (programmeOn() && s.queue.length < 3) {
    await waitQueue(s, 3, 12000);
    if (session !== s) return;
  }
  // Fiches des premiers titres cherchées tout de suite : l'intro et les premières annonces les trouvent prêtes.
  if (settings.radio && settings.claudeAnnounce && hasKey) for (const t of s.queue.slice(0, 3)) factsFor(t).catch(() => null);
  s.status = 'playing';
  s.note = '';
  await callSafe('setInterceptNext', true);
  applySound();
  const first = s.queue.shift();
  const k = announceKind(s, 0, 'start', false, first);
  if (!k) radioLog(s, quietReason(0, 'start'));
  if (k === 'intro') {
    // L'intro passe d'abord, le premier titre monte sous ses derniers mots.
    first.announceKind = null;
    await runIntro(s, first);
    if (session !== s || s.status !== 'playing') return;
    if (s.ramping === first) {
      await s.rampP;
      s.ramping = null;
      s.rampP = null;
      if (session === s && s.current === first && !first.fadingOut) { first.fadeInAt = Date.now(); callSafe('fadeTo', 1, 2.5); }
    } else {
      s.ramping = null;
      first.afterInterlude = true;
      await playTrack(s, first);
    }
  } else {
    first.announceKind = k;
    await playTrack(s, first);
  }
  ensureQueue();
  render();
}

async function playTrack(s, track, opts) {
  if (!track || session !== s) return;
  if (s.fadeVoice && s.fadeVoice.key !== track.key) { hush(); s.fadeVoice = null; s.announcing = false; }
  s.current = track;
  // Durée de la fiche du titre (résultat de recherche), gardée à part : track.duration est
  // ensuite complétée par le lecteur.
  if (!track.listedDur) track.listedDur = Number(track.duration) || 0;
  track.lockDur = 0;
  track.durWarned = false;
  track.prevRawDur = 0;
  track.durJumpLogged = false;
  track.fadedIn = false;
  track.fadingOut = false;
  track.xfPrep = 0;
  track.xfTried = false;
  track.xfPending = false;
  track.silenceSkipped = 0;
  track.lastTime = 0;
  track.lastTickAt = 0;
  track.fadeInAt = 0;
  s.lastRemaining = null;
  s.silentSince = 0;
  s.expecting = { videoId: track.videoId, since: Date.now() };
  track.playAt = Date.now();
  track.kickAt = 0;
  // L'annonce préparée pour ce titre reste disponible pour son démarrage (sinon elle serait refaite).
  s.startPrefetch = s.prefetch && s.prefetch.key === track.key ? s.prefetch : null;
  s.prefetch = null;
  dlog('piste', 'lecture « ' + track.title + ' » — ' + track.artist, { vid: track.videoId, energie: track.energy, intervention: track.announceKind || 'aucune', rang: s.transitions, invite: !!track.guest });
  await callSafe('fadeTo', effectiveFade() > 0 || (opts && opts.silent) ? 0 : 1, 0);
  render();
  let r = null;
  try { r = await call('play', track.videoId, { type: track.type }); } catch (e) { r = null; }
  if (session !== s || s.current !== track) return;
  if (!r || !r.ok) {
    s.expecting = null;
    s.failedKeys.add(track.key);
    s.current = null;
    toast('Impossible de lancer « ' + track.title + ' », je passe au suivant.');
    await sleep(400);
    advance('failed');
    return;
  }
  callSafe('setRate', effectiveRate());
  if (s.mode === 'continu') ensureQueue();
}
