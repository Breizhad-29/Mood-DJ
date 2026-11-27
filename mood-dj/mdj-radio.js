// Mood DJ — panneau et moteur DJ (monde isolé de l’extension) : animateur radio : rythme, programme des 3 titres, jeux, phrases toutes faites, variété, grille d’émissions, dédicaces.
// Les fichiers mdj-*.js puis content.js sont chargés dans l’ordre du manifest et partagent la même portée :
// une fonction d’un fichier peut appeler celle d’un autre, mais le code exécuté au chargement ne doit
// utiliser que ce qui est défini dans les fichiers précédents (vérifié par tests/split.test.js).
'use strict';

// ===================================================== animateur radio
const HOST_STYLE_LABELS = [['chaleureux', 'Chaleureux'], ['decale', 'Décalé'], ['nuit', 'Voix de nuit'], ['pro', 'Pro FM'],
  ['generaliste', 'Radio généraliste'], ['sport', 'Commentateur sportif'], ['tele', 'Présentateur télé'],
  ['rock', 'Rock\'n\'roll'], ['erudit', 'Mélomane érudit'], ['morning', 'Matinale survoltée'], ['conteur', 'Conteur nostalgique'],
  ['pince', 'Pince-sans-rire'], ['zen', 'Zen']];
const INTERLUDES = [['off', 'Jamais'], ['parfois', 'Parfois'], ['souvent', 'Souvent']];

// Voix Gemini (nom, genre, caractère).
const GEMINI_VOICES = [
  ['Achird', 'homme', 'amicale'], ['Puck', 'homme', 'enjouée'], ['Sadachbia', 'homme', 'vive'], ['Fenrir', 'homme', 'enthousiaste'],
  ['Algieba', 'homme', 'douce'], ['Enceladus', 'homme', 'soufflée'], ['Charon', 'homme', 'informative'], ['Orus', 'homme', 'ferme'],
  ['Iapetus', 'homme', 'claire'], ['Umbriel', 'homme', 'décontractée'], ['Algenib', 'homme', 'rocailleuse'], ['Rasalgethi', 'homme', 'informative'],
  ['Alnilam', 'homme', 'ferme'], ['Schedar', 'homme', 'posée'], ['Zubenelgenubi', 'homme', 'décontractée'], ['Sadaltager', 'homme', 'savante'],
  ['Sulafat', 'femme', 'chaleureuse'], ['Laomedeia', 'femme', 'enjouée'], ['Zephyr', 'femme', 'lumineuse'], ['Autonoe', 'femme', 'lumineuse'],
  ['Despina', 'femme', 'douce'], ['Achernar', 'femme', 'tendre'], ['Aoede', 'femme', 'légère'], ['Callirrhoe', 'femme', 'décontractée'],
  ['Kore', 'femme', 'ferme'], ['Leda', 'femme', 'jeune'], ['Erinome', 'femme', 'claire'], ['Vindemiatrix', 'femme', 'douce'],
  ['Pulcherrima', 'femme', 'directe'], ['Gacrux', 'femme', 'mûre']
];
const GEMINI_DEFAULTS = {
  chaleureux: { homme: 'Achird', femme: 'Sulafat' },
  decale: { homme: 'Puck', femme: 'Laomedeia' },
  nuit: { homme: 'Algieba', femme: 'Despina' },
  pro: { homme: 'Sadachbia', femme: 'Zephyr' },
  generaliste: { homme: 'Iapetus', femme: 'Aoede' },
  sport: { homme: 'Alnilam', femme: 'Autonoe' },
  tele: { homme: 'Rasalgethi', femme: 'Erinome' },
  rock: { homme: 'Algenib', femme: 'Kore' },
  erudit: { homme: 'Sadaltager', femme: 'Gacrux' },
  morning: { homme: 'Fenrir', femme: 'Leda' },
  conteur: { homme: 'Schedar', femme: 'Achernar' },
  pince: { homme: 'Umbriel', femme: 'Pulcherrima' },
  zen: { homme: 'Enceladus', femme: 'Vindemiatrix' }
};
const GEMINI_STYLES = {
  chaleureux: 'warm, friendly French radio host, smiling, relaxed pace',
  decale: 'playful, witty French radio host, light humor, lively and bouncy',
  nuit: 'late-night French radio host, calm, intimate, slow and smooth',
  pro: 'energetic professional French FM radio host, punchy, clear and confident',
  generaliste: 'versatile French public radio host, clear, curious and warm, natural mid pace',
  sport: 'excited French sports commentator calling a live match, fast, rising intensity, bursts of enthusiasm',
  tele: 'big-smile French TV game show presenter, emphatic, theatrical suspense, addressing a studio audience',
  rock: 'raw passionate rock radio host, gritty, confident, a bit rebellious',
  erudit: 'cultured French music connoisseur, precise, thoughtful, measured pace',
  morning: 'hyper-energetic French morning show host, very fast, bouncy, big enthusiasm',
  conteur: 'nostalgic French storyteller, tender, dreamy, slow and evocative',
  pince: 'deadpan French radio host, dry humor, flat understated delivery, faintly ironic',
  zen: 'very soft, slow, soothing French voice, calm breathing, relaxing'
};
const genderOfGemini = (name) => (GEMINI_VOICES.find((v) => v[0] === name) || [])[1] || '';
const validStyle = (x, d) => (GEMINI_DEFAULTS[x] ? x : d);
// Langue parlée par la radio (les voix Gemini sont multilingues ; la voix de l'ordinateur doit exister dans la langue).
const RADIO_LANG_LIST = [['fr', 'Français', 'fr-FR'], ['en', 'English', 'en-US'], ['de', 'Deutsch', 'de-DE'], ['es', 'Español', 'es-ES'], ['it', 'Italiano', 'it-IT'],
  ['pt', 'Português', 'pt-BR'], ['nl', 'Nederlands', 'nl-NL'], ['pl', 'Polski', 'pl-PL'], ['sv', 'Svenska', 'sv-SE'], ['da', 'Dansk', 'da-DK'], ['no', 'Norsk', 'nb-NO'],
  ['fi', 'Suomi', 'fi-FI'], ['cs', 'Čeština', 'cs-CZ'], ['tr', 'Türkçe', 'tr-TR'], ['ja', '日本語', 'ja-JP'], ['ko', '한국어', 'ko-KR'], ['ar', 'العربية', 'ar-SA'], ['hi', 'हिन्दी', 'hi-IN']];
const RADIO_LANG_ADJ = { fr: 'French', en: 'English-speaking', de: 'German', es: 'Spanish', it: 'Italian', pt: 'Portuguese', nl: 'Dutch', pl: 'Polish', sv: 'Swedish', da: 'Danish', no: 'Norwegian', fi: 'Finnish', cs: 'Czech', tr: 'Turkish', ja: 'Japanese', ko: 'Korean', ar: 'Arabic', hi: 'Hindi' };
const radioLang = () => (RADIO_LANG_LIST.some((x) => x[0] === settings.radioLang) ? settings.radioLang : 'fr');
// Phrases toutes faites (sans IA) et phrases de test : en français pour une radio en français,
// en anglais pour toutes les autres langues.
const fbEnglish = () => radioLang() !== 'fr';
// Genre du coanimateur : choisi, ou l'inverse de l'animateur.
function cohostGenderOf(hostGender) {
  if (settings.cohostGender === 'homme' || settings.cohostGender === 'femme') return settings.cohostGender;
  return hostGender === 'femme' ? 'homme' : 'femme';
}
function geminiVoices() {
  const hs = validStyle(settings.hostStyle, 'chaleureux');
  const cs = validStyle(settings.cohostStyle, 'decale');
  const hostGender = settings.voiceGender === 'femme' ? 'femme' : 'homme';
  const a = settings.geminiVoice || GEMINI_DEFAULTS[hs][hostGender];
  const gA = genderOfGemini(a) || hostGender;
  const wantB = cohostGenderOf(gA);
  let b = settings.geminiVoiceB || GEMINI_DEFAULTS[cs][wantB];
  if (b === a && !settings.geminiVoiceB) b = (GEMINI_VOICES.find((v) => v[1] === wantB && v[0] !== a) || [b])[0];
  const lg = (st) => st.replace(/French/g, RADIO_LANG_ADJ[radioLang()] || 'French');
  // Direction de la voix propre à chaque animateur (réglage, ou préréglage comme Jeff & Laeti).
  const note = (x) => (String(x || '').trim() ? '; ' + String(x).trim().slice(0, 200) : '');
  const sA = lg(GEMINI_STYLES[hs]) + note(settings.hostVoiceNote);
  return { a, b, gA, gB: genderOfGemini(b) || wantB, style: sA, styleA: sA, styleB: lg(GEMINI_STYLES[cs]) + note(settings.cohostVoiceNote) };
}
// Genres utilisés pour les accords dans les annonces écrites par Claude.
function hostGenders() {
  if (useGemini()) { const gv = geminiVoices(); return { host: gv.gA, cohost: gv.gB }; }
  const g = hostGenderUi();
  return { host: g, cohost: cohostGenderOf(g) };
}
const stripTags = (t) => String(t || '').replace(/<[^<>]{1,25}>/g, ' ').replace(/\s+/g, ' ').trim();
const useGemini = () => settings.voiceEngine === 'gemini' && hasGemini;
const VOICE_REASONS = {
  decode: "le son reçu n'a pas pu être décodé",
  blocked: 'le navigateur bloque le son tant que tu n\'as pas cliqué sur la page',
  audio: 'le son de la page n\'est pas disponible',
  empty: 'le son reçu est vide'
};
function voiceWarn(s, msg) {
  if (s && s.voiceErrorShown) return;
  if (s) s.voiceErrorShown = true;
  toast(msg + " Je prends la voix de l'ordinateur.", null, 12000);
}

