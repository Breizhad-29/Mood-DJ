'use strict';
// 2.37 : le bavardage à la place des annonces (« Tout le temps »), les jeux espacés, et deux correctifs tirés du
// journal du 28/11 : l'annonce préparée reprise après l'ouverture d'un programme, et une annonce retenue dans
// « les dernières interventions » seulement quand elle passe à l'antenne.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadPanel, loadBackground } = require('./helpers');

const DUO = "Object.assign(settings, { radio: true, programme: true, voiceEngine: 'gemini', duo: true, hostName: 'Laeti', cohostName: 'Jeff', loreLevel: 'off' }); hasGemini = true; hasGemini1 = true; hasKey = true;";

test('« Tout le temps » : chaque intervention est une conversation, à deux même sur le fondu, surtout hors musique', () => {
  const p = loadPanel();
  p.run(DUO + "Object.assign(settings, { chat: 'max', radioFreq: 'every', anecdotes: 'souvent' }); var __s = { lastLines: [], played: [], queue: [] }; var __out = [];" +
    "var __roles = ['programme', 'chronique', 'culture'];" +
    "for (var i = 0; i < 600; i++) { var r = __roles[i % 3]; var k = r === 'chronique' ? 'interlude' : 'talkover';" +
    "  var pl = planAnnouncement(__s, k, { title: 'A', artist: 'B' }, { title: 'C', artist: 'D', key: 'k' + i }, 1e12 + i * 2e5, r, r === 'programme' ? 3 : 0, false);" +
    "  __out.push([r, k, pl.free, pl.chatty, pl.duo, pl.turns, pl.angle.id, pl.angle.format || ''].join('|')); }");
  const rows = [...p.run('__out')].map((x) => x.split('|'));
  assert.ok(rows.every((r) => r[2] === 'true' && r[3] === 'true'), 'toutes libres');
  assert.ok(rows.every((r) => r[4] === 'true'), 'toujours à deux, même par-dessus le fondu');
  assert.ok(rows.every((r) => r[6] !== 'programme'), 'plus de programme détaillé');
  const chat = rows.filter((r) => r[6] === 'bavardage').length;
  assert.ok(chat > 360 && chat < 480, 'environ sept sur dix hors musique : ' + chat + ' sur 600');
  // Le reste : d'autres conversations (chambrage, défi, aveu…) et quelques anecdotes, jamais la même deux fois de suite.
  const others = rows.filter((r) => r[6] !== 'bavardage').map((r) => r[6]);
  assert.ok(new Set(others).size >= 12, 'types variés : ' + new Set(others).size);
  assert.ok(others.some((x) => /^anecdote/.test(x)), 'les anecdotes gardent une place');
  // Sur le fondu : trois ou quatre répliques (deux d'habitude) ; quatre au moins quand il y a des titres à rappeler.
  assert.ok(rows.filter((r) => r[1] === 'talkover').every((r) => Number(r[5]) >= 3));
  assert.ok(rows.filter((r) => r[0] === 'programme').every((r) => Number(r[5]) >= 4));
  // Les six formats de bavardage tournent, et jamais le même deux fois de suite.
  const fm = rows.filter((r) => r[6] === 'bavardage').map((r) => r[7]);
  assert.ok(new Set(fm).size >= 4, [...new Set(fm)].join(', '));
  for (let i = 1; i < fm.length; i++) assert.notEqual(fm[i], fm[i - 1]);
});

