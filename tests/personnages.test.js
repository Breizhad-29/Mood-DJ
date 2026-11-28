'use strict';
// 2.41 : Camille et Arthur, deux personnages de l'univers du duo Jeff & Laeti, passent au micro sur le créneau
// des invités. Fiches tirées du Codex de l'auteur (rien de l'intrigue), Camille souvent, Arthur rare.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadPanel, loadBackground } = require('./helpers');

const DUO = "Object.assign(settings, PRESET_JEFF_LAETI, { radio: true, claudeAnnounce: true, voiceEngine: 'gemini', guestFreq: 'rare', hostPicks: 'off', castGuests: true }); hasGemini = true; hasGemini1 = true; hasKey = true; learn.guests = {};";

test('personnages : seulement avec le duo Jeff & Laeti, et seulement si l’auditeur ne les a pas coupés', () => {
  const p = loadPanel();
  p.run(DUO);
  assert.equal(p.run('isJeffLaeti()'), true);
  assert.equal(p.run('castOn()'), true);
  // Les deux animateurs inversés : c'est toujours le duo.
  p.run("Object.assign(settings, { hostName: 'Laeti', cohostName: 'Jeff', hostPersona: PRESET_JEFF_LAETI.cohostPersona, cohostPersona: PRESET_JEFF_LAETI.hostPersona });");
  assert.equal(p.run('isJeffLaeti()'), true);
  // Un autre duo, ou deux animateurs qui portent seulement leurs prénoms : pas de personnages.
  p.run("settings.hostName = 'Alex';");
  assert.equal(p.run('castOn()'), false);
  p.run("Object.assign(settings, { hostName: 'Jeff', cohostName: 'Laeti', hostPersona: 'Un fan de rock.', cohostPersona: 'Une fan de jazz.' });");
  assert.equal(p.run('isJeffLaeti()'), false);
  p.run(DUO + 'settings.castGuests = false;');
  assert.equal(p.run('castOn()'), false);
  assert.equal(p.run('castPick({})'), null);
});