// Repères écrits par Claude : {ton de la réplique} au début d'une réplique, {{bruitage}} à sa place, et
// « >> » en tête d'une réplique qui coupe la parole à la précédente (2.35).
// Ils sont retirés du texte dit ; le ton va à la voix Gemini, les bruitages sont joués au bon moment, et
// la coupure est notée sur la réplique (t.cut) pour le jeu de la voix.
const SFX_OK = new Set(['applaudissements', 'acclamations', 'badumtss', 'roulement', 'buzzer', 'victoire']);
function takeMarks(turns) {
  const sfx = [];
  let pos = 0;
  let before = null;
  for (const t of turns) {
    let txt = String(t.text || '');
    // « >> » en tête (avant ou après le ton et une balise sonore) : cette réplique coupe la précédente.
    const cut = /^>\s*>+/.test(txt.replace(/<[^<>]{1,25}>|\{(?!\{)[^{}]{0,80}\}/g, ' ').trimStart());
    txt = txt.replace(/>\s*>+/g, ' ').replace(/^\s+/, '');
    const em = txt.match(/^\s*\{(?!\{)([^{}]{2,80})\}\s*/);
    if (em) { t.emotion = em[1].trim(); txt = txt.slice(em[0].length); }
    // On ne se coupe pas la parole à soi-même, et la première réplique ne coupe personne.
    if (cut && before && before !== t.speaker) t.cut = true;
    before = t.speaker;
    let clean = '';
    let last = 0;
    const re = /\{\{\s*([a-zàâçéèêëîïôûùü-]{3,20})\s*\}\}/gi;
    let m;
    while ((m = re.exec(txt))) {
      clean += txt.slice(last, m.index);
      const name = m[1].toLowerCase().replace(/[^a-z]/g, (ch) => ({ é: 'e', è: 'e', ê: 'e', à: 'a' }[ch] || ''));
      if (SFX_OK.has(name)) sfx.push({ name, pos: pos + clean.length });
      last = m.index + m[0].length;
    }
    clean += txt.slice(last);
    // Une indication égarée au milieu d'une phrase n'est jamais lue.
    t.text = clean.replace(/\{[^{}]{0,80}\}/g, ' ').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();
    pos += t.text.length + 1;
  }
  const total = Math.max(1, pos);
  return { turns: turns.filter((t) => t.text), sfx: sfx.slice(0, 3).map((x) => ({ name: x.name, at: Math.min(1, x.pos / total) })) };
}

// Découpe un dialogue « A: … / B: … » en répliques.
function parseTurns(text, duo) {
  if (!duo) return [{ speaker: 'A', text }];
  const turns = [];
  for (const line of String(text).split('\n')) {
    const m = line.match(/^\s*([AB])\s*[:：]\s*(.+)$/);
    if (m) turns.push({ speaker: m[1], text: m[2].trim() });
    else if (line.trim() && turns.length) turns[turns.length - 1].text += ' ' + line.trim();
  }
  return turns.length ? turns : [{ speaker: 'A', text: String(text).replace(/\n/g, ' ') }];
}

// Type d'annonce pour la transition n° idx (0 = premier titre). peek : sans consommer l'état.
// Journal de l'animateur (onglet En cours) : ce qu'il fait, et pourquoi il se tait.
function radioLog(s, msg) {
  if (!s) return;
  dlog('radio', msg);
  s.radioLog = (s.radioLog || []).concat([{ at: Date.now(), msg }]).slice(-8);
  if (s === session) updateRadioCard(s);
}
// Met à jour la carte « Animateur radio » sur place, sans redessiner le panneau.
function radioLogItems(s) {
  const log = (s.radioLog || []).slice().reverse();
  return log.length
    ? log.map((e) => h('div', { class: 'muted' }, new Date(e.at).toTimeString().slice(0, 5) + ' · ' + e.msg))
    : [h('div', { class: 'muted' }, "Rien pour l'instant : le journal se remplit à chaque changement de titre.")];
}
function updateRadioCard(s) {
  if (!R.radioLog || !R.radioLog.isConnected) return;
  R.radioLog.replaceChildren(...radioLogItems(s));
  if (R.radioPlan) R.radioPlan.textContent = tr(nextRadioPlan(s));
}
const secs = (ms) => (ms / 1000).toFixed(1).replace('.', ',') + ' s';

async function jingle(s, variant) {
  const r = await callSafe('playJingle', variant, kitOpts());
  if (!r || !r.ok) radioLog(s, "Jingle muet : le son de la page n'est pas encore activé (clique sur la page YouTube Music, puis relance).");
  return r;
}

function quietReason(idx, reason, pending) {
  if (!settings.radio) return 'Mode radio coupé : pas d\'annonce.';
  if (reason === 'takeover' && !pending) return "Titre remplacé par YouTube Music : pas d'annonce.";
  if ((reason === 'skip' || reason === 'failed' || reason === 'takeover' || reason === 'guest') && pending) {
    const who = { skip: 'Titre passé', failed: 'Titre illisible', takeover: 'Titre remplacé par YouTube Music', guest: 'Titre choisi dans YouTube Music' }[reason];
    return who + ' : ' +
      (pending === 'interlude' ? "l'interlude prévu est reporté" : "l'annonce prévue est reportée") + ' au prochain enchaînement.';
  }
  if (reason === 'skip') return "Titre passé : pas d'annonce, pour ne pas couper ton geste.";
  if (reason === 'failed') return "Titre précédent illisible : pas d'annonce.";
  if (settings.radioFreq === 'change') return "Pas d'annonce : réglage « seulement quand l'ambiance change ».";
  if (programmeOn()) return "Pas d'annonce : ce titre était déjà au programme.";
  return "Pas d'annonce sur ce titre : réglage « un titre sur trois ».";
}

// Prochaine intervention prévue (pour l'onglet En cours).
// Plan affiché dans En cours, avec l'invité s'il y en a un.
function nextRadioPlan(s) {
  const base = nextRadioPlanBase(s);
  const g = s && s.guest;
  if (!g || !settings.radio) return base;
  const what = g.phase === 'annonce' ? (g.gender === 'femme' ? ' annoncée bientôt' : ' annoncé bientôt') : g.phase === 'arrivee' ? ' arrive à la prochaine intervention'
    : g.phase === 'depart' ? ' repart à la prochaine intervention' : ' en studio';
  return base + ' Invité : ' + g.name + ' (' + g.role + ')' + what + '.';
}
function nextRadioPlanBase(s) {
  if (!settings.radio) return 'Mode radio coupé.';
  if (programmeOn() && s.queue) {
    let keys = s.programme ? s.programme.keys.slice() : [];
    for (let k = 1; k <= Math.min(12, s.queue.length); k++) {
      const t = s.queue[k - 1];
      const role = roleFrom(s, t, keys);
      const kind = kindForRole(role, s.transitions + k, s);
      if (role === 'programme') keys = programmeList(s, t).map((x) => x.key);
      if (kind) {
        const what = role === 'programme' ? 'le programme des prochains titres' : role === 'chronique' ? 'la chronique' + (kind === 'interlude' ? ' (interlude)' : '')
          : role === 'culture' ? 'un moment de culture musicale' : 'un interlude';
        return 'Prochaine intervention : ' + what + (k === 1 ? ' au prochain titre.' : ' dans ' + k + ' titres.');
      }
    }
    return 'Prochaine intervention : le programme des prochains titres.';
  }
  if (settings.radioFreq === 'change' && !(settings.interludes === 'souvent' || settings.interludes === 'parfois')) return "Prochaine annonce : quand tu changeras l'ambiance.";
  for (let k = 1; k <= 12; k++) {
    const kind = announceKind({ announceNext: s.announceNext, pendingKind: s.pendingKind, rhythm: s.rhythm, transitions: s.transitions }, s.transitions + k, 'ended', true);
    if (kind) {
      const what = kind === 'interlude' ? 'interlude' : 'annonce';
      return 'Prochaine intervention : ' + what + (k === 1 ? ' au prochain titre.' : ' dans ' + k + ' titres.');
    }
  }
  return "Prochaine annonce : quand tu changeras l'ambiance.";
}

// Intervention prévue à ce rang. Si le titre est passé, elle est reportée au prochain
// enchaînement normal (l'interlude l'emporte sur une simple annonce).
const KIND_RANK = { interlude: 2, talkover: 1 };
const betterKind = (a, b) => ((KIND_RANK[b] || 0) > (KIND_RANK[a] || 0) ? b : a) || null;
// Changement d'ambiance en cours : le premier titre de la nouvelle ambiance est annoncé.
function changeFor(s, t) {
  const ch = s && s.ambianceChange;
  return ch && !ch.done && t && !ch.locked.includes(t.key) ? ch : null;
}

// ------------------------------------------- programme : cycle de 3 titres
// Le programme présente le titre qui démarre et les 2 suivants. En « À chaque titre », il est
// suivi d'une chronique (interlude, anecdote développée) puis d'un moment de culture courte.
// En « Un titre sur trois », seul le programme est dit. Un titre sauté est sauté aussi par les
// animateurs ; un titre hors programme (remplaçant, nouvelle ambiance) ouvre un nouveau programme.
const programmeOn = () => settings.radio && settings.programme !== false && (settings.radioFreq === 'every' || settings.radioFreq === 'third');
function programmeList(s, t) {
  const i = s.queue.indexOf(t);
  const rest = i >= 0 ? s.queue.slice(i + 1) : s.queue.slice(0);
  const out = [t];
  const newAmb = !!changeFor(s, t);
  const max = programmeMax(s);
  for (const x of rest) {
    if (out.length >= max) break;
    // Le programme s'arrête avant le changement d'ambiance : le premier titre de la nouvelle en ouvre un autre.
    if (!!changeFor(s, x) !== newAmb) break;
    out.push(x);
  }
  return out;
}
function roleFrom(s, t, keys) {
  if (changeFor(s, t)) return 'programme';
  const pos = keys.indexOf(t.key);
  if (pos <= 0) return 'programme';
  if (settings.radioFreq === 'every') return pos === 1 ? 'chronique' : 'culture';
  return null;
}
function roleFor(s, t) {
  if (!programmeOn() || !s || !s.queue || !s.played || !t) return null;
  return roleFrom(s, t, s.programme ? s.programme.keys : []);
}
function kindForRole(role, idx, s) {
  if (settings.radioFreq === 'every') {
    if (role === 'chronique') return settings.interludes === 'off' ? 'talkover' : 'interlude';
    return 'talkover';
  }
  const il = interludeDue(s || {}, idx);
  if (role === 'programme') return il ? 'interlude' : 'talkover';
  // Rythme naturel : l'interlude attend le prochain programme et le présente lui-même, pour ne
  // jamais tomber juste avant ou juste après une annonce.
  if (naturalRhythm()) return null;
  return il ? 'interlude' : null;
}
// ------------------------------------------- vrai ou faux et question en suspens
// Mood DJ tire au sort vrai ou faux, et si le coanimateur a raison : le jeu ne penche jamais du même côté.
const GAGES = ['avouer un plaisir coupable musical', 'annoncer le titre suivant en rimes', "faire un compliment sincère à A sur sa façon d'animer",
  "dire du bien d'un style de musique qu'il ou elle n'aime pas", 'lancer le titre suivant comme un présentateur de télé-achat'];
const flip = () => (Math.random() < 0.5 ? 'vrai' : 'faux');
function drawBet(truth) {
  const won = Math.random() < 0.5;
  return { won, bet: won ? truth : truth === 'vrai' ? 'faux' : 'vrai' };
}
function scoreAfter(s, won) {
  const sc = Object.assign({ A: 0, B: 0 }, s.score || {});
  if (won) sc.B++; else sc.A++;
  return sc;
}
// La réponse est due sur le titre visé, ou à la prochaine intervention si ce titre a été passé.
const hookDue = (s, t) => !!(s && s.hook && s.queue && t && (t.key === s.hook.forKey || !s.queue.some((x) => x.key === s.hook.forKey)));
const hookIdFor = (s, t) => (hookDue(s, t) ? s.hook.id : '');
function hookAnswerLine(h) {
  if (fbEnglish()) {
    return h.type === 'question'
      ? 'To answer the question from earlier about ' + h.title + (h.answer ? ': ' + h.answer : '') + '.'
      : 'The answer to the true or false from earlier: it was ' + (h.truth === 'faux' ? 'false' : 'true') + '.' + (h.answer ? ' ' + h.answer : '');
  }
  return h.type === 'question'
    ? 'Pour répondre à la question de tout à l\'heure sur ' + h.title + (h.answer ? ' : ' + h.answer : '') + '.'
    : 'Réponse au vrai ou faux de tout à l\'heure : c\'était ' + h.truth + '.' + (h.answer ? ' ' + h.answer : '');
}

function commitProgramme(s, t) {
  const list = programmeList(s, t);
  s.programme = { keys: list.map((x) => x.key), at: Date.now() };
  drawProgLen(s);
  dlog('annonce', 'programme', { titres: list.map((x) => x.title + ' — ' + x.artist), suivant_sur: programmeMax(s) + ' titres' });
}

// Un titre avec une dédicace, ou choisi par un animateur, a toujours son annonce, même si aucune n'était prévue.
function announceKind(s, idx, reason, peek, nextTrack) {
  const k = announceKindBase(s, idx, reason, peek, nextTrack);
  if (!k && settings.radio && idx > 0 && nextTrack && (nextTrack.dedic || (nextTrack.pick && settings.claudeAnnounce && hasKey))) return 'talkover';
  return k;
}
function announceKindBase(s, idx, reason, peek, nextTrack) {
  if (!settings.radio) return null;
  if (programmeOn() && nextTrack && s.queue && s.played) {
    if (idx === 0) { if (!peek) commitProgramme(s, nextTrack); return 'intro'; }
    if (reason === 'skip' || reason === 'failed' || reason === 'takeover' || reason === 'guest') return null;
    if (!peek) s.pendingKind = null;
    const role = roleFor(s, nextTrack);
    const kind = kindForRole(role, idx, s);
    if (!peek && role === 'programme' && kind) commitProgramme(s, nextTrack);
    if (!peek && settings.radioFreq !== 'every') advanceRhythm(s, idx, kind === 'interlude', false);
    return kind;
  }
  if (idx === 0) return 'intro';
  const due = dueKind(s, idx, peek);
  if (reason === 'skip' || reason === 'failed' || reason === 'takeover' || reason === 'guest') {
    if (due && !peek) s.pendingKind = betterKind(s.pendingKind, due);
    return null;
  }
  const r = betterKind(due, s.pendingKind);
  if (!peek) s.pendingKind = null;
  if (changeFor(s, nextTrack)) return betterKind(r, 'talkover');
  return r;
}

// ------------------------------------------- rythme « naturel »
// Au lieu de tomber pile tous les N titres, la prochaine intervention est tirée au sort dans une
// fourchette autour du réglage (même moyenne) : annonce tous les 2 à 4 titres au lieu de 3, interlude
// tous les 3 à 5 au lieu de 4 (« Parfois »), tous les 2 ou 3 (« Souvent »), programme de 2 à 4
// titres. Le tirage est fait d'avance : En cours sait quand tombe la suivante, et les titres
// annoncés au programme sont verrouillés (lockedCount).
const naturalRhythm = () => settings.rhythm !== 'regulier';
const ilEvery = () => (settings.interludes === 'souvent' ? 2 : settings.interludes === 'parfois' ? 4 : 0);
const IL_GAPS = { 2: [2, 2, 3], 4: [3, 4, 5] };
const TALK_GAPS = [2, 3, 4];
const drawGap = (a) => a[Math.floor(Math.random() * a.length)];
function rhythmOf(s) {
  if (!s.rhythm) s.rhythm = { talk: 3, il: ilEvery(), every: ilEvery(), progLen: 3 };
  const r = s.rhythm;
  // Réglage des interludes changé en cours d'émission : nouveau tirage à partir de maintenant.
  if (r.every !== ilEvery()) { r.every = ilEvery(); r.il = r.every ? (s.transitions || 0) + drawGap(IL_GAPS[r.every]) : 0; }
  return r;
}
const interludeDue = (s, idx) => {
  if (!naturalRhythm()) { const e = ilEvery(); return !!(e && idx % e === 0); }
  const r = rhythmOf(s);
  return !!(r.every && idx >= r.il);
};
// Après l'enchaînement « idx » (jamais en simple coup d'œil) : on tire les prochains écarts.
function advanceRhythm(s, idx, didInterlude, didTalk) {
  if (!naturalRhythm()) return;
  const r = rhythmOf(s);
  if (didInterlude) {
    r.il = idx + drawGap(IL_GAPS[r.every] || [4]);
    if (r.talk <= idx + 1) r.talk = idx + 2;
  }
  if (didTalk) {
    r.talk = idx + drawGap(TALK_GAPS);
    // Jamais un interlude collé juste après une annonce.
    if (r.every && r.il === idx + 1) r.il++;
  }
}
// Longueur du prochain programme (titres présentés d'un coup).
function programmeMax(s) {
  if (!naturalRhythm() || !s) return 3;
  return rhythmOf(s).progLen || 3;
}
function drawProgLen(s) {
  if (!naturalRhythm()) return;
  // En « À chaque titre », 3 ou parfois 4 (un deuxième moment de culture) ; sinon 2 à 4.
  rhythmOf(s).progLen = settings.radioFreq === 'every' ? drawGap([3, 3, 4]) : drawGap([2, 3, 4]);
}

function dueKind(s, idx, peek) {
  if (naturalRhythm()) {
    const r = rhythmOf(s);
    const il = interludeDue(s, idx);
    let kind = null;
    let talk = false;
    if (il) kind = 'interlude';
    else if (settings.radioFreq === 'every') kind = 'talkover';
    else if (settings.radioFreq === 'change') {
      const x = s.announceNext;
      if (!peek) s.announceNext = false;
      kind = x ? 'talkover' : null;
    } else if (idx >= r.talk) { kind = 'talkover'; talk = true; }
    if (il && settings.radioFreq === 'third' && idx >= r.talk) talk = true;
    if (!peek) advanceRhythm(s, idx, il, talk);
    return kind;
  }
  const every = settings.interludes === 'souvent' ? 2 : settings.interludes === 'parfois' ? 4 : 0;
  if (every && idx % every === 0) return 'interlude';
  if (settings.radioFreq === 'every') return 'talkover';
  if (settings.radioFreq === 'change') {
    const r = s.announceNext;
    if (!peek) s.announceNext = false;
    return r ? 'talkover' : null;
  }
  return idx % 3 === 0 ? 'talkover' : null;
}

function timeParts(d) {
  const hh = d.getHours();
  const mm = d.getMinutes();
  const time = hh + ' h' + (mm ? ' ' + String(mm).padStart(2, '0') : '');
  const part = hh < 5 ? 'nuit' : hh < 12 ? 'matin' : hh < 14 ? 'midi' : hh < 18 ? 'après-midi' : hh < 23 ? 'soirée' : 'nuit';
  const greet = hh >= 5 && hh < 18 ? 'Bonjour' : 'Bonsoir';
  const timeEn = (hh % 12 || 12) + (mm ? ':' + String(mm).padStart(2, '0') : '') + (hh < 12 ? ' AM' : ' PM');
  const greetEn = hh >= 5 && hh < 12 ? 'Good morning' : hh >= 12 && hh < 18 ? 'Good afternoon' : 'Good evening';
  return { time, part, greet, timeEn, greetEn };
}

function trendOf(prev, next) {
  if (!prev) return '';
  const d = (next.energy || 3) - (prev.energy || 3);
  return d >= 1 ? 'monte' : d <= -1 ? 'redescend' : 'reste stable';
}

let weatherCache = { city: '', at: 0, data: null };
function fmtWeather(w) {
  return w ? w.temp + ' degrés à ' + w.city + (w.desc ? ', ' + w.desc : '') : '';
}
function fmtWeatherEn(w) {
  return w ? w.temp + ' degrees in ' + w.city + (w.descEn ? ', ' + w.descEn : '') : '';
}
async function weatherLine() {
  const city = (settings.weatherCity || '').trim();
  if (!city) return '';
  if (weatherCache.city === city && Date.now() - weatherCache.at < 30 * 60e3) return fmtWeather(weatherCache.data);
  try {
    const w = await withTimeout(claude('weather', { city }), 6000);
    weatherCache = { city, at: Date.now(), data: w };
  } catch (e) {
    weatherCache = { city, at: Date.now(), data: null };
  }
  return fmtWeather(weatherCache.data);
}

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);

const progNames = (list) => list.map((t) => spokenTitle(t.title) + ' de ' + t.artist);
const progText = (names) => (names.length === 2 ? names[0] + ', puis ' + names[1]
  : names.slice(0, -1).join(', puis ') + ', et pour finir ' + names[names.length - 1]);
function templateDuo(kind, c) {
  const nx = spokenTitle(c.next.title) + ', de ' + c.next.artist;
  if (c.programme) {
    const names = progNames(c.programme);
    return 'A: ' + (kind === 'intro' ? c.greet + ' à toutes et à tous ! ' + c.host + ' et ' + c.cohost + ' avec vous sur Mood DJ. ' : '') +
      'Au programme des prochaines minutes : ' + progText(names) + '.\nB: Et on commence tout de suite avec ' + names[0] + ' !';
  }
  if (kind === 'intro') {
    return 'A: ' + c.greet + ' à toutes et à tous ! ' + c.host + ' et ' + c.cohost + ' avec vous sur Mood DJ.\n' +
      'B: Au programme ' + ({ matin: 'ce matin', midi: 'ce midi', 'après-midi': 'cet après-midi', soirée: 'ce soir', nuit: 'cette nuit' }[c.part] || 'aujourd\'hui') + ' : ' + c.ambiance + '. On commence avec ' + nx + '.';
  }
  const w = c.weather ? ' Dehors, ' + c.weather + '.' : '';
  return 'A: ' + (c.sayTime === false ? 'Vous écoutez Mood DJ.' : 'Vous écoutez Mood DJ, il est ' + c.time + '.') + w + '\n' +
    'B: ' + (c.prev ? "C'était " + spokenTitle(c.prev.title) + ', de ' + c.prev.artist + '. ' : '') + pick(['On enchaîne avec ', 'La suite, ', 'Et maintenant, ']) + nx + ' !';
}

// Les prochains titres ne changent plus quand tu modifies l'ambiance : ils sont au programme
// et leurs annonces sont prêtes. Sans programme : les 3 prochains. Avec le programme : les titres
// déjà annoncés, plus le titre qui ouvre le programme suivant (son annonce est en préparation) ; et
// quand le programme en cours est fini, tout le programme suivant, déjà préparé.
const LOCKED = 3;
function lockedCount(s) {
  if (!s || !s.queue || !programmeOn() || !s.programme) return Math.min(LOCKED, s && s.queue ? s.queue.length : LOCKED);
  const keys = s.programme.keys;
  let n = 0;
  while (n < s.queue.length && keys.includes(s.queue[n].key)) n++;
  const next = n < s.queue.length ? (n === 0 ? programmeList(s, s.queue[0]).length : 1) : 0;
  return Math.max(1, Math.min(s.queue.length, n + next));
}

// Phrases de secours quand Claude n'est pas disponible.
// Titre tel qu'on le dit à l'antenne : sans « (Remastered) », « (album ver.) », « - Live »…
function spokenTitle(title) {
  let t = String(title || '')
    .replace(/\s*[([][^)\]]*\b(remaster(ed)?|ver\.?|version|edit|mix|mono|stereo|deluxe|bonus|official|audio|video|clip|lyrics?|explicit|radio|single|album|hd|4k)\b[^)\]]*[)\]]/gi, '')
    .trim();
  const dash = t.match(/^(.*?)\s+-\s+(.*)$/);
  if (dash) {
    const a = dash[1].trim();
    const b = dash[2].trim();
    if (/remaster|version|edit|mix|live|mono|stereo|radio|single|ver\.?/i.test(b) || C.norm(a) === C.norm(b)) t = a;
  }
  return t || String(title || '');
}

