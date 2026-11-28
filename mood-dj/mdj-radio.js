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
// Programme présenté avec ce titre. Quand le titre vient d'ouvrir un programme, c'est la liste retenue à ce
// moment-là (2.37). Avec le rythme naturel, la longueur du programme suivant est tirée juste après l'ouverture :
// recalculée, la liste n'avait plus la même longueur, l'annonce préparée (texte et voix déjà payés) ne
// correspondait plus et elle était refaite au démarrage du titre, souvent trop tard pour être dite.
function programmeOf(s, t) {
  const keys = s && s.programme && s.programme.keys;
  if (keys && t && keys[0] === t.key && s.queue && !s.queue.includes(t)) {
    return [t].concat(keys.slice(1).map((k) => s.queue.find((x) => x.key === k)).filter(Boolean));
  }
  return programmeList(s, t);
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
  { id: 'chambre', w: 3, txt: "L'un des deux chambre gentiment l'autre (ses goûts musicaux, sa façon d'annoncer, une petite manie d'animateur) ; l'autre se défend avec humour, puis l'un des deux lance le titre suivant." },
  { id: 'debat', w: 3, prev: true, txt: "Petit désaccord amical sur le titre qu'on vient d'écouter : l'un adore, l'autre est moins convaincu, chacun défend son avis en une phrase, puis ils lancent le suivant. Si tu ne connais pas précisément ce morceau, reste sur le ressenti et l'usage, sans décrire un instrument ni un passage." },
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
  { id: 'lien', w: 2, prev: true, txt: "Ils trouvent un lien amusant ou inattendu entre le titre écouté et le suivant (l'ambiance, l'énergie, le thème, les titres eux-mêmes), sans inventer de fait sur les artistes, puis lancent le suivant." },
  { id: 'vanne', w: 2, txt: "Une vanne bon enfant sur le style musical, ses clichés ou le titre du morceau suivant ; l'autre surenchérit, puis l'un des deux annonce le titre." },
  { id: 'reaction', w: 2, facts: 'prev', txt: "Ils réagissent à chaud au titre qu'on vient d'écouter, avec des avis différents, puis enchaînent sur le suivant. Si tu ne connais pas précisément ce morceau, reste sur le ressenti et l'usage, sans décrire un instrument ni un passage." },
  { id: 'auditeur', w: 1, txt: "Ils s'adressent directement aux auditeurs, à tous ceux qui écoutent, d'une question complice ou d'une consigne lancée à la cantonade, puis lancent le titre." },
  // Nouveaux types de discussion autour de la musique (2.35).
  { id: 'mode_emploi', w: 2, txt: "Le mode d'emploi du titre suivant : l'un donne, avec le sérieux d'une notice, la façon de l'écouter ; l'autre ajoute une consigne ou en conteste une. Puis ils le lancent." },
  { id: 'defi', w: 1.5, txt: "L'un lance à l'autre un petit défi à tenir pendant le titre suivant ; l'autre relève, négocie ou triche déjà. Puis ils lancent le titre." },
  { id: 'aveu', w: 2, txt: "L'un fait un petit aveu musical, sans prétendre avoir rencontré un artiste ni assisté à un concert précis ; l'autre réagit selon son caractère (compatit, se moque gentiment, ou avoue pire). Puis ils lancent le titre suivant." },
  { id: 'coulisses', w: 1.5, prev: true, txt: "Ils racontent ce qui s'est passé dans le studio pendant le titre qu'on vient d'écouter ; l'un accuse, l'autre nie, confirme ou en rajoute. Puis ils lancent le suivant." },
  { id: 'teaser', w: 1.5, txt: "Ils font monter l'envie du titre suivant sans le nommer tout de suite ; l'autre s'impatiente ou essaie de deviner ; puis ils le nomment et le lancent." },
  { id: 'verdict', w: 1.5, prev: true, txt: "Chacun donne sa note sur dix au titre qu'on vient d'écouter et la justifie en quelques mots : des notes généreuses (on ne descend jamais un titre de la programmation), mais jamais la même. Puis ils lancent le suivant." },
  { id: 'question', w: 2, txt: "L'un pose à l'autre une question personnelle sur son rapport à la musique ; l'autre répond franchement en une ou deux phrases (sans faux souvenir avec un vrai artiste), puis retourne la question ou lance le titre suivant." },
  { id: 'jeu', game: true, facts: 'next', txt: "Un vrai ou faux express sur le titre suivant ou son artiste, tiré des fiches : l'un affirme, l'autre parie, et la réponse tombe tout de suite (détails plus bas) ; puis ils lancent le titre." },
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
  { id: 'mode_emploi', w: 1.5, txt: "Le mode d'emploi du titre suivant, donné avec le sérieux d'une notice : la façon de l'écouter. Puis annonce-le." },
  { id: 'aveu', w: 1, txt: "Un petit aveu musical, glissé aux auditeurs comme une confidence (sans prétendre avoir rencontré un artiste ni assisté à un concert précis), puis annonce le titre suivant." },
  { id: 'coulisses', w: 1, prev: true, txt: "Raconte en une phrase ce qui s'est passé dans le studio pendant le titre qu'on vient d'écouter, puis annonce le suivant." },
  { id: 'jeu', game: true, facts: 'next', txt: "Un vrai ou faux express sur le titre suivant ou son artiste, tiré des fiches, posé aux auditeurs : la réponse tombe après une courte pause (détails plus bas) ; puis annonce le titre." },
  { id: 'bavardage', w: 2, solo: true, txt: "Un mot de bavardage, hors musique, comme une confidence glissée à l'antenne ; puis reviens à la musique et annonce le titre suivant." }
];
// Sujets précis pour les angles qui finissent sinon toujours pareil (la même vanne trois fois
// dans la soirée) : un sujet est tiré au sort à chaque fois, sans reprise dans la session.
// Bavardage, hors musique (2.35). « Papotage » : 145 sujets sans saison, sans actualité et sans lieu précis, rangés
// par famille ; les cinq premières familles valent pour un animateur seul comme pour un duo, « entreEux » demande
// deux animateurs. Cinq autres formats ont chacun leurs sujets (CHAT_POOL) : en tout, 260 sujets hors musique.
const CHAT_TOPICS = {
  quotidien: ["le repas raté (ou réussi) du jour", "la nuit trop courte de la veille", "le café ou le thé du moment, et la tasse de trop", "un rêve bizarre fait cette nuit", "ce qu'il y a de prévu en sortant du studio", "le réveil qui n'a pas sonné", "une course oubliée, encore", "les clés perdues, puis retrouvées au pire endroit", "un vêtement mis à l'envers sans s'en rendre compte", "la lessive qui attend depuis trop longtemps", "un téléphone à trois pour cent de batterie", "la liste de choses à faire qui ne raccourcit jamais", "le seul plat qu'on sait vraiment faire", "la sieste, pour ou contre", "{repas} idéal", "un objet acheté sans raison et jamais utilisé", "une notice de montage impossible à suivre", "le tiroir fourre-tout que tout le monde a chez soi", "une plante qu'on essaie de garder en vie", "le grignotage de fin de soirée", "un mot de passe oublié pour la dixième fois", "le rangement toujours remis à demain", "une recette tentée après l'avoir vue en vidéo", "la tasse préférée, et pourquoi on n'en change pas", "ce qu'on trouve au fond de ses poches aujourd'hui"],
  studio: ["une disparition dans le studio : {objet}", "une petite panne dans le studio : {panne}", "un message reçu d'un collègue ou d'un proche de la station", "un petit rituel d'avant-émission", "ce qui traîne sur la table du studio", "le chauffage du studio, éternel sujet de discorde", "la chaise du studio qui grince", "un câble dont personne ne sait à quoi il sert", "le bouton de la console qu'il ne faut surtout pas toucher", "le casque qui a rendu l'âme", "un mot mystérieux retrouvé collé sur la console", "la réserve de biscuits du studio, et qui la vide", "la lumière du studio, trop forte ou trop faible", "une vieille affiche accrochée au mur", "le stylo qui ne marche jamais quand il faut", "un carton jamais déballé dans un coin", "la pendule du studio, toujours un peu en avance", "un micro capricieux", "la meilleure place du studio, que tout le monde se dispute", "une odeur inexpliquée dans le studio", "la bouilloire ou la cafetière du studio, et ses humeurs", "le ménage du studio, et à qui c'est le tour", "une mise à jour du matériel qui a tout déréglé", "les objets oubliés par les visiteurs", "ce qu'on voit par la fenêtre du studio, sans dire où", "ce qu'un collègue écoute en boucle hors antenne", "le carnet où quelqu'un note tout", "un vieil objet retrouvé au fond d'un tiroir du studio", "le porte-bonheur du studio", "le voyant rouge de l'antenne, et ce qu'on fait quand il s'éteint"],
  soi: ["le métier d'avant la radio", "un souvenir d'enfance lié à un long trajet", "le pire talent caché", "une bonne résolution déjà abandonnée", "une chose apprise cette semaine", "ce qui fait rire en ce moment", "le métier rêvé quand on était enfant", "une peur un peu ridicule", "une collection commencée et jamais finie", "un sport tenté une seule fois : {sport}", "le plus beau raté en cuisine", "une langue qu'on aurait aimé parler", "un surnom d'enfance", "la matière détestée à l'école", "un petit plaisir un peu honteux, qui n'a rien de musical", "un objet gardé depuis toujours", "le pire cadeau jamais reçu", "le meilleur conseil jamais reçu", "une superstition qu'on respecte quand même", "un talent parfaitement inutile", "ce qu'on ferait d'une journée sans rien de prévu", "un jeu d'enfance auquel on rejouerait bien", "une manie de rangement", "une chose qu'on ne sait toujours pas faire à son âge", "le premier petit boulot", "une habitude prise récemment", "ce qu'on emporte toujours en voyage", "une invention qu'on aimerait voir exister", "le sens de l'orientation, ou son absence", "une petite victoire de la semaine"],
  jeux: ["un débat absurde : le superpouvoir le plus inutile", "un débat absurde : la pire invention du quotidien", "un top 3 improvisé : {top}", "ce qu'on emporterait sur une île déserte (pas de disque)", "un débat absurde : le meilleur moment de la journée", "un débat absurde : chat ou chien, sans se fâcher", "un débat absurde : le meilleur parfum de glace", "un débat absurde : la meilleure place dans une voiture", "un débat absurde : sucré ou salé au petit-déjeuner", "un débat absurde : escalier ou ascenseur", "un débat absurde : l'ananas sur la pizza", "l'époque où on aimerait passer une semaine", "le métier qu'on ferait pendant une seule journée", "pouvoir revenir dix secondes en arrière : pour quoi faire", "trois objets pour décrire quelqu'un", "le pire nom possible pour {animal}", "inventer {invention} qui n'existe pas", "le mot le plus drôle de la langue", "la devise que pourrait avoir le studio", "le classement des jours de la semaine", "une règle à ajouter à un jeu de société", "le meilleur bruit du quotidien", "la question à poser à {interlocuteur}", "un sport qui devrait exister", "le pire superhéros imaginable", "un débat absurde : {duel}"],
  culture: ["un film ou une série vus récemment, sans rien divulguer", "un jeu vidéo ou un jeu de société du moment", "un livre ou une bande dessinée en cours", "un film vu dix fois sans s'en lasser", "le méchant de fiction préféré", "une série jamais terminée", "un dessin animé d'enfance", "un livre commencé trois fois", "le pire film vu jusqu'au bout", "une réplique de film qu'on ressort à tout propos", "un personnage de fiction avec qui on partirait en voyage", "un jeu auquel on triche un peu", "un documentaire qui a fait changer d'avis", "le héros de fiction le plus agaçant", "une fin d'histoire qu'on aurait écrite autrement, sans rien divulguer"],
  entreEux: ["{vetement} de l'autre aujourd'hui", "un mot que l'un des deux n'arrive jamais à prononcer", "le dernier fou rire hors antenne", "un compliment sincère, pour une fois", "un pari stupide entre eux", "ce que l'un a emprunté à l'autre et jamais rendu", "la fois où l'un a sauvé la mise à l'autre", "qui arrive toujours le premier, et qui le dernier", "le défaut de l'autre qu'on finit par trouver attachant", "un secret de polichinelle entre eux", "ce que l'un sait faire et que l'autre lui envie", "qui range, et qui dérange", "le souvenir de leur première émission ensemble", "un désaccord vieux de plusieurs années, toujours pas réglé", "ce que l'un mange et que l'autre ne supporte pas", "qui conduit, et qui lit la carte", "le cadeau que l'un devrait offrir à l'autre", "l'imitation que l'un fait de l'autre", "ce qu'ils feraient s'ils échangeaient leurs places une journée", "la dette d'honneur que l'un doit encore à l'autre"]
};
const CHAT_SOLO = [].concat(CHAT_TOPICS.quotidien, CHAT_TOPICS.studio, CHAT_TOPICS.soi, CHAT_TOPICS.jeux, CHAT_TOPICS.culture);
const CHAT_DUO = CHAT_SOLO.concat(CHAT_TOPICS.entreEux);
const CHAT_POOL = {
  dilemme: ["ne plus jamais manger de fromage, ou ne plus jamais manger de chocolat", "avoir toujours trop chaud, ou toujours trop froid", "parler toutes les langues, ou parler aux animaux", "vivre sans téléphone, ou sans chaussures", "être toujours en avance d'une heure, ou en retard de dix minutes", "voler à un mètre du sol, ou être invisible seulement quand personne ne regarde", "éternuer des paillettes, ou rire comme une porte qui grince", "ne manger que des pâtes, ou ne plus jamais en manger", "être annoncé par un crieur à chaque entrée dans une pièce, ou applaudi à chaque sortie", "tout savoir sur un seul sujet, ou un peu sur tout", "la montagne sans jamais redescendre, ou la mer sans jamais se baigner", "des mains à la place des pieds, ou des pieds à la place des mains", "dire tout ce qu'on pense, ou ne plus jamais donner son avis", "revivre toujours le même lundi, ou sauter tous les week-ends", "un dragon de la taille d'un chat, ou un chat de la taille d'un dragon", "ne plus jamais faire la queue, ou ne plus jamais chercher ses clés", "une mémoire parfaite, ou pouvoir tout oublier à volonté", "vivre dans un phare, ou sur une péniche", "se téléporter mais arriver toujours en retard, ou voler mais très lentement", "être célèbre pour une chose ridicule, ou inconnu pour une chose géniale", "ne parler qu'en rimes, ou ne parler qu'en questions", "un café toujours trop chaud, ou toujours tiède", "connaître la fin de tous les films, ou ne jamais voir la fin d'aucun", "un caillou dans la chaussure pour toujours, ou une manche toujours mouillée", "un jardin sans maison, ou une maison sans fenêtres", "être le meilleur du monde à un jeu que personne ne connaît, ou moyen à tout", "vivre cent ans dans le passé, ou cent ans dans le futur", "un robot qui fait le ménage mais commente tout, ou pas de robot", "ne plus jamais avoir sommeil, ou ne plus jamais avoir faim", "le petit-déjeuner à tous les repas, ou plus jamais de petit-déjeuner", "savoir réparer tout ce qui casse, ou ne jamais rien casser", "toujours dire la vérité, ou toujours mentir très mal", "un sac sans fond impossible à ranger, ou des poches minuscules toujours pleines", "lire deux fois plus vite, ou tout retenir du premier coup", "un double qui fait toutes les corvées mais raconte tout, ou tout faire soi-même", "ne plus pouvoir s'asseoir, ou ne plus pouvoir rester debout", "une chambre dans une bibliothèque, ou dans une boulangerie", "mettre le monde sur pause cinq minutes par jour, ou l'accélérer pendant une heure", "être suivi partout par un canard affectueux, ou par une chèvre jalouse", "avoir un avis sur tout, ou ne jamais avoir d'avis sur rien"],
  minijeu: ["ni oui ni non, pendant trois répliques", "le mot interdit : l'un impose un mot que l'autre ne doit plus dire", "trois mots pour décrire la journée, pas un de plus", "la phrase à finir : l'un commence, l'autre termine", "le portrait chinois express : si l'autre était {portrait}", "deviner à quoi pense l'autre en trois questions", "l'alphabet : chaque réplique commence par la lettre suivante", "vrai ou faux sur la vie du studio, ouvertement pour rire", "dire le plus de choses possible en une seule phrase", "pierre, feuille, ciseaux, raconté à la radio", "le jeu des contraires : répondre l'inverse de ce qu'on pense", "inventer la définition d'un mot qui n'existe pas", "le téléphone arabe à deux", "celui qui rit a perdu", "ne répondre que par des questions"],
  rubrique: ["l'horoscope du studio, ouvertement farfelu", "le conseil pratique du jour, parfaitement inutile", "le mot du jour, inventé de toutes pièces", "la minute philosophie de comptoir", "le bulletin de santé de {patient}", "le bulletin du studio (température, humeur, taux de café), sans rapport avec le vrai temps qu'il fait", "les petites annonces du studio (objet perdu, chaise à donner)", "le classement de la semaine dans le studio", "le record du monde le plus inutile, inventé pour l'occasion", "la recette express impossible à réussir", "le point circulation dans le couloir du studio", "la bonne résolution de la semaine, à ne surtout pas tenir", "le flash info du studio, où rien d'important ne s'est passé", "la leçon de savoir-vivre à l'antenne", "le dicton du jour, inventé", "la question existentielle de la semaine", "le bilan sportif de l'équipe (monter l'escalier compte)", "le guide de survie en studio", "l'objet du mois, élu à l'unanimité moins une voix", "la minute bricolage, sans outil et sans résultat"],
  nouvelles: ["quelqu'un de la station a fait parler de lui aujourd'hui", "un objet du studio a encore fait des siennes", "l'affaire en cours à la station a un peu avancé", "quelqu'un de la station a laissé un mot", "une petite réparation de fortune", "une visite surprise hors antenne", "un pari en cours dans l'équipe", "la dernière lubie de quelqu'un de l'équipe", "ce que l'équipe prépare en secret", "une vieille histoire de la station qui ressort", "une dispute pour rire dans l'équipe, et qui l'a gagnée", "un coup de fil reçu hors antenne", "ce que quelqu'un a cuisiné pour toute l'équipe", "un objet de la station qu'il faudrait remplacer depuis longtemps", "le rangement du studio, encore repoussé", "une idée d'émission spéciale lancée par quelqu'un de l'équipe", "un souvenir commun de leurs débuts", "une nouvelle règle dans le studio", "un petit exploit de quelqu'un de l'équipe", "ce que quelqu'un de l'équipe a oublié au studio"],
  auditeurs: ["une question lancée aux auditeurs, sans attendre de réponse", "un petit défi lancé aux auditeurs d'ici la fin du prochain titre", "un merci à ceux qui écoutent depuis longtemps", "un sondage pour rire auprès des auditeurs", "le conseil du jour aux auditeurs, parfaitement inutile", "une devinette posée aux auditeurs, avec la réponse à la prochaine intervention", "un vote à main levée, invisible à la radio", "la permission officielle de ne rien faire pendant trois minutes", "un mot pour ceux qui viennent d'arriver", "un mot pour ceux qui sont là depuis le début", "une excuse officielle, offerte aux auditeurs, pour être en retard", "un engagement solennel pris devant les auditeurs", "un secret confié aux auditeurs, à ne pas répéter", "un compliment collectif aux auditeurs", "une consigne de sécurité absurde", "une question de goût posée aux auditeurs, hors musique", "une minute de gratitude, sans ironie", "un pari pris avec les auditeurs", "le mot de passe du jour, pour les habitués", "une promesse faite aux auditeurs, à tenir plus tard dans l'émission"]
};
// Les formats du bavardage : le même angle « bavardage » (donc la même fréquence), mais six façons de le faire.
// duoOnly : il faut deux animateurs ; long : pas par-dessus une intro ; lore : s'appuie sur l'univers de la station.
const CHAT_FORMATS = [
  { id: 'papotage', w: 5,
    duo: "Un moment de bavardage, hors musique : ils parlent d'autre chose, comme deux collègues entre deux disques, en quelques répliques légères et sans chercher la vanne à tout prix ; puis l'un des deux revient à la musique et lance le titre suivant. Sujet imposé cette fois :",
    solo: "Un mot de bavardage, hors musique, comme une confidence glissée à l'antenne ; puis reviens à la musique et annonce le titre suivant. Sujet imposé cette fois :" },
  { id: 'dilemme', w: 2,
    duo: "Un « tu préfères », hors musique : l'un soumet à l'autre un dilemme absurde, l'autre choisit et se justifie avec le plus grand sérieux, puis renvoie la question en une ligne ; ensuite l'un des deux revient à la musique et lance le titre suivant. Le dilemme :",
    solo: "Un dilemme absurde, hors musique, soumis aux auditeurs : réponds-y toi-même avec le plus grand sérieux, en une ou deux phrases, puis annonce le titre suivant. Le dilemme :" },
  { id: 'minijeu', w: 1.5, duoOnly: true, long: true,
    duo: "Un mini-jeu express entre eux, hors musique, en trois ou quatre répliques : l'un des deux le perd, ou le fait dérailler ; puis ils lancent le titre suivant. Le jeu :" },
  { id: 'rubrique', w: 1.5,
    duo: "Une fausse rubrique, hors musique, annoncée avec le plus grand sérieux et ouvertement farfelue (personne ne doit pouvoir la croire vraie, et aucun fait réel n'y est affirmé) : l'un la présente, l'autre joue le jeu ou la démonte ; puis ils lancent le titre suivant. La rubrique :",
    solo: "Une fausse rubrique, hors musique, annoncée avec le plus grand sérieux et ouvertement farfelue (personne ne doit pouvoir la croire vraie, et aucun fait réel n'y est affirmé), en deux phrases ; puis annonce le titre suivant. La rubrique :" },
  { id: 'nouvelles', w: 2, lore: true,
    duo: "Des nouvelles de la vie de la station, hors antenne et hors musique, racontées comme un petit potin entre collègues, en s'appuyant sur l'univers de la station ; puis ils lancent le titre suivant. Le sujet :",
    solo: "Des nouvelles de la vie de la station, hors antenne et hors musique, glissées comme un petit potin, en t'appuyant sur l'univers de la station ; puis annonce le titre suivant. Le sujet :" },
  { id: 'auditeurs', w: 1.5,
    duo: "Un mot directement pour les auditeurs, pour tous ceux qui écoutent, hors musique ; l'autre renchérit ou tempère ; puis ils lancent le titre suivant. Le sujet :",
    solo: "Un mot directement pour les auditeurs, pour tous ceux qui écoutent, hors musique ; puis annonce le titre suivant. Le sujet :" }
];
// Discussions autour de la musique : sujets imposés, tirés sans reprise dans l'émission (51 avant la 2.35, 249 depuis).
// Les sujets tiennent au ressenti et à l'usage d'un titre plus qu'à sa technique : l'IA n'entend pas le morceau.
const ANGLE_TOPICS = {
  chambre: ["un plaisir coupable musical inavouable", "ce qu'il ou elle boit pendant l'émission", "sa façon de taper du pied à contretemps", "sa manie de chanter faux les refrains", "son attachement à un vieux matériel (platine, casque, vieil ampli)", "son retard au début de l'émission", "ses jeux de mots ratés", "sa playlist pour {activite}", "ses théories farfelues sur les groupes", "un karaoké raté", "sa manie de noter les solos de guitare", "son air de connaisseur quand il ou elle ne connaît pas", "le grignotage en douce pendant les chansons", "sa tenue imaginée aujourd'hui", "son premier concert", "sa façon de danser", "sa façon d'annoncer les titres", "sa façon de monter le son sans prévenir", "ses transitions un peu trop longues", "sa mémoire des dates, qu'il ou elle étale volontiers", "ses imitations de {imite}", "sa batterie imaginaire sur le bord de la table", "sa mauvaise foi sur un style qu'il ou elle prétend détester", "ses pronostics musicaux jamais vérifiés", "son sifflement approximatif", "sa façon de fermer les yeux sur les ballades", "son classement des meilleurs albums, refait chaque semaine", "ses histoires qui commencent toujours pareil", "son casque réglé beaucoup trop fort", "sa manie de finir les phrases des chansons", "son grand sérieux quand il ou elle parle du vrai son", "sa nostalgie du c'était mieux avant", "ses fredonnements pendant que l'autre parle", "sa façon de présenter chaque titre comme le meilleur de tous les temps", "son incapacité à retenir les paroles", "ses solos de guitare imaginaire", "ses surnoms pour tous les groupes", "sa collection de billets de concert", "son vocabulaire de spécialiste", "ses silences dramatiques avant d'annoncer un titre"],
  debat: ["à écouter {ecoute} ou {ecoute}", "plutôt pour {usage} ou pour {usage}", "à fond ou en sourdine", "pour danser ou pour rester assis", "à chanter à tue-tête ou à écouter sans un mot", "chanson de début ou de fin de soirée", "une fois suffit, ou deux fois de suite", "seul ou à plusieurs", "le matin ou tard le soir", "tube ou chef-d'œuvre", "trop entendu ou jamais assez", "meilleur sur scène ou sur disque (question de goût, sans rien affirmer)", "le refrain ou les couplets", "le titre du morceau, bien ou mal choisi", "a-t-il bien vieilli", "à passer à un mariage, ou surtout pas", "à mettre en réveil, ou surtout pas", "au karaoké : facile ou piège", "les yeux fermés ou en faisant autre chose", "plaisir coupable ou fierté assumée", "en entier ou juste le refrain", "à siffler ou impossible à siffler", "slow ou pas slow", "pour un trajet court ou pour un long voyage", "ce qu'on fait pendant le refrain", "la voix", "la longueur du morceau", "le début du morceau", "le solo, s'il y en a un", "la batterie", "la basse", "le son de la production"],
  reaction: ["l'effet que ça fait", "l'envie que ça donne", "le frisson, ou pas", "la voix", "le refrain qui reste en tête", "l'énergie", "le volume auquel on l'a écouté", "le moment où on a monté le son", "qui a chanté par-dessus", "qui a tapé du pied", "l'humeur dans le studio après le morceau", "ce qu'on aurait envie de faire maintenant", "le silence juste après", "{resume} pour le résumer", "le sourire que ça met", "la nostalgie que ça réveille", "l'envie de le remettre tout de suite", "ce qui reste en tête après", "la tête que faisait l'autre", "le riff, s'il y en a un", "la batterie", "le son", "le début du morceau", "la fin du morceau"],
  vanne: ["les clichés du style", "le titre du morceau", "le nom du groupe", "{mode} de l'époque", "les tenues de scène", "la longueur des solos", "les fans du genre", "l'heure qu'il est", "les pochettes de disques", "les clips de l'époque", "les danses de l'époque", "les noms d'albums à rallonge", "le premier rang des concerts", "le karaoké", "les reprises de fin de mariage", "les sonneries de téléphone", "les compilations de station-service", "le slow", "les chorégraphies", "les rappels en concert", "la boule à facettes", "les briquets et les téléphones levés", "les solos de batterie", "les chœurs qui font oh oh oh", "les intros interminables", "les fins en fondu", "les faux adieux à la scène", "les titres avec une parenthèse", "les groupes qui se reforment", "le synthé porté en bandoulière", "la guitare à deux manches", "les medleys", "les versions longues"],
  devinette: ["un indice sur l'ambiance du morceau", "trois mots, pas un de plus", "le jeu du chaud ou froid", "par élimination", "un indice sur l'époque", "un indice sur le titre lui-même, façon charade", "un mime sonore décrit à la radio", "un indice volontairement trop facile"],
  lien: ["l'énergie qui monte ou qui retombe", "les titres des deux morceaux", "ce qu'on fait en les écoutant", "le contraste entre les deux", "l'époque de chacun", "le même état d'esprit", "un mot qui irait aux deux", "l'ordre dans lequel il faut les écouter", "ce que le premier prépare pour le second", "le fil de l'émission"],
  auditeur: ["une question sur leur façon d'écouter (casque, enceintes, voiture)", "un petit défi pendant le prochain titre", "la consigne du moment (monter le son, chanter, ne rien faire)", "un pari sur ceux qui chantent déjà", "un merci, simplement", "une invitation à rester pour la suite", "une promesse pour la suite de l'émission", "un secret de programmation glissé à mi-voix", "un rendez-vous donné pour plus tard dans l'émission", "un conseil d'écoute", "une dédicace collective, à tous ceux qui écoutent", "la permission officielle de chanter faux"],
  mode_emploi: ["le volume", "le lieu", "la position (assis, debout, allongé)", "avec qui", "ce qu'il faut avoir sous la main", "ce qu'il est interdit de faire pendant", "la préparation", "la dose recommandée", "les effets secondaires", "les contre-indications"],
  defi: ["ne pas chanter le refrain", "ne pas taper du pied", "deviner la durée du morceau à dix secondes près", "tenir sans monter le son", "ne pas faire de batterie sur la table", "annoncer le prochain titre sans reprendre son souffle", "siffler l'air sans se tromper", "rester assis jusqu'au bout", "ne faire aucun commentaire avant la fin", "reconnaître le morceau en moins de {nombre} secondes", "ne pas dire le mot {mot} jusqu'à la prochaine intervention", "garder le silence complet pendant tout le titre", "compter les refrains", "mimer le morceau sans bouger les bras", "trouver {nombre} adjectifs avant la fin"],
  aveu: ["un style qu'il ou elle prétend ne pas aimer", "ce qu'il ou elle chante sous la douche", "un instrument abandonné au bout de trois leçons : {instrument}", "son vrai niveau au karaoké", "des paroles chantées de travers depuis toujours (sans en citer)", "ne pas savoir siffler", "ne pas savoir taper dans les mains en rythme", "pleurer sur les ballades", "écouter le même morceau {fois} fois de suite", "couper les morceaux avant la fin", "lire les notes de pochette en entier", "la musique un peu honteuse du ménage", "danser seul dans sa cuisine", "ne jamais retenir les titres", "confondre deux groupes depuis des années", "avoir fait semblant de connaître un groupe", "chanter plus fort que la radio en voiture", "le premier disque acheté, et pourquoi", "une danse jamais maîtrisée : {danse}", "applaudir toujours au mauvais moment", "ne pas reconnaître les instruments à l'oreille", "monter le son dès que personne ne regarde"],
  coulisses: ["qui chantait", "qui dansait", "qui a renversé {renverse}", "qui regardait ailleurs", "qui a monté le son en douce", "ce qui a failli tomber", "qui a fait la batterie sur la table", "qui a quitté le studio en courant", "ce qu'on a mangé en cachette", "le fou rire étouffé"],
  question: ["son premier souvenir de musique", "la musique de ses quinze ans", "l'instrument qu'il ou elle aurait voulu jouer", "ce qu'il ou elle écoute pour se donner du courage", "ce qu'il ou elle écoute quand ça ne va pas", "chanter ou siffler", "casque ou enceintes", "vinyle, cassette ou rien du tout", "la première fois qu'il ou elle a dansé en public", "ce qu'il ou elle fredonne sans s'en rendre compte", "un style appris à aimer sur le tard", "un style auquel il ou elle ne comprend rien", "la musique qu'il ou elle met pour {moment}", "le silence, pour ou contre", "ce qu'il ou elle écoute en travaillant", "la musique du réveil idéal (un style, pas un titre)", "la musique qu'il ou elle n'ose pas mettre devant les autres", "le son qui le ou la calme tout de suite"],
  teaser: ["une sensation", "un indice d'ambiance", "une promesse", "un seul mot", "l'effet annoncé sur les épaules et sur les pieds", "ce que ça va faire dans le studio", "un avertissement solennel", "un compte à rebours"]
};
// Cases à remplir (2.35) : un sujet peut contenir {case} ; la valeur est tirée à chaque fois. Quand le sujet
// revient, des dizaines d'émissions plus tard, ce n'est plus tout à fait le même.
const TOPIC_SLOTS = {
  objet: ["le stylo qui marchait encore", "le chargeur", "la multiprise", "le coussin", "le sucre", "la télécommande", "les ciseaux", "le tournevis", "la tasse de l'un des deux", "le parapluie", "le carnet", "la lampe de bureau", "le rouleau de scotch", "les clés du placard", "le dernier biscuit"],
  panne: ["la lumière qui clignote", "la porte qui ne ferme plus", "un voyant inconnu qui s'allume", "la chaise qui s'affaisse", "le robinet qui goutte", "le chauffage qui siffle", "un écran qui s'éteint tout seul", "l'horloge arrêtée", "le store coincé", "un bouton resté enfoncé"],
  repas: ["le petit-déjeuner", "le goûter", "le pique-nique", "le repas de minuit", "le sandwich"],
  sport: ["l'escalade", "le patin à glace", "le yoga", "le surf", "le tir à l'arc", "l'aviron", "le badminton", "l'équitation", "la plongée", "le golf"],
  top: ["les pires excuses pour arriver en retard", "les meilleurs bruits du quotidien", "les objets les plus inutiles d'une cuisine", "les meilleures raisons de rester au lit", "les phrases qu'on dit tous les lundis", "les pires cadeaux", "les meilleurs endroits pour une sieste", "les choses qu'on perd toujours", "les meilleurs goûters", "les pires idées de déguisement", "les inventions qui manquent", "les meilleures odeurs"],
  duel: ["douche ou bain", "stylo ou crayon", "couette ou couverture", "côté fenêtre ou côté couloir", "pâtes ou riz", "lève-tôt ou couche-tard", "marcher ou courir", "thé ou café", "carnet ou téléphone", "ville ou campagne", "escalier roulant ou escalier tout court", "tartine ou céréales", "chaussettes dépareillées ou pas de chaussettes", "mer ou montagne", "lundi matin ou dimanche soir"],
  animal: ["un chat", "un chien", "un poisson rouge", "une tortue", "un perroquet", "un hamster"],
  interlocuteur: ["un extraterrestre", "un voyageur venu du futur", "un dinosaure", "soi-même à dix ans", "un chat qui saurait parler", "le dernier dragon"],
  invention: ["une fête", "un sport", "un métier", "un jour de la semaine", "un panneau de signalisation", "un mot"],
  vetement: ["le pull", "les chaussures", "la chemise", "le bonnet", "les chaussettes", "la veste", "le tee-shirt"],
  portrait: ["un objet", "un plat", "un meuble", "un moyen de transport", "un outil", "un dessert", "un bruit", "un vêtement"],
  patient: ["la cafetière", "la chaise qui grince", "la plante verte", "l'imprimante", "le vieux casque", "la bouilloire"],
  activite: ["le sport", "le ménage", "la cuisine", "le bricolage", "les longs trajets"],
  imite: ["chanteurs", "batteurs", "guitaristes", "chefs d'orchestre", "présentateurs"],
  usage: ["le ménage", "le sport", "la route", "le canapé", "la cuisine", "le réveil", "la douche", "un long trajet", "un dimanche matin", "un lundi matin", "un vendredi soir", "les jours sans", "une fête", "une soirée tranquille", "ranger son bureau", "marcher vite", "ne rien faire", "se donner du courage"],
  ecoute: ["en voiture", "au casque", "sur de grosses enceintes", "sur un petit poste", "en fond sonore", "fenêtres ouvertes", "dans le noir", "en marchant"],
  resume: ["un seul mot", "deux mots", "trois mots"],
  mode: ["les coiffures", "les pantalons", "les lunettes", "les vestes à épaulettes", "les moustaches", "les chaussures"],
  mot: ["génial", "super", "voilà", "bref", "carrément", "franchement", "évidemment", "magnifique", "énorme", "incroyable"],
  nombre: ["trois", "quatre", "cinq"],
  instrument: ["la guitare", "le piano", "la batterie", "le saxophone", "l'harmonica", "le violon", "l'accordéon", "la flûte à bec", "le ukulélé", "la trompette"],
  danse: ["la valse", "le rock", "la salsa", "le slow", "le twist", "le madison", "la chenille", "les claquettes"],
  fois: ["cinq", "dix", "vingt"],
  renverse: ["son café", "le pot à crayons", "la pile de disques", "un verre d'eau", "la plante", "le paquet de biscuits"],
  moment: ["cuisiner", "conduire la nuit", "le dimanche matin", "se réveiller", "travailler", "courir", "ranger", "s'endormir", "fêter une bonne nouvelle", "bouder"],
  choix: ["ne plus jamais manger de fromage", "ne plus jamais manger de chocolat", "avoir toujours trop chaud", "avoir toujours trop froid", "parler toutes les langues", "parler aux animaux", "vivre sans téléphone", "vivre sans chaussures", "être toujours en avance d'une heure", "être toujours en retard de dix minutes", "voler à un mètre du sol", "être invisible seulement quand personne ne regarde", "éternuer des paillettes", "rire comme une porte qui grince", "ne manger que des pâtes", "être annoncé par un crieur à chaque entrée dans une pièce", "être applaudi à chaque sortie", "tout savoir sur un seul sujet", "savoir un peu de tout", "avoir des mains à la place des pieds", "dire tout ce qu'on pense", "ne plus jamais donner son avis", "revivre toujours le même lundi", "sauter tous les week-ends", "avoir un dragon de la taille d'un chat", "avoir un chat de la taille d'un dragon", "ne plus jamais faire la queue", "ne plus jamais chercher ses clés", "avoir une mémoire parfaite", "pouvoir tout oublier à volonté", "vivre dans un phare", "vivre sur une péniche", "se téléporter mais arriver toujours en retard", "voler mais très lentement", "être célèbre pour une chose ridicule", "ne parler qu'en rimes", "ne parler qu'en questions", "connaître la fin de tous les films", "avoir un caillou dans la chaussure pour toujours", "avoir une manche toujours mouillée", "être le meilleur du monde à un jeu que personne ne connaît", "vivre cent ans dans le passé", "vivre cent ans dans le futur", "avoir un robot qui fait le ménage mais commente tout", "ne plus jamais avoir sommeil", "ne plus jamais avoir faim", "prendre le petit-déjeuner à tous les repas", "savoir réparer tout ce qui casse", "ne jamais rien casser", "toujours dire la vérité", "toujours mentir très mal", "lire deux fois plus vite", "tout retenir du premier coup", "ne plus pouvoir s'asseoir", "ne plus pouvoir rester debout", "dormir dans une bibliothèque", "dormir dans une boulangerie", "mettre le monde sur pause cinq minutes par jour", "être suivi partout par un canard affectueux", "être suivi partout par une chèvre jalouse", "avoir un avis sur tout", "ne jamais avoir d'avis sur rien"]
};
// Variantes (2.35) : un petit décalage ajouté au sujet, une fois sur deux (toujours, il deviendrait une habitude).
// duo : la variante demande deux animateurs.
const TOPIC_TWISTS = {
  recit: [{t: "c'est arrivé aujourd'hui même"}, {t: "c'était il y a très longtemps"}, {t: "ça dure depuis une semaine"}, {t: "raconté par celui des deux qui n'y était pas", duo: true}, {t: "chacun a sa version", duo: true}, {t: "l'un des deux découvre l'histoire à l'antenne", duo: true}, {t: "c'est une catastrophe minuscule"}, {t: "c'est devenu une affaire d'État dans le studio"}, {t: "personne d'autre n'a rien remarqué"}, {t: "raconté comme un fait divers"}, {t: "raconté comme une petite annonce"}, {t: "avec un détail absurdement précis"}, {t: "et ce n'est toujours pas réglé"}, {t: "et tout s'est bien fini, à la surprise générale"}],
  avis: [{t: "l'un des deux a changé d'avis depuis la dernière fois", duo: true}, {t: "ils en ont déjà parlé hors antenne", duo: true}, {t: "à trancher en dix secondes"}, {t: "en comptant les points", duo: true}, {t: "avec l'avis de quelqu'un de la station, absent aujourd'hui"}, {t: "d'accord pour une fois, mais pas pour la même raison", duo: true}, {t: "sans jamais dire j'aime ni j'aime pas"}],
  jeu: [{t: "l'un des deux triche un peu", duo: true}, {t: "pris beaucoup trop au sérieux"}, {t: "avec un enjeu dérisoire"}, {t: "ça se retourne contre celui qui l'a lancé", duo: true}, {t: "c'est la revanche d'une fois précédente", duo: true}, {t: "les règles changent en cours de route"}, {t: "personne ne gagne"}, {t: "avec un arbitre imaginaire"}],
  aveu: [{t: "c'est la première fois que c'est dit à l'antenne"}, {t: "l'autre le savait déjà", duo: true}, {t: "avec une précision inattendue"}, {t: "regretté aussitôt dit"}, {t: "l'autre promet de ne jamais le répéter", duo: true}, {t: "raconté comme si c'était très grave"}, {t: "et c'est un peu une fierté, au fond"}],
  adresse: [{t: "à voix basse, comme un secret"}, {t: "très solennellement"}, {t: "avec un faux règlement officiel"}, {t: "en s'y reprenant à deux fois"}, {t: "comme une annonce de gare"}, {t: "avec beaucoup trop de précautions"}],
  rubrique: [{t: "c'est le tout premier numéro"}, {t: "c'est le dernier numéro, faute de succès"}, {t: "présentée par celui des deux qui n'y croit pas", duo: true}, {t: "interrompue avant la fin", duo: true}, {t: "avec un sponsor imaginaire"}, {t: "en version raccourcie, pour cause de retard"}]
};
// Famille de variantes de chaque type de discussion, de chaque famille de papotage et de chaque format de bavardage.
const TWIST_OF = {"chambre": "recit", "debat": "avis", "reaction": "avis", "devinette": "jeu", "auditeur": "adresse", "defi": "jeu", "aveu": "aveu", "coulisses": "recit", "question": "aveu", "quotidien": "recit", "studio": "recit", "soi": "aveu", "jeux": "jeu", "culture": "avis", "entreEux": "recit", "dilemme": "jeu", "minijeu": "jeu", "rubrique": "rubrique", "nouvelles": "recit", "auditeurs": "adresse"};
const TOPIC_LABEL = {"devinette": "Forme imposée cette fois", "lien": "Lien imposé cette fois", "mode_emploi": "Point de la notice imposé cette fois", "defi": "Défi imposé cette fois", "aveu": "Aveu imposé cette fois", "coulisses": "Détail imposé cette fois", "question": "Question imposée cette fois", "teaser": "Forme imposée cette fois"};
// Bavardage et discussions : deux réglages (2.38).
// Le niveau dit quelle part des interventions est une conversation entre les animateurs, à la place du programme,
//   de la chronique ou de la culture courte : jamais, une sur deux, presque toutes, toutes. Jusqu'à la 2.37, seule
//   la culture courte pouvait en devenir une (une intervention sur neuf en « À chaque titre ») : les quinze types
//   de conversation et leurs sujets ne s'entendaient presque jamais avec le programme.
// Le curseur « musique ou bavardage » (chatMix, en %) dit, parmi ces conversations, quelle part est hors musique.
//   Il remplace les anciens poids par niveau et l'écart minimal entre deux bavardages.
// Une conversation se joue toujours à deux quand l'émission a un duo, prend trois à cinq répliques, et revient à la
//   musique d'une façon tirée à chaque fois ; à l'ouverture d'un programme, elle sert d'accroche, puis les titres
//   à venir sont rappelés. L'intro, les invités, les dédicaces, les réponses de jeu, les choix d'animateur et
//   les changements d'ambiance gardent leur forme.
const CHAT_CONV = { off: 0, parfois: 0.5, souvent: 0.85, max: 1 };
// Sujets de bavardage retenus d'une émission à l'autre (sur 260) : aucun ne revient avant une centaine d'autres.
const CHAT_KEEP = 100;
const chatLevel = () => (CHAT_CONV[settings.chat] !== undefined ? settings.chat : 'parfois');
const chatMix = () => { const n = Number(settings.chatMix); return settings.chatMix !== null && settings.chatMix !== '' && Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : 50; };
const chatAlways = () => chatLevel() === 'max';
// Retour à la musique, à la fin d'une conversation. Chacune finit par lancer un titre : sans consigne, l'IA
// revenait presque toujours par le même mot (« Bref, … » cinq fois sur dix au premier essai réel). La façon de
// revenir est donc tirée à chaque fois, jamais une des quatre dernières. duo : il faut être deux.
const CHAT_PIVOTS = [
  { t: "l'un coupe court d'un mot et lance le titre", duo: true },
  { t: "le titre arrive sans aucune transition, au milieu de la conversation, comme si de rien n'était" },
  { t: "celui qui est en train de perdre la discussion lance le titre pour changer de sujet", duo: true },
  { t: "l'un rappelle qu'il y a quand même une émission à faire, et lance le titre", duo: true },
  { t: "le titre suivant sert de chute ou de réponse à ce qui vient d'être dit" },
  { t: "l'un lance le titre pendant que l'autre n'a pas tout à fait fini", duo: true },
  { t: "ils remettent la suite de la conversation à après le titre, et le lancent", duo: true },
  { t: "la question est laissée aux auditeurs, puis le titre est lancé" },
  { t: "un petit temps, puis le titre est lancé très simplement, sans mot de liaison" },
  { t: "c'est celui qui a le moins parlé qui lance le titre, en une phrase", duo: true },
  { t: "le titre est lancé comme une évidence, sur le ton de la conversation, sans changer de voix" },
  { t: "tu t'interromps toi-même, amusé d'être parti si loin, et tu lances le titre", solo: true }
];
function drawPivot(s, solo) {
  const v = s.variety;
  const last = v.pivots || [];
  const ok = CHAT_PIVOTS.filter((x) => (solo ? !x.duo : !x.solo));
  const fresh = ok.filter((x) => !last.includes(x.t));
  const t = pick(fresh.length ? fresh : ok).t;
  v.pivots = last.concat([t]).slice(-4);
  return t;
}
// Le jeu (vrai ou faux) est un type de conversation parmi les autres (2.38). Jusqu'à la 2.36, il avait sa propre
// règle (70 % des programmes, plus l'express) : dans le journal du 28/11, 27 interventions sur 61 portaient un jeu.
// Son poids : celui d'un aveu ou d'une question sur « Parfois », plus du double sur « Souvent ».
const GAME_W = { off: 0, parfois: 2, souvent: 5 };
const gameLevel = () => (GAME_W[settings.games] !== undefined ? settings.games : 'parfois');
// À l'ouverture d'un programme, en « À chaque titre » : la question porte sur le deuxième titre, la réponse tombe
// juste avant lui. Sinon : le vrai ou faux express, question, pari et réponse d'un seul tenant.
const GAME_ANGLE = {
  hook: { duo: "Le jeu en deux temps décrit plus bas (la question maintenant, la réponse plus tard), joué entre eux comme un pari entre amis ; puis les titres à venir.",
    solo: "Le jeu en deux temps décrit plus bas (la question maintenant, la réponse plus tard), posé aux auditeurs ; puis les titres à venir." }
};
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
const OWN_DYNAMIC = new Set(['chambre', 'debat', 'vanne', 'devinette', 'defi', 'verdict']);
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
// Tire le sujet imposé d'un angle, sans reprise dans l'émission ni d'une émission à l'autre. Pour le bavardage,
// les 100 derniers sujets (tous formats) sont écartés ; pour chaque type de discussion musicale, les derniers
// sujets tirés, à hauteur de 70 % de sa liste : une petite liste (8 ou 10 sujets) ne retombe plus sur le même
// sujet deux émissions de suite.
function drawTopic(s, key, list, isChat) {
  const v = s.variety;
  v.topics = v.topics || {};
  airLog.topics = airLog.topics || {};
  const used = v.topics[key] || [];
  const before = isChat ? airLog.chat : (airLog.topics[key] || []);
  const unused = list.filter((x) => !used.includes(x));
  const free = unused.filter((x) => !before.includes(x));
  const topic = pick(free.length ? free : unused.length ? unused : list);
  v.topics[key] = (unused.length ? used : []).concat([topic]);
  if (!s.demo) {
    if (isChat) airLog.chat = airLog.chat.filter((x) => x !== topic).concat([topic]).slice(-CHAT_KEEP);
    else airLog.topics[key] = before.filter((x) => x !== topic).concat([topic]).slice(-Math.max(1, Math.floor(list.length * 0.7)));
    store({ airLog });
  }
  return topic;
}
// Remplit les {cases} d'un sujet. La même case deux fois donne deux valeurs différentes, et une valeur déjà tirée
// dans l'émission ne revient pas tant que la moitié de sa liste n'est pas passée.
function fillSlots(s, text) {
  const v = s.variety;
  v.slots = v.slots || {};
  const here = [];
  return String(text).replace(/\{([a-z_]+)\}/g, (m, name) => {
    const list = TOPIC_SLOTS[name];
    if (!list) return '';
    const recent = v.slots[name] || [];
    const free = list.filter((x) => !here.includes(x) && !recent.includes(x));
    const val = pick(free.length ? free : list.filter((x) => !here.includes(x)));
    here.push(val);
    v.slots[name] = recent.concat([val]).slice(-Math.floor(list.length / 2));
    return val;
  });
}
// Une variante, une fois sur deux, dans la famille du sujet ; jamais une des quatre dernières de l'émission.
function drawTwist(s, family, solo) {
  const list = (TOPIC_TWISTS[TWIST_OF[family]] || []).filter((x) => !(solo && x.duo));
  if (!list.length || Math.random() >= 0.5) return '';
  const v = s.variety;
  const recent = v.twists || [];
  const free = list.filter((x) => !recent.includes(x.t));
  const tw = pick(free.length ? free : list).t;
  v.twists = recent.concat([tw]).slice(-4);
  return tw;
}
const twistText = (tw) => (tw ? ' Variante de cette fois : ' + tw + '.' : '');
function chatAngle(s, angle, kind) {
  const v = s.variety;
  const solo = !!angle.solo;
  const last = v.chatFormats || [];
  const ok = (f) => !(f.duoOnly && solo) && !(f.long && kind === 'talkover') && !(f.lore && (loreLevel() === 'off' || aiPower() === 'eco' || s.demo));
  const pool = CHAT_FORMATS.filter((f) => ok(f) && !last.includes(f.id));
  const use = pool.length ? pool : CHAT_FORMATS.filter(ok);
  let r = Math.random() * use.reduce((n, f) => n + f.w, 0);
  const fmt = use.find((f) => (r -= f.w) <= 0) || use[0];
  v.chatFormats = [fmt.id];
  // Un « tu préfères » sur deux est inédit : deux moitiés tirées au hasard parmi 62.
  const base = fmt.id === 'dilemme' && Math.random() < 0.5 ? '{choix}, ou {choix}'
    : drawTopic(s, 'bavardage', fmt.id === 'papotage' ? (solo ? CHAT_SOLO : CHAT_DUO) : CHAT_POOL[fmt.id], true);
  const topic = fillSlots(s, base);
  // Le papotage prend les variantes de la famille du sujet (le quotidien, le studio, eux-mêmes…).
  const family = fmt.id === 'papotage' ? Object.keys(CHAT_TOPICS).find((k) => CHAT_TOPICS[k].includes(base)) : fmt.id;
  const twist = drawTwist(s, family, solo);
  return Object.assign({}, angle, { format: fmt.id, lore: fmt.lore ? 'focus' : '', base, topic, twist, txt: (solo ? fmt.solo : fmt.duo) + ' ' + topic + '.' + twistText(twist) });
}
// solo : un seul animateur parle (pas de variante qui en demande deux).
function withTopic(s, angle, kind, solo) {
  if (angle && angle.id === 'bavardage') return chatAngle(s, angle, kind);
  const list = angle && ANGLE_TOPICS[angle.id];
  if (!list) return angle;
  const base = drawTopic(s, angle.id, list, false);
  const topic = fillSlots(s, base);
  const twist = drawTwist(s, angle.id, solo);
  return Object.assign({}, angle, { base, topic, twist, txt: angle.txt + ' ' + (TOPIC_LABEL[angle.id] || 'Sujet imposé cette fois') + ' : ' + topic + ' (déjà utilisé dans l\'émission, il ne doit pas revenir).' + twistText(twist) });
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
// 2.35 : sept types de discussion de plus dans la liste ; les poids des anecdotes sont relevés d'autant, pour que
// « Souvent » reste environ une intervention sur quatre et « Très souvent » une sur deux.
const ANECDOTE_WEIGHT = { rare: 0.35, souvent: 2.6, max: 7 };
// Le bavardage n'a pas de poids : sa part est fixée par le curseur « musique ou bavardage » (planAnnouncement).
const angleWeight = (a) => (/^anecdote/.test(a.id) ? (ANECDOTE_WEIGHT[settings.anecdotes] || 3) * (a.share || 1) * (a.norm || 1) : a.id === 'bavardage' ? 0 : a.game ? GAME_W[gameLevel()] : a.w);
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

// Une autre conversation autour de la musique, sans fiche nécessaire : pour remplacer le jeu quand aucune fiche
// fiable ne permet de le poser.
function otherAngle(s, kind, duo, prev) {
  const lines = (s.lastLines || []).slice(-6);
  const list = (duo ? ANGLES_DUO : ANGLES_SOLO).filter((a) => !a.game && !a.facts && a.id !== 'bavardage' && (!a.history || lines.length >= 2) && (!a.prev || !!prev));
  return withTopic(s, pickAngle(list, ((s.variety && s.variety.angles) || []).slice(-3), () => true), kind, !duo);
}
// noFree : cette intervention a déjà sa structure (invité au micro, dédicace, réponse d'un jeu, choix d'un animateur).
function planAnnouncement(s, kind, prev, next, atMs, role, progLen, noFree) {
  const now = atMs || Date.now();
  const v = s.variety || (s.variety = { angles: [], timeAt: 0, weatherAt: 0, stationAt: 0, momentAt: 0 });
  const lines = (s.lastLines || []).slice(-6);
  const duoOn = settings.voiceEngine === 'gemini' && hasGemini && settings.duo;
  // Exemple « bavardage » des Réglages : toujours un moment de bavardage, quel que soit le réglage.
  const demoChat = s.demo === 'bavardage';
  // Conversation à la place de la forme habituelle du créneau (programme, chronique, culture courte, annonce) :
  // tirée à chaque intervention, selon le niveau. Jamais pour l'intro, ni quand l'intervention a déjà sa structure.
  const free = demoChat || !!(kind !== 'intro' && !noFree && !s.demo && !changeFor(s, next) && Math.random() < CHAT_CONV[chatLevel()]);
  // Une conversation se joue à deux, même par-dessus le fondu, où un seul animateur parle d'habitude six fois sur dix.
  const duo = duoOn && (kind !== 'talkover' || free || Math.random() < 0.4);
  // Le jeu : il faut une IA pour l'écrire, et pas de jeu déjà en attente de sa réponse.
  const gameCan = !!(settings.claudeAnnounce && hasKey && !s.demo && !s.hook);
  const okA = (a) => (!a.history || lines.length >= 2) && (a.facts !== 'prev' || !!prev) && (a.facts !== 'both' || !!prev) && (!a.year || !!(next && next.year)) && (!a.prev || !!prev) &&
    (!a.game || gameCan);
  const list = duo ? ANGLES_DUO : ANGLES_SOLO;
  // Autour de la musique : les types de conversation, les anecdotes (selon leur réglage) et le jeu (selon le sien).
  const music = list.filter((a) => a.id !== 'bavardage');
  const recent = v.angles.slice(-3);
  // Hors musique : la part fixée par le curseur, parmi les conversations.
  const offMusic = demoChat || (free && Math.random() * 100 < chatMix());
  let angle;
  if (offMusic) angle = list.find((a) => a.id === 'bavardage');
  else if (free) angle = pickAngle(music, recent, okA);
  else if (role === 'programme' && progLen >= 2) angle = { id: 'programme', txt: duo ? PROGRAMME_ANGLE.duo : PROGRAMME_ANGLE.solo };
  else if (role === 'chronique') angle = pickAngle(list.filter(isAnecdote), recent, okA, (a) => a.share || 1);
  else if (role === 'culture') angle = pickAngle(list.filter(isAnecdote), recent, okA, (a) => CULTURE_W[a.id] || 0.6);
  else angle = kind === 'intro' ? null : pickAngle(music, recent, okA);
  angle = withTopic(s, angle, kind, !duo);
  const min = 60000;
  const plan = {
    duo, angle,
    sayTime: kind === 'intro' || (kind === 'interlude' && now - v.timeAt > 15 * min) || (kind === 'talkover' && now - v.timeAt > 40 * min && Math.random() < 0.3),
    sayWeather: kind === 'interlude' && now - v.weatherAt > 35 * min,
    sayStation: kind === 'intro' || (kind === 'interlude' && now - v.stationAt > 12 * min) || (kind === 'talkover' && now - v.stationAt > 25 * min && Math.random() < 0.3),
    momentOk: kind === 'intro' || (now - v.momentAt > 15 * min && Math.random() < 0.35),
    yearOk: Math.random() < 0.25,
    turns: duo ? (kind === 'talkover' ? (free ? pick([3, 3, 4]) : 2) : pick(kind === 'intro' ? [2, 3] : free ? [3, 4, 4, 5, 5] : [2, 3, 3, 4, 4, 5])) : 0,
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
  // Conversation à l'ouverture d'un programme : une réplique de plus, pour le rappel des titres à venir.
  if (free && duo && role === 'programme' && progLen >= 2) plan.turns = Math.max(plan.turns, 4);
  if (free) plan.pivot = drawPivot(s, !duo);
  // Un mini-jeu ou un dilemme demande au moins quatre répliques.
  if (duo && angle && (angle.format === 'minijeu' || angle.format === 'dilemme') && kind !== 'talkover') plan.turns = Math.max(plan.turns, 4);
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

const progKeysFor = (s, t) => (roleFor(s, t) === 'programme' ? programmeOf(s, t).map((x) => x.key).join('|') : '');

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