test('personnages : fiches sans rien de l’intrigue du roman, voix choisies par l’auteur', () => {
  const p = loadPanel();
  const cast = JSON.parse(JSON.stringify(p.run('CAST_JEFF_LAETI')));
  assert.deepEqual(cast.map((c) => [c.name, c.gender, c.voice]), [['Camille', 'femme', 'Laomedeia'], ['Arthur', 'homme', 'Schedar']]);
  const voices = new Set([...p.run('GEMINI_VOICES.map((v) => v[0] + "|" + v[1])')]);
  for (const c of cast) assert.ok(voices.has(c.voice + '|' + c.gender), c.voice);
  const all = cast.map((c) => c.fiche + ' ' + c.role).join('\n');
  // Ce qu'un auditeur peut savoir : le bar, le lieu, le métier, le caractère.
  assert.match(cast[0].fiche, /Serveuse au Ty Loup, le bar de Locronan/);
  assert.match(cast[0].fiche, /comptoir en bois/);
  assert.match(cast[1].fiche, /pièces de travaux publics à Douarnenez/);
  assert.match(cast[1].fiche, /Il ne dit rien de plus sur lui/);
  // Rien de l'intrigue : ni l'origine, ni la bataille, ni les noms d'ailleurs, ni l'âge véritable.
  // (Le seul clin d'œil : les vieux pulps que Jeff et Arthur aiment tous les deux.)
  assert.doesNotMatch(all.replace('pulps d’extraterrestres', ''), /extraterrestre|alien|vaisseau|Bataille|Paris|On'morn|Aryel|Nelya|Sterenn|Fanch|Lina|Alinay|Gwaen|Empire|immortel|432|Très Secret|couverture|ancien amour|amoureu/i);
  assert.doesNotMatch(all, /zinc/i, 'le comptoir du Ty Loup est en bois');
  // L'univers du duo les mentionne, pour que les animateurs puissent parler d'eux hors de leurs visites.
  assert.match(p.run('PRESET_JEFF_LAETI.stationLore'), /Camille, la serveuse du Ty Loup, le bar de Locronan/);
  assert.match(p.run('PRESET_JEFF_LAETI.stationLore'), /Arthur, un habitué du Ty Loup, plus rare/);
});

test('personnages : Camille vient souvent, Arthur rarement, une seule visite par émission, et Arthur jamais deux jours de suite', () => {
  const p = loadPanel();
  p.run(DUO + "var __n = { none: 0 }; for (var i = 0; i < 3000; i++) { var c = castPick({}); var k = c ? c.name : 'none'; __n[k] = (__n[k] || 0) + 1; }");
  const n = JSON.parse(JSON.stringify(p.run('__n')));
  assert.ok(n.none > 1050 && n.none < 1350, 'quatre passages sur dix restent à un spécialiste : ' + n.none);
  assert.ok(n.Camille > 1350 && n.Camille < 1650, 'Camille : ' + n.Camille);
  assert.ok(n.Arthur > 220 && n.Arthur < 380, 'Arthur, une fois sur dix environ : ' + n.Arthur);
  // Déjà venue dans cette émission : elle ne revient pas, et Arthur garde sa (petite) chance.
  p.run("var __m = {}; for (var i = 0; i < 600; i++) { var c = castPick({ castSeen: ['perso:camille'] }); var k = c ? c.name : 'none'; __m[k] = (__m[k] || 0) + 1; }");
  const m = JSON.parse(JSON.stringify(p.run('__m')));
  assert.equal(m.Camille, undefined);
  assert.ok(m.Arthur > 300);
  // Arthur est passé il y a trois heures : pas avant demain.
  p.run("learn.guests['perso:arthur'] = { name: 'Arthur', visits: 1, last: Date.now() - 3 * 3600e3 }; var __a = 0; for (var i = 0; i < 600; i++) { var c = castPick({}); if (c && c.name === 'Arthur') __a++; }");
  assert.equal(p.run('__a'), 0);
  p.run("learn.guests['perso:arthur'].last = Date.now() - 30 * 3600e3; __a = 0; for (var i = 0; i < 600; i++) { var c = castPick({}); if (c && c.name === 'Arthur') __a++; }");
  assert.ok(p.run('__a') > 20);
});

test('personnages : le passage complet, de l’annonce au départ, et Arthur qui reste peu', () => {
  const p = loadPanel();
  p.run(DUO + "radioLog = () => {};" +
    "var __pick = castPick; castPick = () => CAST_JEFF_LAETI[0];" +
    "var __s = { startedAt: Date.now() - 3600e3, guestNextAt: Date.now() - 1000, queue: [], played: [] }; var __next = { key: 'n', title: 'T', artist: 'A', style: 'rock' };");
  assert.equal(p.run('guestPhaseFor(__s, __next)'), 'annonce');
  const g = JSON.parse(JSON.stringify(p.run('__s.guest')));
  assert.equal(g.name, 'Camille');
  assert.equal(g.cast, 'perso:camille');
  assert.equal(g.voice, 'Laomedeia');
  assert.ok(g.passages === 1 || g.passages === 2);
  assert.deepEqual([...p.run('__s.castSeen')], ['perso:camille']);
  const phases = ['annonce'];
  for (let i = 0; i < 6 && p.run('!!__s.guest'); i++) { p.run('guestAdvance(__s, __s.guest.phase)'); phases.push(p.run('__s.guest ? __s.guest.phase : "partie"')); }
  assert.deepEqual(phases.slice(0, 2), ['annonce', 'arrivee']);
  assert.equal(phases[phases.length - 2], 'depart');
  assert.equal(phases[phases.length - 1], 'partie');
  assert.equal(p.run("learn.guests['perso:camille'].visits"), 1);
  assert.ok(p.run("learn.guests['perso:camille'].last") > 0);
  // Arthur : l'arrivée, parfois un passage, puis le départ. Jamais deux passages.
  const pass = new Set();
  for (let i = 0; i < 40; i++) pass.add(p.run('castGuest(CAST_JEFF_LAETI[1], "annonce").passages'));
  assert.deepEqual([...pass].sort(), [0, 1]);
  assert.equal(p.run('castGuest(CAST_JEFF_LAETI[1], "annonce").voice'), 'Schedar');
  // La voix choisie par l'auditeur pour ce prénom passe avant, et jamais la même voix que l'animateur qui reste.
  p.run("settings.guestVoices = { Camille: 'Kore' };");
  assert.equal(p.run('castGuest(CAST_JEFF_LAETI[0], "annonce").voice'), 'Kore');
  p.run("settings.guestVoices = {}; settings.geminiVoice = 'Schedar';");
  assert.notEqual(p.run('castGuest(CAST_JEFF_LAETI[1], "annonce").voice'), 'Schedar');
});

test('personnages : au micro, une conversation à leur façon (pas de fiche du titre), avec leur voix et leur fiche', async () => {
  const p = loadPanel();
  p.run("var __pay = null; var __tts = null; var __facts = 0;" +
    "claude = async (action, payload) => { if (action === 'announce') { __pay = payload; return 'A: Tiens, Camille, t’as fermé le bar pour venir nous voir ?\\nB: Le bar tourne très bien sans moi, figure-toi, c’est même ça le problème.'; } if (action === 'gemini-tts') { __tts = payload; return { b64: '' }; } return {}; };" +
    "factsFor = async () => { __facts++; return { text: 'fiche du titre', src: 'wiki' }; }; genreFacts = async () => null; weatherLine = async () => '';" +
    DUO + "Object.assign(settings, { radioFreq: 'every', programme: true, rhythm: 'regulier', chat: 'off' });" +
    "var __t = (k) => ({ key: k, title: 'Titre ' + k, artist: 'Artiste ' + k, energy: 3, style: 'rock' });" +
    "var __mk = (phase, who) => ({ id: 's1', sel: clone(DEFAULT_SEL), queue: ['b', 'c', 'd'].map(__t), played: [], lastLines: [], startedAt: Date.now(), transitions: 3, programme: { keys: ['a', 'b', 'c'], at: 0 }, guest: castGuest(CAST_JEFF_LAETI[who], phase) });");
  // Arrivée de Camille, sur le créneau de la chronique : pas d'anecdote, pas de fiche cherchée, plus de « chronique ».
  p.run("var __s = __mk('arrivee', 0);");
  await p.run("prepareAnnouncement(__s, 'interlude', __t('a'), __s.queue[0], Date.now() + 6e4)");
  const pay = JSON.parse(JSON.stringify(p.run('__pay')));
  assert.equal(p.run('__facts'), 0, 'aucune fiche du titre pour un personnage');
  assert.equal(pay.facts, '');
  assert.equal(pay.role, null);
  assert.equal(pay.duo, true);
  assert.equal(pay.guest.cast, true);
  assert.equal(pay.guest.name, 'Camille');
  assert.equal(pay.guest.away, 'Laeti');
  assert.match(pay.guest.fiche, /Serveuse au Ty Loup/);
  assert.match(pay.angle, /Un personnage de l'univers de la station arrive au micro/);
  assert.ok(pay.turns >= 4);
  assert.ok(pay.pivot, 'un retour à la musique tiré, comme pour toute conversation');
  // Seule la fiche de l'animateur qui reste est envoyée (l'autre s'est éclipsé).
  assert.match(pay.persona.a, /^Jeff \(nom complet/);
  assert.ok(!pay.persona.b);
  // La voix : celle de Camille, avec sa direction à elle.
  const tts = JSON.parse(JSON.stringify(p.run('__tts')));
  assert.equal(tts.voiceB, 'Laomedeia');
  assert.match(tts.turns.find((t) => t.speaker === 'B').style, /lively barmaid of a village bar in Brittany/);
  assert.doesNotMatch(tts.turns.find((t) => t.speaker === 'B').style, /guest expert/);
  // Passage d'Arthur : une conversation autour de la musique qui n'a pas besoin de fiche, jouée avec lui.
  p.run("__pay = null; __s = __mk('passage', 1);");
  await p.run("prepareAnnouncement(__s, 'talkover', __t('a'), __s.queue[0], Date.now() + 6e4, { voice: 'later' })");
  const pay2 = JSON.parse(JSON.stringify(p.run('__pay')));
  assert.match(pay2.angle, /^Le personnage est toujours au micro avec A\. Ils font la conversation suivante/);
  assert.ok(pay2.angle.length > 160, 'un vrai sujet de conversation suit');
  assert.doesNotMatch(pay2.angle, /d'après les fiches|histoire vraie/);
  assert.equal(pay2.guest.name, 'Arthur');
  assert.equal(p.run('__facts'), 0);
  // À l'ouverture d'un programme, le programme garde sa forme, avec le personnage.
  p.run("__pay = null; __s = __mk('passage', 0); __s.programme = { keys: ['x'], at: 0 };");
  await p.run("prepareAnnouncement(__s, 'talkover', __t('a'), __s.queue[0], Date.now() + 6e4, { voice: 'later' })");
  const pay3 = JSON.parse(JSON.stringify(p.run('__pay')));
  assert.ok(Array.isArray(pay3.programme) && pay3.programme.length >= 2);
  assert.match(pay3.angle, /programme des prochaines minutes/);
  assert.match(pay3.angle, /Le personnage est toujours au micro avec A/);
});

test('consignes : un personnage parle avec son caractère, n’affirme rien sur la musique, et rien ne s’invente sur sa vie', async () => {
  const bg = loadBackground();
  const ask = async (phase, extra) => {
    bg.__calls.length = 0;
    await bg.run('writeAnnouncement(' + JSON.stringify(Object.assign({ kind: 'interlude', host: 'Jeff', cohost: 'Laeti', duo: true, turns: 4, next: 'X de Y',
      guest: { phase, name: 'Camille', gender: 'femme', role: 'la serveuse du Ty Loup, le bar de Locronan', away: 'Laeti', visits: 0, cast: true, fiche: 'Serveuse au Ty Loup depuis huit ans. Humour franc.' } }, extra || {})) + ')');
    return bg.__calls[0].body.messages[0].content;
  };
  const soon = await ask('annonce');
  assert.match(soon, /PERSONNAGE À VENIR : glisse que dans quelques minutes, Camille, la serveuse du Ty Loup, le bar de Locronan, passe au micro/);
  assert.match(soon, /sans la faire parler : elle n'est pas encore là/);
  const here = await ask('arrivee');
  assert.match(here, /PERSONNAGE AU MICRO : pour ce passage, B n'est pas Laeti : B = Camille, une femme/);
  assert.match(here, /Fiche de Camille : Serveuse au Ty Loup depuis huit ans\./);
  assert.match(here, /Camille n'est pas spécialiste de musique : elle parle avec son caractère et son métier, sans rien affirmer sur un artiste ou un morceau/);
  assert.match(here, /N'invente rien sur sa vie au-delà de sa fiche, et ne la fais jamais révéler ce qu'elle garde pour elle/);
  assert.doesNotMatch(here, /regard d'expert|INVITÉ|spécialiste, mais/);
  assert.match(await ask('passage'), /PERSONNAGE AU MICRO : B = Camille, la serveuse du Ty Loup, le bar de Locronan, toujours au micro à la place de Laeti/);
  const bye = await ask('depart');
  assert.match(bye, /DÉPART DU PERSONNAGE : dernière intervention de Camille \(B\)/);
  assert.match(bye, /c'est Camille qui lance le titre suivant avant de filer\. Laeti reviendra à la prochaine intervention/);
  // Un spécialiste invité garde ses consignes d'avant.
  bg.__calls.length = 0;
  await bg.run("writeAnnouncement({ kind: 'interlude', host: 'Jeff', cohost: 'Laeti', duo: true, turns: 4, next: 'X de Y', guest: { phase: 'arrivee', name: 'Tom', gender: 'homme', role: 'spécialiste rock, ancien disquaire', away: 'Laeti', visits: 0 } })");
  assert.match(bg.__calls[0].body.messages[0].content, /ARRIVÉE DE L'INVITÉ/);
  assert.doesNotMatch(bg.__calls[0].body.messages[0].content, /PERSONNAGE/);
});

test('mise à jour du duo (2.41) : « cheffe », « Annaëlle », Camille et Arthur dans l’univers ; une fiche retouchée n’est pas écrasée', () => {
  const p = loadPanel();
  // Les textes des versions 2.35 à 2.40, reconstitués : leurs empreintes sont reconnues.
  p.run("var __toasts = []; toast = (m) => { __toasts.push(String(m)); }; render = () => {}; hostProfiles = []; loreProfiles = []; hostMemory = { A: [], B: [], L: [] };" +
    "var __oldHost = PRESET_JEFF_LAETI.hostPersona.replace('Cheffe, c’est le titre', 'Chef, c’est le titre');" +
    "var __oldLore = PRESET_JEFF_LAETI.stationLore.replace('appelle cheffe', 'appelle chef').replace('sale mine, cheffe', 'sale mine, chef').replace('Annaëlle', 'Annaelle').replace(/ Deux autres passent parfois au micro.*$/, '');");
  assert.equal(p.run('PRESET_OLD_PRINTS[textPrint(__oldHost)]'), 'hostPersona');
  assert.equal(p.run('PRESET_OLD_PRINTS[textPrint(__oldLore)]'), 'stationLore');
  p.run("Object.assign(settings, PRESET_JEFF_LAETI, { hostPersona: __oldHost, stationLore: __oldLore, presetRev: 2, geminiVoice: 'Puck' }); migratePreset();");
  assert.equal(p.run('settings.hostPersona'), p.run('PRESET_JEFF_LAETI.hostPersona'));
  assert.equal(p.run('settings.stationLore'), p.run('PRESET_JEFF_LAETI.stationLore'));
  assert.equal(p.run('settings.geminiVoice'), 'Puck');
  assert.equal(p.run('settings.presetRev'), 3);
  assert.ok([...p.run('__toasts')].some((t) => /Camille, la serveuse du Ty Loup, et plus rarement Arthur/.test(t)));
  // Univers retouché par l'auteur : laissé tel quel, mais les personnages sont annoncés quand même.
  p.run("__toasts = []; Object.assign(settings, PRESET_JEFF_LAETI, { stationLore: __oldLore + ' Et un chat, Larsen.', presetRev: 2 }); migratePreset();");
  assert.match(p.run('settings.stationLore'), /Et un chat, Larsen\.$/);
  assert.ok([...p.run('__toasts')].some((t) => /Camille/.test(t)));
  // Un autre duo : rien n'est annoncé.
  p.run("__toasts = []; Object.assign(settings, { hostName: 'Alex', cohostName: 'Sam', hostPersona: 'x', cohostPersona: 'y', presetRev: 2 }); migratePreset();");
  assert.equal(p.run('__toasts.length'), 0);
  // Une installation neuve qui charge le duo ne reçoit pas le message (elle a déjà tout).
  p.run("__toasts = []; Object.assign(settings, PRESET_JEFF_LAETI, { presetRev: 0 }); migratePreset();");
  assert.equal([...p.run('__toasts')].filter((t) => /Camille/.test(t)).length, 0);
});