function templateLine(kind, c) {
  const nx = spokenTitle(c.next.title) + ', de ' + c.next.artist;
  // 2.35 : les animateurs parlent à tous les auditeurs (« vous »), sans prénom.
  const call = '';
  if (c.programme) {
    const head = kind === 'intro' ? c.greet + ' à toutes et à tous ! Ici ' + c.host + ' sur Mood DJ, avec ' + c.ambiance + '. '
      : c.change ? "Changement d'ambiance : place à " + c.change.to + ' ! ' : '';
    return head + 'Au programme des prochaines minutes : ' + progText(progNames(c.programme)) + '. On commence tout de suite !';
  }
  if (kind === 'intro') {
    return pick([
      c.greet + ' à toutes et à tous ! Ici ' + c.host + ' sur Mood DJ. Au programme : ' + c.ambiance + '. On commence avec ' + nx + '.',
      c.greet + ", c'est " + c.host + '. Installez-vous, on part sur ' + c.ambiance + ', et ça commence avec ' + nx + '.'
    ]);
  }
  if (kind === 'interlude') {
    const w = c.weather ? ' Dehors, ' + c.weather + '.' : '';
    const back = c.prev ? pick(["C'était " + spokenTitle(c.prev.title) + ', de ' + c.prev.artist + '.', "Vous venez d'écouter " + c.prev.artist + '.']) : '';
    return pick([
      'Vous écoutez Mood DJ avec ' + c.host + ', il est ' + c.time + '.' + w + ' ' + back + ' ' + cap(call + 'on enchaîne avec ' + nx + '.'),
      back + ' Il est ' + c.time + ' sur Mood DJ.' + w + ' ' + cap(call + "la suite, c'est " + nx + '.')
    ]).replace(/\s+/g, ' ').trim();
  }
  const lead = c.trend === 'monte' ? pick(["on monte d'un cran avec ", 'ça accélère avec ', "on remet de l'énergie avec "])
    : c.trend === 'redescend' ? pick(['on redescend en douceur avec ', 'un peu de calme avec ', 'on respire un peu avec '])
      : pick(['on reste dans le même esprit avec ', 'on continue avec ', 'place à ']);
  const tag = Math.random() < 0.25 ? " C'est " + c.host + ' sur Mood DJ.' : '';
  if (c.change) return "Changement d'ambiance : place à " + c.change.to + ' ! ' + cap(call + 'on commence avec ' + c.next.artist + ', ' + spokenTitle(c.next.title) + '.');
  return cap(call + lead + c.next.artist + ', ' + spokenTitle(c.next.title) + '.') + tag;
}