test('« Tout le temps » : l’intro, l’invité, la dédicace et le changement d’ambiance gardent leur forme ; un seul animateur bavarde aussi', () => {
  const p = loadPanel();
  p.run(DUO + "Object.assign(settings, { chat: 'max', radioFreq: 'third' }); var __s = { lastLines: [], played: [], queue: [] };");
  assert.equal(p.run("planAnnouncement(__s, 'intro', null, { title: 'C', artist: 'D', key: 'a' }, 1e12, 'programme', 3, false).free"), false);
  assert.equal(p.run("planAnnouncement(__s, 'talkover', null, { title: 'C', artist: 'D', key: 'b' }, 1e12, 'programme', 3, true).free"), false, 'invité, dédicace, réponse de jeu, choix d’animateur');
  assert.equal(p.run("planAnnouncement(Object.assign({}, __s, { ambianceChange: { done: false, locked: [], from: 'x', to: 'y' } }), 'talkover', null, { title: 'C', artist: 'D', key: 'c' }, 1e12, 'programme', 3, false).free"), false);
  // Hors programme aussi (programme coupé) : une conversation.
  assert.equal(p.run("planAnnouncement(__s, 'talkover', { title: 'A', artist: 'B' }, { title: 'C', artist: 'D', key: 'd' }, 1e12, null, 0, false).chatty"), true);
  // Un seul animateur (voix de l'ordinateur) : il bavarde seul, avec les sujets qui ne demandent pas d'être deux.
  p.run("settings.voiceEngine = 'systeme'; var __solo = []; for (var i = 0; i < 80; i++) { var pl = planAnnouncement(__s, 'talkover', { title: 'A', artist: 'B' }, { title: 'C', artist: 'D', key: 's' + i }, 1e12 + i * 1e5, 'programme', 3, false); __solo.push(pl.duo + '|' + pl.chatty + '|' + (pl.angle.format || pl.angle.id)); }");
  const solo = [...p.run('__solo')];
  assert.ok(solo.every((x) => x.startsWith('false|true|')));
  assert.ok(!solo.some((x) => x.endsWith('|minijeu')), 'pas de mini-jeu à un seul');
  // Les autres niveaux n'ont pas changé : sur « Souvent », une sur deux, et un seul animateur six fois sur dix sur le fondu.
  p.run(DUO + "settings.chat = 'souvent'; var __n = 0, __d = 0; var __s3 = { lastLines: [], played: [], queue: [] }; for (var i = 0; i < 200; i++) { var pl = planAnnouncement(__s3, 'talkover', null, { title: 'C', artist: 'D', key: 'o' + i }, 1e12 + i * 6e5, 'programme', 3, false); if (pl.free) __n++; if (pl.chatty) __d++; }");
  assert.equal(p.run('__n'), 100);
  assert.equal(p.run('__d'), 0);
});

test('exemple « bavardage » des Réglages : toujours un bavardage, même si le réglage est sur « Jamais »', () => {
  const p = loadPanel();
  p.run(DUO + "settings.chat = 'off'; var __pl = planAnnouncement({ lastLines: [], played: [], queue: [], demo: 'bavardage' }, 'interlude', { title: 'A', artist: 'B' }, { title: 'C', artist: 'D', key: 'x' }, 1e12, 'programme', 1, false);");
  assert.equal(p.run('__pl.angle.id'), 'bavardage');
  assert.equal(p.run('__pl.duo'), true);
  assert.notEqual(p.run('__pl.angle.format'), 'nouvelles', 'pas de format « univers » sans l’univers');
  assert.match(p.run('__pl.angle.txt'), /lance(nt)? le titre suivant/);
});

