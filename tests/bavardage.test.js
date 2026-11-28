'use strict';
// 2.37 et 2.38 : les conversations à la place des annonces (niveau, curseur musique ou bavardage, rappel des titres),
// le jeu ramené au rang d'un type de conversation, et deux correctifs tirés du
// journal du 28/11 : l'annonce préparée reprise après l'ouverture d'un programme, et une annonce retenue dans
// « les dernières interventions » seulement quand elle passe à l'antenne.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadPanel, loadBackground } = require('./helpers');

const DUO = "Object.assign(settings, { radio: true, programme: true, voiceEngine: 'gemini', duo: true, hostName: 'Laeti', cohostName: 'Jeff', loreLevel: 'off' }); hasGemini = true; hasGemini1 = true; hasKey = true;";

test('« Tout le temps » : chaque intervention est une conversation, à deux même sur le fondu ; le curseur fixe la part hors musique', () => {
  const p = loadPanel();
  const run = (mix) => {
    p.run(DUO + "Object.assign(settings, { chat: 'max', chatMix: " + mix + ", radioFreq: 'every', anecdotes: 'souvent' }); var __s = { lastLines: [], played: [], queue: [] }; var __out = [];" +
      "var __roles = ['programme', 'chronique', 'culture'];" +
      "for (var i = 0; i < 600; i++) { var r = __roles[i % 3]; var k = r === 'chronique' ? 'interlude' : 'talkover';" +
      "  var pl = planAnnouncement(__s, k, { title: 'A', artist: 'B' }, { title: 'C', artist: 'D', key: 'k' + i }, 1e12 + i * 2e5, r, r === 'programme' ? 3 : 0, false);" +
      "  __out.push([r, k, pl.free, pl.duo, pl.turns, pl.angle.id, pl.angle.format || '', pl.pivot ? 1 : 0].join('|')); }");
    return [...p.run('__out')].map((x) => x.split('|'));
  };
  const rows = run(70);
  assert.ok(rows.every((r) => r[2] === 'true'), 'toutes libres');
  assert.ok(rows.every((r) => r[3] === 'true'), 'toujours à deux, même par-dessus le fondu');
  assert.ok(rows.every((r) => r[5] !== 'programme'), 'plus de programme détaillé');
  assert.ok(rows.every((r) => r[7] === '1'), 'un retour à la musique tiré à chaque fois');
  const chat = rows.filter((r) => r[5] === 'bavardage').length;
  assert.ok(chat > 370 && chat < 470, 'curseur à 70 % : ' + chat + ' sur 600');
  // Le reste : les conversations autour de la musique et quelques anecdotes, jamais la même deux fois de suite.
  const others = rows.filter((r) => r[5] !== 'bavardage').map((r) => r[5]);
  assert.ok(new Set(others).size >= 12, 'types variés : ' + new Set(others).size);
  assert.ok(others.some((x) => /^anecdote/.test(x)), 'les anecdotes gardent une place');
  // Sur le fondu : trois ou quatre répliques (deux d'habitude) ; quatre au moins quand il y a des titres à rappeler.
  assert.ok(rows.filter((r) => r[1] === 'talkover').every((r) => Number(r[4]) >= 3));
  assert.ok(rows.filter((r) => r[0] === 'programme').every((r) => Number(r[4]) >= 4));
  // Les six formats de bavardage tournent, et jamais le même deux fois de suite.
  const fm = rows.filter((r) => r[5] === 'bavardage').map((r) => r[6]);
  assert.ok(new Set(fm).size >= 4, [...new Set(fm)].join(', '));
  for (let i = 1; i < fm.length; i++) assert.notEqual(fm[i], fm[i - 1]);
  // Les deux bouts du curseur, et le milieu par défaut.
  assert.equal(run(0).filter((r) => r[5] === 'bavardage').length, 0, 'tout à gauche : que de la musique');
  assert.equal(run(100).filter((r) => r[5] === 'bavardage').length, 600, 'tout à droite : que du bavardage');
  p.run('settings.chatMix = undefined;');
  assert.equal(p.run('chatMix()'), 50);
  p.run("settings.chatMix = 'abc';");
  assert.equal(p.run('chatMix()'), 50);
  p.run('settings.chatMix = 250;');
  assert.equal(p.run('chatMix()'), 100);
});