// Phrases toutes faites en anglais (radio dans une autre langue que le français).
const progNamesEn = (list) => list.map((t) => spokenTitle(t.title) + ' by ' + t.artist);
const progTextEn = (names) => (names.length === 2 ? names[0] + ', then ' + names[1]
  : names.slice(0, -1).join(', then ') + ', and to finish, ' + names[names.length - 1]);
const PART_EN = { matin: 'this morning', midi: 'this lunchtime', 'après-midi': 'this afternoon', soirée: 'tonight', nuit: 'tonight' };
function templateDuoEn(kind, c) {
  const nx = spokenTitle(c.next.title) + ', by ' + c.next.artist;
  const hi = c.greetEn + ', everyone! ' + c.host + ' and ' + c.cohost + ' with you on Mood DJ.';
  if (c.programme) {
    const names = progNamesEn(c.programme);
    return 'A: ' + (kind === 'intro' ? hi + ' ' : '') + 'Coming up in the next few minutes: ' + progTextEn(names) + '.\nB: And we start right now with ' + names[0] + '!';
  }
  if (kind === 'intro') {
    return 'A: ' + hi + '\nB: On the menu ' + (PART_EN[c.part] || 'today') + ': ' + c.ambianceEn + '. We start with ' + nx + '.';
  }
  const w = c.weatherEn ? ' Outside, ' + c.weatherEn + '.' : '';
  return 'A: ' + (c.sayTime === false ? "You're listening to Mood DJ." : "You're listening to Mood DJ, it's " + c.timeEn + '.') + w + '\n' +
    'B: ' + (c.prev ? 'That was ' + spokenTitle(c.prev.title) + ', by ' + c.prev.artist + '. ' : '') + pick(['Up next, ', 'Coming up, ', 'And now, ']) + nx + '!';
}
function templateLineEn(kind, c) {
  const nx = spokenTitle(c.next.title) + ', by ' + c.next.artist;
  const call = '';
  const changeTo = c.change ? c.change.toEn || c.change.to : '';
  if (c.programme) {
    const head = kind === 'intro' ? c.greetEn + ', everyone! This is ' + c.host + ' on Mood DJ, with ' + c.ambianceEn + '. '
      : c.change ? 'Change of mood: here comes ' + changeTo + '! ' : '';
    return head + 'Coming up in the next few minutes: ' + progTextEn(progNamesEn(c.programme)) + '. Let\'s get started!';
  }
  if (kind === 'intro') {
    return pick([
      c.greetEn + ', everyone! This is ' + c.host + ' on Mood DJ. On the menu: ' + c.ambianceEn + '. We start with ' + nx + '.',
      c.greetEn + ", it's " + c.host + '. Make yourselves comfortable, we\'re going for ' + c.ambianceEn + ', starting with ' + nx + '.'
    ]);
  }
  if (kind === 'interlude') {
    const w = c.weatherEn ? ' Outside, ' + c.weatherEn + '.' : '';
    const back = c.prev ? pick(['That was ' + spokenTitle(c.prev.title) + ', by ' + c.prev.artist + '.', 'You just heard ' + c.prev.artist + '.']) : '';
    return pick([
      "You're listening to Mood DJ with " + c.host + ", it's " + c.timeEn + '.' + w + ' ' + back + ' ' + cap(call + 'up next, ' + nx + '.'),
      back + " It's " + c.timeEn + ' on Mood DJ.' + w + ' ' + cap(call + "here's what's next: " + nx + '.')
    ]).replace(/\s+/g, ' ').trim();
  }
  const lead = c.trend === 'monte' ? pick(["let's turn it up a notch with ", 'picking up the pace with ', 'more energy now with '])
    : c.trend === 'redescend' ? pick(["let's bring it down gently with ", 'a little calm now with ', 'time to breathe with '])
      : pick(['staying in the same mood with ', 'carrying on with ', 'here comes ']);
  const tag = Math.random() < 0.25 ? ' This is ' + c.host + ' on Mood DJ.' : '';
  if (c.change) return 'Change of mood: here comes ' + changeTo + '! ' + cap(call + 'we start with ' + c.next.artist + ', ' + spokenTitle(c.next.title) + '.');
  return cap(call + lead + c.next.artist + ', ' + spokenTitle(c.next.title) + '.') + tag;
}

function b64ToBuffer(b64) {
  const bin = atob(b64);
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u.buffer;
}