test('consignes du mode bavardage : le ton, le rappel des titres à venir, des longueurs qui laissent la place de parler', async () => {
  const bg = loadBackground();
  const sys = async (payload) => {
    bg.__calls.length = 0;
    await bg.run('writeAnnouncement(' + JSON.stringify(payload) + ')');
    const b = bg.__calls[0].body;
    return { all: b.system.map((x) => x.text).join('\n') + '\n' + b.messages.map((m) => (typeof m.content === 'string' ? m.content : JSON.stringify(m.content))).join('\n'), stable: b.system[0].text };
  };
  const base = { host: 'Laeti', cohost: 'Jeff', duo: true, turns: 4, next: 'Unhappy de The Salads', prev: 'Catch de Brett Young', angle: 'Un moment de bavardage, hors musique.' };
  const chat = await sys(Object.assign({ kind: 'talkover', chatMode: true, upcoming: ['Unhappy de The Salads', 'Love You Anyway de Luke Combs', 'Gay Bar de Electric Six'] }, base));
  assert.match(chat.all, /MODE BAVARDAGE : dans cette émission, les animateurs passent leur temps à déconner entre eux/);
  assert.match(chat.all, /TITRES À VENIR, dans cet ordre : 1\. Unhappy de The Salads \(il démarre tout de suite\) ; 2\. Love You Anyway de Luke Combs ; 3\. Gay Bar de Electric Six\./);
  assert.match(chat.all, /À la fin seulement, l'un des deux les rappelle tous dans cet ordre, chacun avec son titre et son artiste/);
  // 55 mots pour la conversation, 8 par titre à rappeler.
  assert.match(chat.all, /Écris 4 répliques, 79 mots au plus au total/);
  assert.doesNotMatch(chat.all, /PROGRAMME DES PROCHAINES MINUTES/);
  // Un seul titre à lancer : plus de place qu'une annonce (35 mots), sans rappel.
  const one = await sys(Object.assign({ kind: 'talkover', chatMode: true }, base, { turns: 3 }));
  assert.match(one.all, /Écris 3 répliques, 55 mots au plus au total/);
  assert.doesNotMatch(one.all, /TITRES À VENIR/);
  // Sans le mode : rien de tout ça, et la partie fixe des consignes (le cache) est la même dans les deux cas.
  const plain = await sys(Object.assign({ kind: 'talkover' }, base, { turns: 2 }));
  assert.doesNotMatch(plain.all, /MODE BAVARDAGE|TITRES À VENIR/);
  assert.match(plain.all, /Écris 2 répliques, 35 mots au plus au total/);
  assert.equal(plain.stable, chat.stable);
  // Un seul animateur : il rappelle lui-même les titres.
  const solo = await sys({ kind: 'talkover', host: 'Alex', chatMode: true, next: 'X de Y', angle: 'Un mot de bavardage.', upcoming: ['X de Y', 'Z de W'] });
  assert.match(solo.all, /tu bavardes avec les auditeurs comme avec des amis/);
  assert.match(solo.all, /À la fin seulement, tu les rappelles tous/);
  assert.match(solo.all, /56 mots au plus/);
});

test('jeux espacés : sur « Parfois », jamais deux cycles de suite ; « Jamais » et le mode bavardage n’en posent aucun', () => {
  const p = loadPanel();
  const run = (games, chat) => {
    p.run("Object.assign(settings, { games: '" + games + "', chat: '" + chat + "' }); var __v = {}; var __g = [];" +
      "for (var i = 0; i < 400; i++) { var g = gameOk(__v, 'hook'); __g.push(g ? 1 : 0); __v.gameLast = g; }");
    return [...p.run('__g')];
  };
  const some = run('parfois', 'parfois');
  for (let i = 1; i < some.length; i++) assert.ok(!(some[i] && some[i - 1]), 'deux cycles de suite avec un jeu');
  const n = some.reduce((a, b) => a + b, 0);
  assert.ok(n > 90 && n < 160, 'environ un programme sur trois : ' + n + ' sur 400');
  const often = run('souvent', 'parfois').reduce((a, b) => a + b, 0);
  assert.ok(often > 240 && often < 320, 'comme avant : ' + often + ' sur 400');
  assert.equal(run('off', 'parfois').reduce((a, b) => a + b, 0), 0);
  assert.equal(run('souvent', 'max').reduce((a, b) => a + b, 0), 0);
  assert.equal(p.run("settings.games = undefined; gameLevel()"), 'parfois');
});

test('programme ouvert : l’annonce préparée correspond toujours, même si la longueur du programme suivant vient d’être tirée', () => {
  const p = loadPanel();
  p.run(DUO + "Object.assign(settings, { radioFreq: 'every', rhythm: 'naturel' });" +
    "var __t = (k) => ({ key: k, title: 'T' + k, artist: 'A' + k });" +
    "var __q = ['b', 'c', 'd', 'e', 'f'].map(__t); var __a = __t('a');" +
    "var __s = { queue: [__a].concat(__q), played: [], lastLines: [], transitions: 3, programme: { keys: ['x', 'y', 'z'], at: 0 }, rhythm: { talk: 3, il: 0, every: 0, progLen: 4 } };");
  // Pendant le titre d'avant : l'annonce est préparée avec un programme de quatre titres.
  const before = p.run("progKeysFor(__s, __a)");
  assert.equal(before, 'a|b|c|d');
  // Le titre démarre : il quitte la file, le programme est ouvert, et la longueur du suivant est tirée (ici 3).
  p.run("__s.queue.shift(); commitProgramme(__s, __a); __s.rhythm.progLen = 3;");
  assert.equal(p.run("progKeysFor(__s, __a)"), before, 'la liste retenue à l’ouverture, pas une liste recalculée à trois titres');
  assert.deepEqual([...p.run("programmeOf(__s, __a).map((x) => x.key)")], ['a', 'b', 'c', 'd']);
  // Un titre du programme retiré de la file entre-temps : la liste change, l'annonce sera refaite.
  p.run("__s.queue.splice(1, 1);");
  assert.equal(p.run("progKeysFor(__s, __a)"), 'a|b|d');
  // Pour un titre encore dans la file, rien ne change : le programme est calculé avec la longueur du moment.
  assert.deepEqual([...p.run("programmeOf(__s, __s.queue[1]).map((x) => x.key)")], ['d', 'e', 'f']);
});

test('dernières interventions : une annonce n’y entre que lorsqu’elle passe à l’antenne', async () => {
  const p = loadPanel();
  p.run("claude = async (action) => (action === 'announce' ? 'A: Vrai ou faux, la question du soir.\\nB: Je parie que c’est vrai.' : {});" +
    "factsFor = async () => ({ text: '', src: '' }); genreFacts = async () => null; speak = async () => {}; call = async () => ({ ok: true }); callSafe = async () => ({ ok: true });" +
    DUO + "Object.assign(settings, { claudeAnnounce: true, radioFreq: 'third', guestFreq: 'off', hostPicks: 'off', chat: 'off', voiceEngine: 'systeme' });" +
    "var __next = { key: 'n', title: 'Song 2', artist: 'Blur', energy: 4 }; var __prev = { key: 'p', title: 'Wonderwall', artist: 'Oasis', energy: 2 };" +
    "var __s = { id: 's1', sel: clone(DEFAULT_SEL), queue: [__next], played: [__prev], lastLines: ['avant'], startedAt: Date.now(), transitions: 1 };");
  const ann = await p.run("prepareAnnouncement(__s, 'talkover', __prev, __next, Date.now() + 60000, { voice: 'later' })");
  assert.deepEqual([...p.run('__s.lastLines')], ['avant'], 'préparée, pas encore dite : rien de retenu');
  await p.run('sayIt')(ann);
  const after = [...p.run('__s.lastLines')];
  assert.equal(after.length, 2);
  assert.match(after[1], /Vrai ou faux, la question du soir/);
  // Un exemple des Réglages ne touche jamais aux dernières interventions de l'émission.
  p.run("var __fake = { id: 'demo', sel: __s.sel, lastLines: __s.lastLines, played: [], queue: [], demo: 'talkover' };");
  const demo = await p.run("prepareAnnouncement(__fake, 'talkover', __prev, __next)");
  await p.run('sayIt')(demo);
  assert.equal(p.run('__s.lastLines.length'), 2);
});

test('retour à la musique : douze façons, jamais une des quatre dernières, et rien « à deux » pour un animateur seul', () => {
  const p = loadPanel();
  assert.equal(p.run('CHAT_PIVOTS.length'), 12);
  assert.equal(new Set([...p.run('CHAT_PIVOTS.map((x) => x.t)')]).size, 12);
  p.run("var __s = { variety: {} }; var __p = []; for (var i = 0; i < 200; i++) __p.push(drawPivot(__s, false));");
  const duo = [...p.run('__p')];
  for (let i = 4; i < duo.length; i++) assert.ok(!duo.slice(i - 4, i).includes(duo[i]), 'reprise trop tôt : ' + duo[i]);
  assert.equal(new Set(duo).size, 11, 'les onze façons à deux sortent toutes');
  p.run("var __s2 = { variety: {} }; var __q = []; for (var i = 0; i < 100; i++) __q.push(drawPivot(__s2, true));");
  const solo = [...p.run('__q')];
  const twoOnly = new Set([...p.run('CHAT_PIVOTS.filter((x) => x.duo).map((x) => x.t)')]);
  assert.ok(solo.every((x) => !twoOnly.has(x)));
  // Le plan le porte en mode bavardage seulement, et les consignes le transmettent.
  p.run(DUO + "Object.assign(settings, { chat: 'max', radioFreq: 'every' }); var __s3 = { lastLines: [], played: [], queue: [] };");
  assert.ok(p.run("planAnnouncement(__s3, 'talkover', null, { title: 'C', artist: 'D', key: 'a' }, 1e12, 'culture', 0, false).pivot"));
  p.run("settings.chat = 'souvent';");
  assert.equal(p.run("planAnnouncement(__s3, 'talkover', null, { title: 'C', artist: 'D', key: 'b' }, 1e12, 'chronique', 0, false).pivot"), undefined);
});

test('consignes : la façon de revenir à la musique est transmise, sans mot de liaison passe-partout', async () => {
  const bg = loadBackground();
  await bg.run("writeAnnouncement({ kind: 'talkover', host: 'Laeti', cohost: 'Jeff', duo: true, turns: 3, next: 'X de Y', chatMode: true, pivot: 'le titre suivant sert de chute', angle: 'Un moment de bavardage.' })");
  const user = bg.__calls[0].body.messages[0].content;
  assert.match(user, /RETOUR À LA MUSIQUE, cette fois : le titre suivant sert de chute\. Pas de mot de liaison passe-partout/);
  assert.match(user, /l'heure, la météo ou le nom de la station, s'ils sont demandés, se disent à ce moment-là, jamais au milieu de la conversation/);
});