test('« Parfois » et « Souvent » : le programme, la chronique et la culture courte laissent la place à une conversation, chacun à son tour', () => {
  const p = loadPanel();
  const run = (chat) => {
    p.run(DUO + "Object.assign(settings, { chat: '" + chat + "', chatMix: 30, radioFreq: 'every' }); var __s = { lastLines: [], played: [], queue: [] }; var __out = [];" +
      "var __roles = ['programme', 'chronique', 'culture'];" +
      "for (var i = 0; i < 900; i++) { var r = __roles[i % 3]; var k = r === 'chronique' ? 'interlude' : 'talkover';" +
      "  var pl = planAnnouncement(__s, k, { title: 'A', artist: 'B' }, { title: 'C', artist: 'D', key: 'k' + i, year: 1999 }, 1e12 + i * 2e5, r, r === 'programme' ? 3 : 0, false);" +
      "  __out.push([r, pl.free, pl.angle.id, pl.duo].join('|')); }");
    return [...p.run('__out')].map((x) => x.split('|'));
  };
  const some = run('parfois');
  for (const role of ['programme', 'chronique', 'culture']) {
    const mine = some.filter((r) => r[0] === role);
    const free = mine.filter((r) => r[1] === 'true');
    assert.ok(free.length > 110 && free.length < 190, role + ' : environ une sur deux, ' + free.length + ' sur 300');
    // Les autres fois, la forme habituelle du créneau.
    const classic = mine.filter((r) => r[1] !== 'true').map((r) => r[2]);
    if (role === 'programme') assert.ok(classic.every((x) => x === 'programme'));
    else assert.ok(classic.every((x) => /^anecdote/.test(x)), role + ' : ' + [...new Set(classic)].join(', '));
    // Une conversation n'est jamais « le programme », et elle se joue à deux.
    assert.ok(free.every((r) => r[2] !== 'programme' && r[3] === 'true'));
    const chat = free.filter((r) => r[2] === 'bavardage').length / free.length;
    assert.ok(chat > 0.15 && chat < 0.45, role + ' : curseur à 30 %, ' + Math.round(chat * 100) + ' %');
  }
  const often = run('souvent').filter((r) => r[1] === 'true').length;
  assert.ok(often > 720 && often < 810, 'presque toutes : ' + often + ' sur 900');
  assert.equal(run('off').filter((r) => r[1] === 'true').length, 0);
});