// ------------------------------------------------- variété des annonces
// Chaque prise de parole reçoit un « angle » tiré au sort (sans reprendre les derniers),
// l'heure et la météo ne reviennent que de temps en temps, et les mots déjà trop entendus
// sont signalés à Claude pour qu'il les évite.
const ANGLES_DUO = [
  { id: 'chambre', w: 3, txt: "B chambre gentiment A (ses goûts musicaux, sa façon d'annoncer, une petite manie d'animateur) et A se défend avec humour, puis l'un des deux lance le titre suivant." },
  { id: 'debat', w: 3, txt: "Petit désaccord amical sur le titre qu'on vient d'écouter ou sur son artiste : l'un adore, l'autre est moins convaincu, chacun défend son avis en une phrase, puis ils lancent le suivant." },
  { id: 'devinette', w: 2, facts: 'next', txt: "A fait deviner le titre suivant à B avec un indice sur l'artiste ou l'ambiance du morceau ; B tente une réponse, juste ou drôlement à côté, puis A dévoile le titre et l'artiste." },
  { id: 'anecdote', w: 2, facts: 'next', txt: "L'un raconte l'histoire vraie du titre suivant (pourquoi ou pour qui il a été écrit, à quelle occasion, ce qu'il raconte vraiment) ou une anecdote sur son groupe ; l'autre relance avec une question, une surprise ou une vanne, le premier complète, puis ils lancent le titre." },
  { id: 'anecdote_prev', w: 2, facts: 'prev', txt: "Ils reviennent sur le titre qu'on vient d'écouter en racontant son histoire vraie (pourquoi il a été écrit, pour quel événement, ce qu'il raconte) ou une anecdote sur son groupe ; l'autre réagit et relance, puis ils lancent le suivant." },
  { id: 'anecdote_oeuvre', w: 2, facts: 'next', txt: "Si les fiches disent que le titre suivant apparaît dans un film, une série, un animé, un jeu vidéo, une pub célèbre, ou qu'il a marqué un événement (cérémonie, compétition sportive, concert historique), l'un le raconte et l'autre réagit ; sinon, ils racontent l'histoire du morceau. Puis ils le lancent." },
  { id: 'anecdote_culture', w: 2, facts: 'genre', txt: "Un moment de culture musicale sur le style qu'on écoute : ses origines, un lieu ou une époque mythique, un pionnier, un instrument, son lien avec le cinéma, les séries ou les animés… L'un raconte, l'autre réagit, puis ils lancent le titre suivant." },
  { id: 'anecdote_samples', share: 0.6, facts: 'next', txt: "Si les fiches parlent d'un sample, d'un emprunt ou d'une reprise célèbre (le titre suivant a été samplé ou repris, ou c'est lui-même une reprise plus connue que l'original), l'un le raconte et l'autre réagit ; sinon, ils racontent l'histoire du morceau. Puis ils le lancent." },
  { id: 'anecdote_studio', share: 0.6, facts: 'next', txt: "Les coulisses de l'enregistrement du titre suivant, d'après les fiches : une prise unique, un accident gardé au mixage, un instrument bricolé, un son devenu célèbre… L'un raconte, l'autre s'étonne ; sinon, l'histoire du morceau. Puis ils le lancent." },
  { id: 'anecdote_instrument', share: 0.6, facts: 'next', txt: "Un instrument ou un matériel de légende du groupe suivant (une guitare, un orgue, une batterie, un ampli), d'après les fiches ; sinon une anecdote sur le groupe. L'autre réagit, puis ils lancent le titre." },
  { id: 'anecdote_nom', share: 0.6, facts: 'next', txt: "L'origine du nom du groupe suivant, du titre ou de son album, ou l'histoire de sa pochette, d'après les fiches ; sinon une anecdote sur le groupe. L'autre réagit, puis ils lancent le titre." },
  { id: 'anecdote_revanche', share: 0.6, facts: 'next', txt: "Si les fiches le disent : un échec devenu succès pour le titre suivant ou son groupe (refusé par les maisons de disques, flop à sa sortie puis culte, sauvé de justesse) ; sinon l'histoire du morceau. L'autre réagit, puis ils le lancent." },
  { id: 'anecdote_epoque', share: 0.6, facts: 'next', year: true, txt: "Retour sur l'année de sortie du titre suivant : un fait marquant et certain de cette année-là (actualité, mode, technologie, autre tube), relié au morceau si possible. L'autre réagit, puis ils lancent le titre." },
  { id: 'anecdote_lien', share: 0.6, facts: 'both', txt: "Un vrai lien entre l'artiste qu'on vient d'écouter et le suivant, d'après les fiches (un membre en commun, une première partie, une influence avouée, le même producteur, la même ville) ; à défaut, un point commun réel (époque, ville, style). Puis ils lancent le titre." },
  { id: 'lien', w: 2, txt: "Ils trouvent un lien amusant ou inattendu entre le titre écouté et le suivant (thème, ambiance, artistes), puis lancent le suivant." },
  { id: 'vanne', w: 2, txt: "Une vanne bon enfant sur le style musical, ses clichés ou le titre du morceau suivant ; l'autre surenchérit, puis l'un des deux annonce le titre." },
  { id: 'reaction', w: 2, facts: 'prev', txt: "Ils réagissent à chaud au titre qu'on vient d'écouter (la voix, le refrain, l'effet qu'il fait), avec des avis différents, puis enchaînent sur le suivant." },
  { id: 'auditeur', w: 1, txt: "Ils s'adressent directement aux auditeurs, à tous ceux qui écoutent (ce qu'ils font sans doute en ce moment, une question complice lancée à la cantonade), puis lancent le titre." },
  { id: 'bavardage', w: 2, txt: "Un moment de bavardage, hors musique : ils parlent d'autre chose, comme deux collègues entre deux disques, en quelques répliques légères et sans chercher la vanne à tout prix ; puis l'un des deux revient à la musique et lance le titre suivant." },
  { id: 'rappel', w: 1, history: true, txt: "Ils rebondissent sur une remarque d'une annonce précédente (voir la liste) comme un running gag, puis passent au titre suivant." }
];
const ANGLES_SOLO = [
  { id: 'sobre', w: 3, txt: "Annonce simple et efficace : le titre et l'artiste, avec une touche personnelle." },
  { id: 'reaction', w: 2, txt: "Un mot à chaud sur le titre qu'on vient d'écouter, puis le suivant." },
  { id: 'teaser', w: 2, txt: "Donne envie du titre suivant avec une image ou une sensation, puis nomme-le." },
  { id: 'lien', w: 2, txt: "Un lien rapide entre le titre écouté et le suivant." },
  { id: 'anecdote', w: 1, facts: 'next', txt: "Raconte l'histoire vraie du titre suivant (pourquoi ou pour qui il a été écrit, à quelle occasion) ou une anecdote sur son artiste, puis annonce-le." },
  { id: 'anecdote_prev', w: 1, facts: 'prev', txt: "Raconte l'histoire vraie du titre qu'on vient d'écouter (pourquoi il a été écrit, pour quel événement) ou une anecdote sur son groupe, puis annonce le suivant." },
  { id: 'anecdote_oeuvre', w: 1, facts: 'next', txt: "Si les fiches disent que le titre suivant apparaît dans un film, une série, un animé, un jeu vidéo ou qu'il a marqué un événement, raconte-le ; sinon, raconte son histoire. Puis annonce-le." },
  { id: 'anecdote_culture', w: 1, facts: 'genre', txt: "Un fait de culture musicale sur le style qu'on écoute (ses origines, un pionnier, un lieu mythique, son lien avec le cinéma ou les séries), puis annonce le titre suivant." },
  { id: 'anecdote_samples', share: 0.6, facts: 'next', txt: "Si les fiches parlent d'un sample, d'un emprunt ou d'une reprise célèbre du titre suivant, raconte-le ; sinon raconte son histoire. Puis annonce-le." },
  { id: 'anecdote_studio', share: 0.6, facts: 'next', txt: "Raconte les coulisses de l'enregistrement du titre suivant d'après les fiches (une prise unique, un accident gardé, un son devenu célèbre) ; sinon son histoire. Puis annonce-le." },
  { id: 'anecdote_instrument', share: 0.6, facts: 'next', txt: "Parle d'un instrument ou d'un matériel de légende du groupe suivant d'après les fiches ; sinon d'une anecdote sur le groupe. Puis annonce le titre." },
  { id: 'anecdote_nom', share: 0.6, facts: 'next', txt: "Raconte l'origine du nom du groupe suivant, du titre, de son album ou de sa pochette, d'après les fiches ; sinon une anecdote sur le groupe. Puis annonce le titre." },
  { id: 'anecdote_revanche', share: 0.6, facts: 'next', txt: "Si les fiches le disent, raconte comment le titre suivant ou son groupe est passé de l'échec au succès ; sinon raconte son histoire. Puis annonce-le." },
  { id: 'anecdote_epoque', share: 0.6, facts: 'next', year: true, txt: "Un fait marquant et certain de l'année de sortie du titre suivant (actualité, mode, technologie, autre tube), relié au morceau si possible, puis annonce-le." },
  { id: 'anecdote_lien', share: 0.6, facts: 'both', txt: "Un vrai lien entre l'artiste qu'on vient d'écouter et le suivant d'après les fiches (membre commun, première partie, influence, même ville) ; à défaut un point commun réel. Puis annonce le titre." },
  { id: 'vanne', w: 1, txt: "Un trait d'humour léger sur le titre ou l'artiste suivant." },
  { id: 'bavardage', w: 2, txt: "Un mot de bavardage, hors musique, comme une confidence glissée à l'antenne ; puis reviens à la musique et annonce le titre suivant." }
];
// Sujets précis pour les angles qui finissent sinon toujours pareil (la même vanne trois fois
// dans la soirée) : un sujet est tiré au sort à chaque fois, sans reprise dans la session.
const ANGLE_TOPICS = {
  chambre: ['un plaisir coupable musical inavouable', "ce qu'il ou elle boit pendant l'émission", 'sa façon de taper du pied à contretemps', 'sa manie de chanter faux les refrains',
    'son attachement à un vieux matériel (platine, casque, vieil ampli)', 'son retard au début de l\'émission', 'ses jeux de mots ratés', 'sa playlist de sport',
    'ses théories farfelues sur les groupes', 'un karaoké raté', 'sa manie de noter les solos de guitare', 'son air de connaisseur quand il ou elle ne connaît pas',
    'le grignotage en douce pendant les chansons', 'sa tenue imaginée ce soir', 'son premier concert', 'sa façon de danser', 'sa façon d\'annoncer les titres'],
  debat: ['la voix', 'le solo', 'la longueur du morceau', 'les paroles', 'le refrain', 'la batterie', 'la pochette de l\'album', 'la version live ou studio', "l'intro",
    'le son de la production', 'le meilleur album du groupe', 'si ça passe en soirée', "à quelle heure il faut l'écouter", 'la basse', 'le titre du morceau'],
  reaction: ['la voix', 'le riff', 'le refrain', 'la batterie', 'la fin du morceau', "l'énergie", 'les paroles', 'le son', "l'intro"],
  vanne: ['les clichés du style', 'le titre du morceau', 'le nom du groupe', 'les coiffures de l\'époque', 'les tenues de scène', 'la longueur des solos', 'les fans du genre',
    "l'heure tardive", 'les pochettes de disques', 'les clips de l\'époque'],
  // Bavardage (2.35) : des sujets hors musique, sans saison, sans actualité et sans lieu précis.
  bavardage: ["ce qu'ils ont mangé (ou raté) aujourd'hui", "la nuit trop courte de l'un des deux", 'le café ou le thé du moment, et qui en abuse', 'un film ou une série vus récemment, sans rien divulguer',
    'un jeu vidéo ou un jeu de société du moment', 'un petit objet du studio qui a disparu', 'un bruit bizarre ou une petite panne dans le studio', 'un débat absurde : le superpouvoir le plus inutile',
    'un débat absurde : la pire invention du quotidien', 'un top 3 improbable, improvisé', "ce qu'ils faisaient avant de faire de la radio", "un souvenir d'enfance lié à un long trajet",
    'leur pire talent caché', "ce qu'ils feront en sortant du studio", "la tenue de l'autre aujourd'hui", "un mot que l'un des deux n'arrive jamais à prononcer", 'une bonne résolution déjà abandonnée',
    'le dernier fou rire hors antenne', "ce qu'ils emporteraient sur une île déserte (pas de disque)", "un message reçu d'un collègue ou d'un proche de la station", 'une question lancée aux auditeurs, sans attendre de réponse',
    "un petit rituel d'avant-émission", 'ce qui traîne sur la table du studio', 'le chauffage du studio, éternel sujet de discorde', 'un rêve bizarre fait cette nuit', 'un compliment sincère, pour une fois',
    'un pari stupide entre eux', 'un livre ou une bande dessinée en cours', 'une chose apprise cette semaine', 'ce qui les fait rire en ce moment']
};
// Bavardage et discussions libres (réglage « Bavardage ») : jamais, parfois, souvent.
// - poids de l'angle « bavardage » parmi les angles de conversation ;
// - part des interventions où une conversation libre prend la place du programme (« Un titre sur trois »)
//   ou de la culture courte (« À chaque titre »). Sur « Jamais », le programme garde toute la place, comme avant.
const CHAT_W = { off: 0, parfois: 2, souvent: 4 };
// Jamais deux conversations libres de suite : avec une chance p à chaque fois, la part réelle est p / (1 + p).
// 0,5 donne donc une intervention sur trois, et 1 une sur deux (en alternance).
const CHAT_SHARE = { off: 0, parfois: 0.5, souvent: 1 };
const chatLevel = () => (CHAT_W[settings.chat] !== undefined ? settings.chat : 'parfois');
// Dynamique d'un dialogue (2.35) : comment ils le jouent, tirée en plus de l'angle (de quoi ils parlent).
// Sans elle, chaque dialogue recevait « ils se chambrent » : toujours le même ton.
const DYNAMICS = [
  { id: 'complices', calm: true, txt: "ils sont sur la même longueur d'onde : complicité tranquille, ils s'amusent ensemble, aucune pique" },
  { id: 'taquin', txt: "l'un taquine gentiment, l'autre encaisse avec humour et rend la pareille en une ligne" },
  { id: 'mauvaise_foi', txt: "l'un est d'une mauvaise foi assumée, l'autre le lui fait remarquer sans s'énerver" },
  { id: 'ailleurs', txt: "l'un a la tête ailleurs, occupé à autre chose dans le studio, et l'autre le ramène à l'antenne" },
  { id: 'presse', txt: "l'un veut lancer le titre tout de suite, l'autre a encore quelque chose à dire, et y arrive" },
  { id: 'sincere', calm: true, txt: 'pas de vanne cette fois : un enthousiasme simple et sincère, partagé' },
  { id: 'curieux', calm: true, txt: "l'un pose de vraies questions et l'autre répond : on sent la curiosité, pas un numéro de duettistes" },
  { id: 'pose', calm: true, quiet: true, txt: 'ton posé, peu de mots, on prend son temps' },
  { id: 'surenchere', hot: true, txt: "ils renchérissent l'un sur l'autre jusqu'à l'absurde, puis l'un des deux arrête tout d'un mot" },
  { id: 'desaccord', txt: 'un vrai petit désaccord, courtois, que personne ne gagne' }
];
// Ces angles portent déjà leur dynamique (chambrage, débat, vanne, devinette) : on n'en tire pas une autre.
const OWN_DYNAMIC = new Set(['chambre', 'debat', 'vanne', 'devinette']);
function pickDynamic(s, angle, emo) {
  if (angle && OWN_DYNAMIC.has(angle.id)) return null;
  const v = s.variety;
  const recent = v.dyn || [];
  const story = !!(angle && (/^anecdote/.test(angle.id) || angle.id === 'ephemeride' || angle.id === 'programme'));
  const ok = (d) => (emo === 'intime' || emo === 'sobre' ? d.calm : emo === 'dechaine' ? !d.quiet : true)
    && (!story || d.calm || d.id === 'taquin') && (!d.hot || emo === 'expressif' || emo === 'dechaine');
  const pool = DYNAMICS.filter((d) => ok(d) && !recent.includes(d.id));
  const use = pool.length ? pool : DYNAMICS.filter(ok);
  const d = use[Math.floor(Math.random() * use.length)];
  v.dyn = recent.concat([d.id]).slice(-3);
  return d;
}
function withTopic(s, angle) {
  const list = angle && ANGLE_TOPICS[angle.id];
  if (!list) return angle;
  const v = s.variety;
  v.topics = v.topics || {};
  const used = v.topics[angle.id] || [];
  const before = angle.id === 'bavardage' ? airLog.chat : [];
  const unused = list.filter((x) => !used.includes(x));
  const free = unused.filter((x) => !before.includes(x));
  const topic = pick(free.length ? free : unused.length ? unused : list);
  v.topics[angle.id] = (unused.length ? used : []).concat([topic]);
  if (angle.id === 'bavardage' && !s.demo) { airLog.chat = airLog.chat.filter((x) => x !== topic).concat([topic]).slice(-18); store({ airLog }); }
  return Object.assign({}, angle, { topic, txt: angle.txt + ' Sujet imposé cette fois : ' + topic + ' (un sujet déjà utilisé dans l\'émission ne doit pas revenir).' });
}

const STOP_WORDS = new Set(('alors aussi avant avec avoir bien cette cela comme dans deux elle elles encore entre fait faire juste leurs maintenant mais même parce petit petite place pour quand quoi sans sont suite tout toute toujours très vient voilà votre ' +
  'mood titre titres morceau chanson heures heure degrés minutes ensemble juste ouais enfin tiens allez écoute écoutez voyez dites disons quand même aujourd autre autres chose choses').split(' '));
// Mots de 4 lettres qui ne sont jamais des tics. Les autres (« chef », « film », « clip », « bref », « whoa »)
// échappaient à la liste des mots trop entendus, qui ne comptait qu'à partir de 5 lettres (2.35).
const STOP4 = new Set(('avec pour dans mais elle vous nous tout tous bien très trop plus sans sont sous vers chez puis donc même déjà rien cela ceci ceux leur quoi quel hein allô allo ' +
  'être fait faut peut veut vais suis sera avez êtes aura dire sais sait vois voit voir veux peux dois doit mets tard soir nuit jour fois deux cinq sept huit neuf onze zéro vrai faux tant mood ' +
  'bon, ici, moi, toi, lui, eux, oui, non').split(/[ ,]+/).filter((x) => x.length === 4));

// Place des anecdotes selon le réglage (Rarement, Souvent, Très souvent).
// Poids de chacun des quatre angles « anecdote » (histoire du titre suivant, du précédent,
// film/série/événement, culture du style).
const ANECDOTE_WEIGHT = { rare: 0.2, souvent: 1.5, max: 4 };
const angleWeight = (a) => (/^anecdote/.test(a.id) ? (ANECDOTE_WEIGHT[settings.anecdotes] || 3) * (a.share || 1) * (a.norm || 1) : a.id === 'bavardage' ? CHAT_W[chatLevel()] : a.w);
function pickAngle(list, recent, ok, weight) {
  const wf = weight || angleWeight;
  const pool = list.filter((a) => ok(a) && !recent.includes(a.id));
  const use = pool.length ? pool : list.filter(ok);
  let r = Math.random() * use.reduce((n, a) => n + wf(a), 0);
  for (const a of use) { r -= wf(a); if (r <= 0) return a; }
  return use[use.length - 1];
}
const isAnecdote = (a) => /^anecdote/.test(a.id);
for (const list of [ANGLES_DUO, ANGLES_SOLO]) {
  const tot = list.filter(isAnecdote).reduce((n, a) => n + (a.share || 1), 0);
  for (const a of list) if (isAnecdote(a)) a.norm = 4 / tot;
}
// Culture courte : plutôt la culture du style, un film ou une série, que l'histoire détaillée d'un titre.
const CULTURE_W = { anecdote_culture: 3, anecdote_oeuvre: 2, anecdote_epoque: 1.5, anecdote: 1, anecdote_prev: 1, anecdote_lien: 1 };
const PROGRAMME_ANGLE = {
  solo: "Présente avec entrain le programme des prochaines minutes, puis lance le premier titre.",
  duo: "A présente le programme des prochaines minutes ; B réagit à l'un des titres (envie, surprise ou petite vanne) ; puis l'un des deux lance le premier."
};

// Mots qui reviennent dans plusieurs des dernières annonces, et débuts de phrase déjà utilisés.
// Petits mots anglais, pour une radio en anglais (les autres langues n'ont pas de liste : seuls les mots de
// 5 lettres et plus y sont comptés, comme avant).
const STOP_EN = new Set(('about there their these those which would could should really think going gonna track music little right where while after before being every never always still again ' +
  'listening tonight today because other maybe through thing things something people gotta wanna great comes coming here’s what’s let’s next song songs').split(' '));
function overused(lines, skip) {
  // La liste des petits mots de 4 lettres est française : ils ne sont comptés que pour une radio en français.
  // Dans une autre langue, « that », « with » ou « nicht » auraient rempli la liste des mots à éviter.
  const lang = radioLang();
  const count = new Map();
  for (const l of lines) {
    // Les apostrophes séparent les mots (« l'autre », « qu’il ») : seuls les vrais mots sont comptés.
    const words = new Set((String(l).toLowerCase().match(/[a-zàâçéèêëîïôûùüÿœ-]{4,}/g) || [])
      .map((x) => x.replace(/^-+|-+$/g, '')).filter((x) => (x.length >= 5 ? !STOP_WORDS.has(x) && !(lang === 'en' && STOP_EN.has(x)) : lang === 'fr' && x.length === 4 && !STOP4.has(x)) && !skip.has(x)));
    for (const x of words) count.set(x, (count.get(x) || 0) + 1);
  }
  // Un mot court ne devient suspect qu'à partir de trois interventions.
  return [...count.entries()].filter((e) => e[1] >= (e[0].length >= 5 ? 2 : 3)).sort((a, b) => b[1] - a[1]).slice(0, 16).map((e) => e[0]);
}
function openings(lines) {
  return lines.map((l) => String(l).split(/\s+/).slice(0, 4).join(' ')).filter((x) => x.length > 6);
}

// noFree : cette intervention a déjà sa structure (invité au micro, dédicace, réponse d'un jeu, choix d'un animateur).
function planAnnouncement(s, kind, prev, next, atMs, role, progLen, noFree) {
  const now = atMs || Date.now();
  const v = s.variety || (s.variety = { angles: [], timeAt: 0, weatherAt: 0, stationAt: 0, momentAt: 0 });
  const lines = (s.lastLines || []).slice(-6);
  const duoOn = settings.voiceEngine === 'gemini' && hasGemini && settings.duo;
  const duo = duoOn && (kind !== 'talkover' || Math.random() < 0.4);
  const okA = (a) => (!a.history || lines.length >= 2) && (a.facts !== 'prev' || !!prev) && (a.facts !== 'both' || !!prev) && (!a.year || !!(next && next.year)) &&
    (a.id !== 'bavardage' || chatLevel() !== 'off');
  const list = duo ? ANGLES_DUO : ANGLES_SOLO;
  // Conversation libre (2.35). Avec le programme activé, les angles de discussion (chambrage, débat, devinette,
  // vanne, réaction, lien, bavardage…) ne sortaient presque jamais : chaque intervention était un programme
  // (« Un titre sur trois ») ou une anecdote (« À chaque titre »). Une part des programmes, ou des moments de
  // culture courte, laisse maintenant la place à une conversation ; jamais deux fois de suite.
  const slot = (role === 'programme' && progLen >= 2 && settings.radioFreq === 'third') || role === 'culture';
  const free = !!(slot && kind !== 'intro' && !noFree && !s.demo && !changeFor(s, next) && !v.freeLast && Math.random() < CHAT_SHARE[chatLevel()]);
  if (slot) v.freeLast = free;
  let angle;
  // À la place d'une culture courte (déjà une anecdote) : une conversation. À la place d'un programme : une
  // conversation ou une anecdote, selon le réglage « Anecdotes », qui n'avait aucun effet avec le programme.
  if (free) angle = pickAngle(role === 'culture' ? list.filter((a) => !isAnecdote(a)) : list, v.angles.slice(-3), okA);
  else if (role === 'programme' && progLen >= 2) angle = { id: 'programme', txt: duo ? PROGRAMME_ANGLE.duo : PROGRAMME_ANGLE.solo };
  else if (role === 'chronique') angle = pickAngle(list.filter(isAnecdote), v.angles.slice(-3), okA, (a) => a.share || 1);
  else if (role === 'culture') angle = pickAngle(list.filter(isAnecdote), v.angles.slice(-3), okA, (a) => CULTURE_W[a.id] || 0.6);
  else angle = kind === 'intro' ? null : pickAngle(list, v.angles.slice(-3), okA);
  angle = withTopic(s, angle);
  const min = 60000;
  const plan = {
    duo, angle,
    sayTime: kind === 'intro' || (kind === 'interlude' && now - v.timeAt > 15 * min) || (kind === 'talkover' && now - v.timeAt > 40 * min && Math.random() < 0.3),
    sayWeather: kind === 'interlude' && now - v.weatherAt > 35 * min,
    sayStation: kind === 'intro' || (kind === 'interlude' && now - v.stationAt > 12 * min) || (kind === 'talkover' && now - v.stationAt > 25 * min && Math.random() < 0.3),
    momentOk: kind === 'intro' || (now - v.momentAt > 15 * min && Math.random() < 0.35),
    yearOk: Math.random() < 0.25,
    turns: duo ? (kind === 'talkover' ? 2 : pick(kind === 'intro' ? [2, 3] : [2, 3, 3, 4, 4, 5])) : 0,
    long: false,
    opener: duo && kind !== 'intro' && Math.random() < 0.4 ? 'B' : 'A',
    free,
    // Une coupure de parole, de temps en temps seulement : la réplique qui coupe sera marquée « >> ».
    cuts: duo && Math.random() < (kind === 'talkover' ? 0.25 : 0.4) ? 1 : 0
  };
  // Une anecdote a le droit de prendre plus de place.
  if (angle && /^anecdote/.test(angle.id)) {
    plan.long = true;
    if (duo) plan.turns = kind === 'talkover' ? 3 : pick([4, 5, 5, 6]);
  }
  if (angle && angle.id === 'programme' && duo) plan.turns = kind === 'interlude' ? 4 : 3;
  plan.role = role || null;
  const skip = new Set([prev, next].concat((s.played || []).slice(-8)).filter(Boolean).flatMap((t) => (t.title + ' ' + t.artist).toLowerCase().split(/[^a-zàâçéèêëîïôûùüÿœ]+/)));
  // Les prénoms des animateurs et leurs expressions fétiches ne sont pas des « mots trop entendus » : les
  // prénoms sont normaux, et les expressions ont leur propre dosage (ficheFocus).
  const own = [settings.hostName, settings.cohostName, s.guest && s.guest.name].concat(sayingsOf().map((x) => x.text));
  for (const w of own.filter(Boolean).join(' ').toLowerCase().split(/[^a-zàâçéèêëîïôûùüÿœ]+/)) if (w) skip.add(w);
  // Mots et images déjà entendus plusieurs fois dans toute l'émission (pas seulement les dernières annonces).
  plan.avoid = overused((s.lastLines || []).slice(-24), skip);
  plan.openers = openings(lines.slice(-4));
  // Noté tout de suite : deux préparations simultanées ne tirent pas le même angle.
  plan.prevWeatherAt = v.weatherAt;
  notePlan(s, plan, atMs);
  return plan;
}

function notePlan(s, plan, atMs) {
  const v = s.variety;
  const now = atMs || Date.now();
  if (plan.angle) v.angles = v.angles.concat([plan.angle.id]).slice(-6);
  if (plan.sayTime) v.timeAt = now;
  if (plan.sayWeather) v.weatherAt = now;
  if (plan.sayStation) v.stationAt = now;
  if (plan.momentOk) v.momentAt = now;
}

// Ce que la page YouTube Music de l'artiste dit de lui (pour des anecdotes vraies).
async function artistFacts(name) {
  if (!name) return '';
  try {
    const a = await withTimeout(artistByName(String(name).split(/,| & | feat\.? | x /i)[0]), 4000);
    if (!a || !a.id) return '';
    const known = artistCache.pages[a.id];
    const page = await withTimeout(artistPageCached(a.id, (known && known.max) || 5), 5000);
    return (page && page.about) || '';
  } catch (e) { return ''; }
}

const progKeysFor = (s, t) => (roleFor(s, t) === 'programme' ? programmeList(s, t).map((x) => x.key).join('|') : '');