test('conversations : l’intro, l’invité, la dédicace et le changement d’ambiance gardent leur forme ; un seul animateur bavarde aussi', () => {
  const p = loadPanel();
  p.run(DUO + "Object.assign(settings, { chat: 'max', chatMix: 100, radioFreq: 'third' }); var __s = { lastLines: [], played: [], queue: [] };");
  assert.equal(p.run("planAnnouncement(__s, 'intro', null, { title: 'C', artist: 'D', key: 'a' }, 1e12, 'programme', 3, false).free"), false);
  assert.equal(p.run("planAnnouncement(__s, 'talkover', null, { title: 'C', artist: 'D', key: 'b' }, 1e12, 'programme', 3, true).free"), false, 'invité, dédicace, réponse de jeu, choix d’animateur');
  assert.equal(p.run("planAnnouncement(Object.assign({}, __s, { ambianceChange: { done: false, locked: [], from: 'x', to: 'y' } }), 'talkover', null, { title: 'C', artist: 'D', key: 'c' }, 1e12, 'programme', 3, false).free"), false);
  // Hors programme aussi (programme coupé) : une conversation.
  assert.equal(p.run("planAnnouncement(__s, 'talkover', { title: 'A', artist: 'B' }, { title: 'C', artist: 'D', key: 'd' }, 1e12, null, 0, false).free"), true);
  // Un seul animateur (voix de l'ordinateur) : il bavarde seul, avec les sujets qui ne demandent pas d'être deux.
  p.run("settings.voiceEngine = 'systeme'; var __solo = []; for (var i = 0; i < 80; i++) { var pl = planAnnouncement(__s, 'talkover', { title: 'A', artist: 'B' }, { title: 'C', artist: 'D', key: 's' + i }, 1e12 + i * 1e5, 'programme', 3, false); __solo.push(pl.duo + '|' + pl.free + '|' + (pl.angle.format || pl.angle.id)); }");
  const solo = [...p.run('__solo')];
  assert.ok(solo.every((x) => x.startsWith('false|true|')));
  assert.ok(!solo.some((x) => x.endsWith('|minijeu')), 'pas de mini-jeu à un seul');
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
  const chat = await sys(Object.assign({ kind: 'talkover', chatMode: true, chatShow: true, upcoming: ['Unhappy de The Salads', 'Love You Anyway de Luke Combs', 'Gay Bar de Electric Six'] }, base));
  assert.match(chat.all, /MODE BAVARDAGE : dans cette émission, les animateurs passent leur temps à déconner entre eux/);
  assert.match(chat.all, /TITRES À VENIR, dans cet ordre : 1\. Unhappy de The Salads \(il démarre tout de suite\) ; 2\. Love You Anyway de Luke Combs ; 3\. Gay Bar de Electric Six\./);
  assert.match(chat.all, /À la fin seulement, l'un des deux les rappelle tous dans cet ordre, chacun avec son titre et son artiste/);
  // 55 mots pour la conversation, 8 par titre à rappeler.
  assert.match(chat.all, /Écris 4 répliques, 79 mots au plus au total/);
  assert.doesNotMatch(chat.all, /PROGRAMME DES PROCHAINES MINUTES/);
  // Un seul titre à lancer : plus de place qu'une annonce (35 mots), sans rappel.
  // Sur « Parfois » ou « Souvent », la même place pour parler, sans le ton « mode bavardage » de toute l'émission.
  const one = await sys(Object.assign({ kind: 'talkover', chatMode: true }, base, { turns: 3 }));
  assert.match(one.all, /Écris 3 répliques, 55 mots au plus au total/);
  assert.doesNotMatch(one.all, /TITRES À VENIR|MODE BAVARDAGE/);
  // Sans le mode : rien de tout ça, et la partie fixe des consignes (le cache) est la même dans les deux cas.
  const plain = await sys(Object.assign({ kind: 'talkover' }, base, { turns: 2 }));
  assert.doesNotMatch(plain.all, /MODE BAVARDAGE|TITRES À VENIR/);
  assert.match(plain.all, /Écris 2 répliques, 35 mots au plus au total/);
  assert.equal(plain.stable, chat.stable);
  // Un seul animateur : il rappelle lui-même les titres.
  const solo = await sys({ kind: 'talkover', host: 'Alex', chatMode: true, chatShow: true, next: 'X de Y', angle: 'Un mot de bavardage.', upcoming: ['X de Y', 'Z de W'] });
  assert.match(solo.all, /tu bavardes avec les auditeurs comme avec des amis/);
  assert.match(solo.all, /À la fin seulement, tu les rappelles tous/);
  assert.match(solo.all, /56 mots au plus/);
});

test('le jeu : un type de conversation parmi les autres, au rang d’un aveu ; plus fréquent sur « Souvent », jamais sur « Jamais »', () => {
  const p = loadPanel();
  const share = (games, extra) => {
    p.run(DUO + "Object.assign(settings, { claudeAnnounce: true, chat: 'max', chatMix: 0, radioFreq: 'every', anecdotes: 'souvent', games: '" + games + "' }); var __s = { lastLines: [], played: [], queue: [] }; " + (extra || '') + " var __n = 0;" +
      "for (var i = 0; i < 1500; i++) { var pl = planAnnouncement(__s, 'interlude', { title: 'A', artist: 'B' }, { title: 'C', artist: 'D', key: 'k' + i, year: 1999 }, 1e12 + i * 2e5, 'culture', 0, false); if (pl.angle.id === 'jeu') __n++; }");
    return p.run('__n');
  };
  const some = share('parfois');
  // Poids 2 sur une cinquantaine : quelques pour cent des conversations autour de la musique, pas une sur deux.
  assert.ok(some > 20 && some < 110, 'parfois : ' + some + ' sur 1500');
  const often = share('souvent');
  assert.ok(often > some * 1.5 && often < 260, 'souvent : ' + often + ' sur 1500');
  assert.equal(share('off'), 0);
  // Sans IA pour l'écrire, ou tant qu'un jeu attend sa réponse : pas de nouveau jeu.
  assert.equal(share('souvent', 'hasKey = false;'), 0);
  assert.equal(share('souvent', "__s.hook = { id: 'h', forKey: 'zz' };"), 0);
  assert.equal(p.run("settings.games = undefined; gameLevel()"), 'parfois');
  assert.equal(p.run("angleWeight(ANGLES_DUO.find((a) => a.id === 'jeu'))"), p.run("angleWeight(ANGLES_DUO.find((a) => a.id === 'aveu'))"));
});

test('le jeu, une fois tiré : question sur le deuxième titre à l’ouverture d’un programme, express sinon, et une autre conversation sans fiche', async () => {
  const p = loadPanel();
  p.run("var __pay = null; claude = async (action, payload) => { if (action === 'announce') { __pay = payload; return 'A: Vrai ou faux ?\\nB: Vrai.\\nQUESTION : q\\nRÉPONSE : r'; } return {}; };" +
    "var __fiche = 'Le groupe a enregistré ce titre en une seule prise, en 1997.'; factsFor = async () => ({ text: __fiche, src: 'wiki' }); genreFacts = async () => null; weatherLine = async () => '';" +
    DUO + "Object.assign(settings, { claudeAnnounce: true, radioFreq: 'every', rhythm: 'regulier', guestFreq: 'off', hostPicks: 'off', chat: 'max', chatMix: 0, games: 'parfois' });" +
    // Le tirage est forcé sur le jeu : c'est la suite (prepareAnnouncement) qu'on vérifie ici.
    "var __plan = planAnnouncement; planAnnouncement = function () { var pl = __plan.apply(null, arguments); if (pl.free) pl.angle = ANGLES_DUO.find((a) => a.id === 'jeu'); return pl; };" +
    "var __t = (k) => ({ key: k, title: 'Titre ' + k, artist: 'Artiste ' + k, energy: 3 });" +
    "var __mk = () => ({ id: 's1', sel: clone(DEFAULT_SEL), queue: ['b', 'c', 'd', 'e'].map(__t), played: [], lastLines: [], startedAt: Date.now(), transitions: 3, programme: { keys: ['x', 'y', 'z'], at: 0 } });");
  // 1. Ouverture d'un programme : le jeu en deux temps, sur le deuxième titre annoncé.
  const a = await p.run("(async () => { var s = __mk(); return prepareAnnouncement(s, 'talkover', __t('a'), s.queue[0], Date.now() + 6e4, { voice: 'later' }); })()");
  const pay = JSON.parse(JSON.stringify(p.run('__pay')));
  assert.ok(a.hook && a.hook.forKey === 'c', 'la question porte sur le deuxième titre');
  assert.ok(pay.hook && /Titre c/.test(pay.hook.title));
  assert.equal(pay.express, null);
  assert.match(pay.angle, /jeu en deux temps/);
  assert.deepEqual(pay.upcoming.length, 3);
  assert.equal(pay.programme, null);
  assert.match(pay.hookFacts, /une seule prise/);
  // 2. Ailleurs dans le cycle : le vrai ou faux express, sur le titre suivant.
  p.run("__pay = null;");
  const b = await p.run("(async () => { var s = __mk(); s.programme = { keys: ['a', 'b', 'c'], at: 0 }; return prepareAnnouncement(s, 'talkover', __t('a'), s.queue[1], Date.now() + 6e4, { voice: 'later' }); })()");
  const pay2 = JSON.parse(JSON.stringify(p.run('__pay')));
  assert.equal(b.hook, null);
  assert.ok(pay2.express && /^(vrai|faux)$/.test(pay2.express.truth));
  assert.match(pay2.facts, /une seule prise/);
  // 3. Aucune fiche : pas de jeu, une autre conversation autour de la musique.
  p.run("__pay = null; __fiche = '';");
  await p.run("(async () => { var s = __mk(); s.programme = { keys: ['a', 'b', 'c'], at: 0 }; return prepareAnnouncement(s, 'talkover', __t('a'), s.queue[1], Date.now() + 6e4, { voice: 'later' }); })()");
  const pay3 = JSON.parse(JSON.stringify(p.run('__pay')));
  assert.equal(pay3.express, null);
  assert.equal(pay3.hook, null);
  assert.doesNotMatch(pay3.angle, /vrai ou faux/i);
  assert.ok(pay3.angle.length > 30);
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
  // Le plan le porte pour toute conversation, et seulement pour elles.
  p.run(DUO + "Object.assign(settings, { chat: 'max', radioFreq: 'every' }); var __s3 = { lastLines: [], played: [], queue: [] };");
  assert.ok(p.run("planAnnouncement(__s3, 'talkover', null, { title: 'C', artist: 'D', key: 'a' }, 1e12, 'culture', 0, false).pivot"));
  p.run("settings.chat = 'off';");
  assert.equal(p.run("planAnnouncement(__s3, 'talkover', null, { title: 'C', artist: 'D', key: 'b' }, 1e12, 'chronique', 0, false).pivot"), undefined);
});

test('consignes : la façon de revenir à la musique est transmise, sans mot de liaison passe-partout', async () => {
  const bg = loadBackground();
  await bg.run("writeAnnouncement({ kind: 'talkover', host: 'Laeti', cohost: 'Jeff', duo: true, turns: 3, next: 'X de Y', chatMode: true, pivot: 'le titre suivant sert de chute', angle: 'Un moment de bavardage.' })");
  const user = bg.__calls[0].body.messages[0].content;
  assert.match(user, /RETOUR À LA MUSIQUE, cette fois : le titre suivant sert de chute\. Pas de mot de liaison passe-partout/);
  assert.match(user, /l'heure, la météo ou le nom de la station, s'ils sont demandés, se disent à ce moment-là, jamais au milieu de la conversation/);
});