// Article Wikipédia de l'artiste (formation, nom, membres, concerts, coulisses), gardé 60 jours.
async function artistWiki(name) {
  if (!name) return null;
  const k = 'artist:' + C.artistKey(String(name).split(/,| & | feat\.? | x /i)[0]);
  const c = wikiCache[k];
  if (c && Date.now() - c.at < WIKI_TTL) return c.text ? c : null;
  try {
    const r = await withTimeout(claude('wikiartist', { artist: name }), 8000);
    wikiCache[k] = { at: Date.now(), text: (r && r.text) || '', lang: (r && r.lang) || '' };
    saveWikiCache();
    return wikiCache[k].text ? wikiCache[k] : null;
  } catch (e) { return null; }
}
// Sources structurées (MusicBrainz, Wikidata, Deezer, Wikipédia retrouvé par Wikidata), gardées 60 jours.
// Une réponse arrivée après le délai est quand même gardée : elle servira à l'annonce suivante.
function extCached(k, action, payload, ms) {
  const c = wikiCache[k];
  if (c && Date.now() - c.at < WIKI_TTL) return Promise.resolve(c.data);
  const p = claude(action, payload).then((data) => {
    wikiCache[k] = { at: Date.now(), data: data || {} };
    saveWikiCache();
    return data || {};
  });
  return withTimeout(p, ms).catch(() => null);
}
const artistK = (name) => C.artistKey(String(name || '').split(/,| & | feat\.? | x /i)[0]);
// Prochains concerts de l'artiste (Ticketmaster), dans le pays choisi, sur les 9 prochains mois.
// Gardés 2 jours ; proposés aux animateurs au plus une fois tous les 3 jours pour un même artiste.
const concertLines = new Map();
async function concertsFor(t) {
  // Même titre redemandé (fiches préparées à l'avance, puis annonce) : même ligne.
  const kept = concertLines.get(t.key);
  if (kept && Date.now() - kept.at < 2 * 3600e3) return kept.line;
  const line = await concertsLine(t);
  if (line) concertLines.set(t.key, { at: Date.now(), line });
  return line;
}
async function concertsLine(t) {
  const ak = artistK(t.artist);
  const country = settings.concertCountry === 'all' ? '' : (settings.concertCountry || 'FR');
  const k = 'tm:' + ak + '|' + country;
  const saidK = 'tmsaid:' + ak;
  if (wikiCache[saidK] && Date.now() - wikiCache[saidK].at < 3 * 86400000) return '';
  let c = wikiCache[k];
  if (!c || Date.now() - c.at > 2 * 86400000) {
    const r = await withTimeout(claude('concerts', { artist: t.artist, country }), 5000).catch(() => null);
    if (!r) return '';
    c = wikiCache[k] = { at: Date.now(), events: Array.isArray(r.events) ? r.events : [] };
    saveWikiCache();
  }
  const limit = new Date(Date.now() + 270 * 86400000).toISOString().slice(0, 10);
  const home = C.norm(settings.weatherCity || '');
  const fmt = (e) => {
    const [y, m, d] = e.date.split('-').map(Number);
    const near = home && C.norm(e.city) === home;
    return dayLabel(new Date(y, m - 1, d)) + ' ' + y + ' à ' + e.city + (e.venue ? ' (' + e.venue + ')' : '') + (e.festival ? ', au festival ' + e.festival : '') + (near ? ', près de chez toi' : '');
  };
  const list = (c.events || []).filter((e) => e.date <= limit);
  if (!list.length) return '';
  // D'abord une date dans ta ville si elle existe, puis les plus proches dans le temps.
  const sorted = list.slice().sort((a, b) => (home && C.norm(b.city) === home ? 1 : 0) - (home && C.norm(a.city) === home ? 1 : 0) || a.date.localeCompare(b.date)).slice(0, 4);
  wikiCache[saidK] = { at: Date.now() };
  saveWikiCache();
  return 'Concerts à venir de ' + t.artist + ' (Ticketmaster, nous sommes le ' + dayLabel(new Date()) + ' ' + new Date().getFullYear() + ') : ' + sorted.map(fmt).join(' ; ') + '.';
}
// Toutes les fiches d'un titre : page YouTube Music de l'artiste, son article Wikipédia, l'article du morceau,
// puis les faits MusicBrainz, Wikidata et Deezer.
async function factsFor(t) {
  if (!t) return { text: '', src: '' };
  const ak = artistK(t.artist);
  const [about, wiki0, song0, mbA, mbR, dz, lfm, dg] = await Promise.all([
    artistFacts(t.artist), artistWiki(t.artist), songFacts(t),
    extCached('mba:' + ak, 'mbartist', { artist: t.artist }, 6000),
    extCached('mbr:' + t.key, 'mbrecording', { artist: t.artist, title: t.title }, 6000),
    extCached('dz:' + t.key, 'deezer', { artist: t.artist, title: t.title, duration: t.listedDur || t.duration || 0 }, 5000),
    hasLastfm ? extCached('lfm:' + t.key, 'lastfm', { artist: t.artist, title: t.title }, 5000) : null,
    hasDiscogs ? extCached('dg:' + t.key, 'discogs', { artist: t.artist, title: t.title }, 6000) : null
  ]);
  // Concerts : prochaines dates (Ticketmaster, gardées 2 jours) et place du morceau sur scène (Setlist.fm).
  const concertsP = hasTicketmaster ? concertsFor(t) : Promise.resolve('');
  const setlistP = hasSetlist && mbA && mbA.mbid
    ? extCached('sl:' + mbA.mbid + '|' + t.key, 'setlist', { mbid: mbA.mbid, artist: t.artist, title: t.title }, 5000)
    : Promise.resolve(null);
  const artistQ = (mbA && mbA.qid) || '';
  const songQ = (mbR && mbR.qid) || '';
  // Pas d'article trouvé par la recherche : Wikidata donne le bon, en français, en anglais ou dans une autre langue.
  const [wd, wikiQ, songQd] = await Promise.all([
    artistQ || songQ ? extCached('wd:' + artistQ + '|' + songQ, 'wikidata', { artistQ, songQ }, 4000) : null,
    !wiki0 && artistQ ? extCached('wq:' + artistQ, 'wikiqid', { qid: artistQ, kind: 'artist', style: t.style || '' }, 4000) : null,
    !song0 && songQ ? extCached('wq:' + songQ + ':song', 'wikiqid', { qid: songQ, kind: 'song', style: t.style || '' }, 4000) : null
  ]);
  const [concerts, sl] = await Promise.all([concertsP, setlistP]);
  const wiki = wiki0 || (wikiQ && wikiQ.text ? wikiQ : null);
  const song = song0 || (songQd && songQd.text ? songQd : null);
  const LANG_NAMES = { en: 'anglais', br: 'breton', ga: 'irlandais', gd: 'gaélique écossais', cy: 'gallois', de: 'allemand', es: 'espagnol', it: 'italien', pt: 'portugais', nl: 'néerlandais', sv: 'suédois', fi: 'finnois', no: 'norvégien', ja: 'japonais', ko: 'coréen', zh: 'chinois', ar: 'arabe' };
  const en = (x) => (x && x.lang && x.lang !== 'fr' ? ', en ' + (LANG_NAMES[x.lang] || x.lang) + ' : traduis' : '');
  // Deezer : la popularité ; la date et l'album seulement si MusicBrainz n'a rien (Deezer donne souvent
  // ceux d'une compilation). Le tempo est gardé mais pas dit : Deezer le donne parfois doublé ou divisé par deux.
  const mbDated = !!(mbR && /Première sortie/.test(mbR.text || ''));
  const dzLine = dz ? [!mbDated && dz.release ? 'sorti le ' + dz.release + (dz.album ? ' (album « ' + dz.album + ' »)' : '') : '',
    dz.rank >= 750000 ? 'très écouté sur Deezer' : ''].filter(Boolean).join(', ') : '';
  // Les faits courts et structurés d'abord : ils ne sont jamais coupés par la limite de longueur.
  const text = [
    mbA && mbA.text ? "Données sur l'artiste " + t.artist + ' (MusicBrainz, noms d\'instruments en anglais : traduis) : ' + mbA.text : '',
    mbR && mbR.text ? 'Données sur le morceau « ' + t.title + ' » (MusicBrainz) : ' + mbR.text : '',
    wd && wd.artist ? "Données sur l'artiste " + t.artist + ' (Wikidata) : ' + wd.artist : '',
    wd && wd.song ? 'Données sur le morceau « ' + t.title + ' » (Wikidata) : ' + wd.song : '',
    dzLine ? 'Le morceau « ' + t.title + ' » (Deezer) : ' + dzLine + '.' : '',
    concerts,
    sl && sl.text ? 'Sur scène (Setlist.fm) : ' + sl.text : '',
    dg && dg.text ? 'Le morceau « ' + t.title + ' » (Discogs) : ' + dg.text : '',
    lfm && lfm.song ? 'Écoutes du morceau (Last.fm, tags en anglais : traduis) : ' + lfm.song : '',
    lfm && lfm.artist ? "L'artiste " + t.artist + ' (Last.fm, en anglais si pas de version française : traduis) : ' + lfm.artist : '',
    about ? "Fiche de l'artiste " + t.artist + ' (YouTube Music) : ' + about : '',
    wiki ? "Article sur l'artiste " + t.artist + ' (Wikipédia' + en(wiki) + ') : ' + wiki.text : '',
    song ? 'Fiche du morceau « ' + t.title + ' » (Wikipédia' + en(song) + ') : ' + song.text : ''
  ].filter(Boolean).join('\n');
  const src = [about ? 'artiste' : '', wiki ? (wiki === wiki0 ? 'article' : 'article-' + (wiki.lang || '?')) : '', song ? (song === song0 ? 'morceau' : 'morceau-' + (song.lang || '?')) : '',
    mbA && mbA.text ? 'mb-artiste' : '', mbR && mbR.text ? 'mb-morceau' : '', wd && (wd.artist || wd.song) ? 'wikidata' : '', dzLine ? 'deezer' : '',
    dg && dg.text ? 'discogs' : '', lfm && (lfm.song || lfm.artist) ? 'lastfm' : '',
    sl && sl.text ? 'setlist' : '', concerts ? 'concerts' : ''].filter(Boolean).join('+');
  return { text, src };
}
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const dayLabel = (d) => (d.getDate() === 1 ? '1er' : d.getDate()) + ' ' + MONTHS[d.getMonth()];
// « Ça s'est passé un 25 novembre » : faits musicaux du jour, d'abord ceux qui touchent aux artistes de ce soir.
async function ephemerideItems(d, s) {
  const k = 'eph:' + d.getDate() + '-' + (d.getMonth() + 1);
  let c = wikiCache[k];
  if (!c || Date.now() - c.at >= WIKI_TTL) {
    try {
      const r = await withTimeout(claude('ephemeride', { day: d.getDate(), month: d.getMonth() + 1 }), 7000);
      c = wikiCache[k] = { at: Date.now(), items: Array.isArray(r && r.items) ? r.items.slice(0, 40) : [] };
      saveWikiCache();
    } catch (e) { return []; }
  }
  const names = s.played.concat(s.current ? [s.current] : [], s.queue).map((t) => C.norm(t.artist)).filter((a) => a.length > 3);
  const word = C.norm(styleText(s.sel)).split(' ')[0] || '';
  const score = (x) => { const n = C.norm(x.text); return (names.some((a) => n.includes(a)) ? 3 : 0) + (word.length > 2 && n.includes(word) ? 1 : 0) + Math.random(); };
  return (c.items || []).slice().sort((a, b) => score(b) - score(a)).slice(0, 10);
}
// Petites statistiques d'écoute pour un clin d'œil (au plus une fois toutes les 30 min).
function statsFor(s, t, now) {
  const v = s.variety;
  if (!t || now - (v.statsAt || 0) < 30 * 60e3 || Math.random() > 0.3) return '';
  const plays = learn.plays || {};
  const within = (arr) => (arr || []).filter((x) => now - x < 30 * 86400000).length;
  const n = within(plays[t.key]);
  const na = within(plays['a:' + C.artistKey(t.artist)]);
  let txt = '';
  // 2.35 : dit comme une statistique de la station (sa programmation), jamais comme les habitudes de quelqu'un.
  if (n >= 3) txt = 'Ce titre est déjà passé ' + n + " fois à l'antenne de Mood DJ ces 30 derniers jours : c'est un habitué de la programmation.";
  else if (na >= 8) txt = na + ' titres de ' + t.artist + " sont passés à l'antenne de Mood DJ ces 30 derniers jours.";
  if (txt) v.statsAt = now;
  return txt;
}
// Clin d'œil local : la fiche parle de la ville de l'auditeur.
function localHint(facts) {
  const city = (settings.weatherCity || '').trim();
  if (!city || !facts) return '';
  const esc = city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(esc, 'i');
  const body = String(facts).replace(/^(?:Fiche|Article)[^:\n]{0,120}:\s*/gm, '');
  const sentence = body.split(/(?<=[.!?])\s+|\n/).find((x) => re.test(x));
  return sentence ? 'la fiche mentionne : « ' + sentence.trim().slice(0, 220) + " », ce qui parle aux auditeurs de la région de " + city + '.' : '';
}
// Nom de la rubrique (et son petit jingle) pour la chronique et la culture courte.
function rubriqueFor(role, angle, o) {
  if (o.hookAnswer) return { name: o.hookAnswer.type === 'pari' ? 'Vrai ou faux, la réponse' : 'La réponse', sting: 'pari' };
  if (o.express) return { name: 'Vrai ou faux', sting: 'pari' };
  if (o.eph) return { name: "Ça s'est passé un " + o.eph.date, sting: 'ephemeride' };
  if (o.episode) return { name: 'Le feuilleton de la soirée', sting: 'feuilleton' };
  const id = angle && angle.id;
  if (id === 'anecdote_epoque' && o.next && o.next.year) return { name: 'Retour en ' + o.next.year, sting: 'culture' };
  if (role === 'chronique') return { name: "L'histoire derrière le tube", sting: 'histoire' };
  return { name: 'La minute culture', sting: 'culture' };
}

// ------------------------------------------------- grille d'émissions
// settings.schedule : [{ id, name, days: [0..6], time: 'HH:MM', minutes (0 = en continu), amb (nom
// d'une de Mes ambiances, ou '' pour les réglages enregistrés avec l'émission), sel, wake, on }].
const DAY_NAMES = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
function scheduleSnap(e) {
  const a = e.amb ? savedAmb.find((x) => x.name === e.amb) : null;
  const snap = Object.assign(clone(DEFAULT_SEL), clone(a ? a.sel : (e.sel || sel)));
  snap.prompt = snap.prompt || '';
  if (Number(e.minutes) > 0) { snap.mode = 'fixe'; snap.duration = String(Number(e.minutes)); } else snap.mode = 'continu';
  if (e.wake && !a && !e.sel) snap.moment = 'reveil';
  return snap;
}
function waitBridge(ms) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    const tick = () => { if (bridgeReady || Date.now() - t0 > ms) resolve(bridgeReady); else setTimeout(tick, 500); };
    tick();
  });
}
let scheduledBusy = false;
async function startScheduled(e) {
  if (scheduledBusy) return;
  scheduledBusy = true;
  try {
    if (!(await waitBridge(60000))) { toast("L'émission « " + e.name + " » n'a pas pu démarrer : YouTube Music n'était pas prêt.", null, 12000); return; }
    autoplayGuardOn = false;
    dlog('session', 'émission programmée', { nom: e.name, heure: e.time, duree: e.minutes || 'continu', reveil: !!e.wake });
    toast((e.wake ? 'Réveil : ' : 'Émission programmée : ') + '« ' + e.name + ' » commence.', null, 8000);
    await startSession(scheduleSnap(e), { show: { id: e.id, name: e.name, wake: !!e.wake, minutes: Number(e.minutes) || 0 } });
    if (e.wake && session && session.show && session.show.id === e.id) wakeRamp(session);
  } finally {
    scheduledBusy = false;
  }
}
// Réveil en douceur : le volume part bas et remonte sur trois minutes jusqu'au réglage habituel.
async function wakeRamp(s) {
  const target = Math.max(30, Math.min(100, Number(ps.volume) || 70));
  let v = Math.round(target * 0.15);
  await callSafe('setVolume', v);
  const step = Math.max(1, Math.round((target - v) / 18));
  const id = setInterval(() => {
    if (session !== s || s.status === 'ended') { clearInterval(id); return; }
    v = Math.min(target, v + step);
    callSafe('setVolume', v);
    if (v >= target) clearInterval(id);
  }, 10000);
}
// Onglet ouvert par la grille (aucun n'était prêt) : l'émission démarre dès qu'il est chargé.
async function checkGridPending() {
  try {
    const { gridPending } = await chrome.storage.local.get(['gridPending']);
    if (!gridPending || Date.now() - gridPending.at > 5 * 60000) return;
    await chrome.storage.local.remove('gridPending');
    const e = (settings.schedule || []).find((x) => x.id === gridPending.id);
    if (e) startScheduled(e);
  } catch (err) { /* ignore */ }
}
// Prochaine émission de la grille (pour l'annoncer en fin d'émission et l'afficher).
function nextScheduled(fromMs) {
  const list = (settings.schedule || []).filter((e) => e && e.on !== false && e.time && (e.days || []).length);
  let best = null;
  const from = new Date(fromMs || Date.now());
  for (const e of list) {
    const [hh, mm] = e.time.split(':').map(Number);
    for (let d = 0; d < 8; d++) {
      const x = new Date(from.getFullYear(), from.getMonth(), from.getDate() + d, hh || 0, mm || 0);
      if (x <= from || !e.days.includes(x.getDay())) continue;
      if (!best || x < best.at) best = { e, at: x };
      break;
    }
  }
  return best;
}
function whenText(at) {
  const now = new Date();
  const d0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((new Date(at.getFullYear(), at.getMonth(), at.getDate()) - d0) / 86400000);
  const hm = at.getHours() + ' h' + (at.getMinutes() ? ' ' + String(at.getMinutes()).padStart(2, '0') : '');
  return (days === 0 ? "aujourd'hui" : days === 1 ? 'demain' : ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][at.getDay()]) + ' à ' + hm;
}

// Bilan de fin d'émission : quelques souvenirs, les invités, le score, puis la prochaine émission de la grille.
async function playRecap(s) {
  if (!settings.radio || settings.showRecap === false || !(settings.claudeAnnounce && hasKey)) return;
  const played = s.played.filter((t) => t && t.title && !t.guest);
  if (played.length < 3) return;
  const counts = {};
  for (const t of played) counts[t.artist] = (counts[t.artist] || 0) + 1;
  const artists = Object.entries(counts).sort((a, b) => b[1] - a[1]).map((x) => x[0]);
  const kept = played.filter((t) => !t.skipped);
  const highlights = [kept[0], kept[Math.floor(kept.length / 2)], kept[kept.length - 1]].filter((t, i, a) => t && a.indexOf(t) === i).map((t) => spokenTitle(t.title) + ' de ' + t.artist);
  const nx = nextScheduled();
  const tp = timeParts(new Date());
  const duo = useGemini() && settings.duo;
  const g = hostGenders();
  const host = (settings.hostName || 'Alex').trim() || 'Alex';
  const cohost = (settings.cohostName || 'Sam').trim() || 'Sam';
  radioLog(s, 'Bilan de fin : préparation…');
  let text = '';
  try {
    text = await withTimeout(claude('announce', {
      kind: 'outro', host, style: settings.hostStyle, listener: (settings.listenerName || '').trim(), time: tp.time, partOfDay: tp.part, lang: radioLang(),
      sayTime: false, duo, turns: duo ? 4 : 0, cohost, cohostStyle: settings.cohostStyle, hostGender: g.host, cohostGender: g.cohost,
      tags: useGemini(), emotion: emotionFor(s, 'outro', null, null, {}), sfx: false, sing: false, recent: (s.lastLines || []).slice(-4),
      show: s.show ? { name: s.show.name } : null, power: aiPower(), persona: personaPayload(duo, false, null), lore: lorePayload(s, 'outro'),
      recap: { count: played.length, minutes: Math.max(1, Math.round((s.playedSec || 0) / 60)), artists, highlights,
        guests: (s.guestList || []).map((x) => x.name + ' (' + x.role + ')'), dedics: (s.dedicList || []).length, score: s.score || null,
        hostName: host, cohostName: cohost, next: nx ? { name: nx.e.name, when: whenText(nx.at) } : null }
    }), aiTimeout(15000));
  } catch (e) { dlog('annonce', 'bilan : ' + e.message); return; }
  if (!text || session !== s) return;
  const turns = takeMarks(parseTurns(String(text).split('\n@@MDJ@@')[0], duo)).turns;
  const plain = stripTags(turns.map((x) => x.text).join(' '));
  let audio = null;
  if (useGemini()) {
    try {
      const gv = geminiVoices();
      const styled = turns.map((x) => Object.assign({}, x, { style: (x.speaker === 'B' ? gv.styleB : gv.styleA) + (x.emotion ? '. Delivery for this line: ' + x.emotion : '') }));
      const r = await withTimeout(claude('gemini-tts', { turns: styled, voiceA: gv.a, voiceB: gv.b, style: gv.styleA }), 40000);
      audio = b64ToBuffer(r.b64);
    } catch (e) { dlog('annonce', 'bilan, voix : ' + e.message); }
  }
  if (session !== s) return;
  if (settings.jingles) await jingle(s, 2);
  if (session !== s) return;
  if (settings.radioBed) callSafe('bedStart', 0.45, kitOpts());
  await sayIt({ text: plain, audio, engine: audio ? 'Gemini' : '', s, kind: 'outro', info: 'bilan de ' + played.length + ' titres' + (nx ? ', prochaine émission annoncée' : '') });
  if (settings.radioBed) callSafe('bedStop', 2);
}

// ------------------------------------------------ dédicaces et demandes
// Une dédicace s'accroche à un titre : les animateurs la lisent juste avant lui. Une demande
// (« Tri Martolod d'Alan Stivell ») est cherchée sur YouTube Music et passe juste après le titre en cours.
function dedicTargetIndex(s) {
  const cur = s.current;
  const d = (cur && (ps.duration || cur.duration)) || 0;
  const left = d ? d - (ps.time || 0) : 999;
  // Annonce du prochain titre déjà en route, ou plus le temps de la refaire : le suivant d'après.
  return s.fadeVoice || left < 40 ? 1 : 0;
}
async function sendDedication(o) {
  const s = session;
  if (!s || (s.status !== 'playing' && s.status !== 'suspended')) { toast('Lance une sélection pour envoyer une dédicace.'); return false; }
  if (!settings.radio) { toast("Active le mode radio pour que les animateurs lisent ta dédicace."); return false; }
  const to = String(o.to || '').trim().slice(0, 60);
  const msg = String(o.msg || '').trim().slice(0, 280);
  const from = String(o.from || '').trim().slice(0, 40);
  const ask = String(o.ask || '').trim().slice(0, 120);
  if (!to && !msg && !ask) { toast('Écris à qui tu la dédies, un message ou un titre à demander.'); return false; }
  const dedic = { id: uid(), to, msg, from, request: !!ask, at: Date.now() };
  let target = null;
  if (ask) {
    toast('Recherche de « ' + ask + ' » sur YouTube Music…', null, 4000);
    const items = await call('search', ask, true).catch(() => null);
    const it = (items || []).find((x) => x && x.videoId && !SKIP_VERSION.test(x.title || ''));
    if (session !== s) return false;
    if (!it) { toast('Je n\'ai pas trouvé « ' + ask + ' » sur YouTube Music. Essaie avec le titre et l\'artiste.', null, 7000); return false; }
    const t = trackFromItem(it, { energy: 3 });
    if (C.isBanned(bannedSet(), t.artist)) { toast(t.artist + ' est dans ta liste noire : retire-le d\'abord (Réglages › Lecture et bibliothèque).', null, 7000); return false; }
    const idx = Math.min(dedicTargetIndex(s), s.queue.length);
    target = Object.assign({}, t, { id: uid(), request: true, dedic });
    s.usedKeys.add(target.key);
    s.queue.splice(idx, 0, target);
  } else {
    const idx = Math.min(dedicTargetIndex(s), Math.max(0, s.queue.length - 1));
    target = s.queue[idx];
    if (!target) { toast('Pas encore de titre à suivre : réessaie dans un instant.'); return false; }
    if (target.dedic) { toast('Une dédicace est déjà prévue sur le prochain titre : réessaie après.', null, 5000); return false; }
    target.dedic = dedic;
  }
  dlog('session', ask ? 'demande à l\'antenne' : 'dédicace', { pour: to, message: msg, de: from, titre: target.title, artiste: target.artist });
  radioLog(s, (ask ? 'Demande' : 'Dédicace') + (to ? ' pour ' + to : '') + ' : lue juste avant « ' + target.title + ' ».');
  toast((ask ? 'Demande trouvée : « ' + target.title + ' » de ' + target.artist + '. ' : '') + 'Les animateurs la liront juste avant ce titre.', null, 7000);
  render();
  return true;
}
const dedicIdOf = (t) => (t && t.dedic && t.dedic.id) || '';
