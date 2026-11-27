'use strict';
// 2.35 : la parole des animateurs. Fiches du duo Jeff & Laeti et leur mise à jour, dosage des fiches tenu
// par Mood DJ (tics, détails, running gags), conversations libres, coupures de parole, adresse aux auditeurs.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadPanel, loadBackground } = require('./helpers');

const OLD = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'preset-jeff-laeti-2.34.json'), 'utf8'));
const TEXTS = ['hostPersona', 'cohostPersona', 'duoRelation', 'stationLore'];

test('duo Jeff & Laeti : « chef » réservé à Marielle, plus d’image à tout prix, plus de mode d’écoute', () => {
  const p = loadPanel();
  const J = p.run('PRESET_JEFF_LAETI');
  const all = TEXTS.map((k) => J[k]).join('\n');
  assert.doesNotMatch(all, /l’auditeur « chef »|nouveau « chef »|cheffe/);
  assert.doesNotMatch(all, /Ça me fait un film|regarde la musique|Mes J’aime|mode Découverte/);
  assert.doesNotMatch(J.cohostPersona, /appelle l’auditeur/);
  assert.match(J.hostPersona, /Chef, c’est le titre qu’il réserve à Marielle/);
  assert.match(J.stationLore, /Marielle, la journaliste/);
  assert.match(J.stationLore, /Annaelle, dite Anna, l’éclairagiste/);
  // « Chef » n'est pas entre guillemets : ce n'est pas une expression fétiche que Mood DJ pourrait proposer.
  assert.ok(!p.run('fileSayings(PRESET_JEFF_LAETI.hostPersona, "A")').some((x) => /chef/i.test(x.text)));
});

test('mise à jour du duo : anciens textes remplacés, souvenirs « chef » retirés, voix gardées', () => {
  const p = loadPanel();
  p.run('var __old = ' + JSON.stringify(OLD));
  for (const k of TEXTS) assert.equal(p.run('PRESET_OLD_PRINTS[textPrint(__old.' + k + ')]'), k, 'empreinte de ' + k);
  p.run("Object.assign(settings, __old, { hostName: 'Jeff', cohostName: 'Laeti', geminiVoice: 'Puck', presetRev: 0 });" +
    "hostMemory = { A: [{ t: 'Jeff appelle l’auditeur chef', at: 1 }, { t: 'Jeff a un vieux pulp préféré', at: 2 }, { t: 'Marielle est la seule chef de Jeff', at: 3 }], B: [], L: [] };" +
    "hostProfiles = [{ name: 'Jeff', persona: __old.hostPersona }]; loreProfiles = [{ name: 'Régie', lore: __old.stationLore, relation: __old.duoRelation }];");
  p.run('migratePreset()');
  for (const k of TEXTS) assert.equal(p.run('settings.' + k), p.run('PRESET_JEFF_LAETI.' + k), k);
  assert.equal(p.run('settings.geminiVoice'), 'Puck');
  assert.equal(p.run('settings.presetRev'), p.run('PRESET_REV'));
  assert.deepEqual([...p.run('hostMemory.A.map((m) => m.t)')], ['Jeff a un vieux pulp préféré', 'Marielle est la seule chef de Jeff']);
  assert.equal(p.run('hostProfiles[0].persona'), p.run('PRESET_JEFF_LAETI.hostPersona'));
  assert.equal(p.run('loreProfiles[0].relation'), p.run('PRESET_JEFF_LAETI.duoRelation'));
});

test('mise à jour du duo : une fiche retouchée n’est pas écrasée, sauf si on le demande', () => {
  const p = loadPanel();
  const mine = OLD.hostPersona + ' Il adore les crêpes.';
  p.run('settings.hostPersona = ' + JSON.stringify(mine) + '; settings.presetRev = 0; hostProfiles = []; loreProfiles = [];');
  assert.deepEqual(JSON.parse(JSON.stringify(p.run('refreshPresetTexts(false)'))), { updated: 0, edited: 1 });
  assert.equal(p.run('settings.hostPersona'), mine);
  assert.equal(p.run('refreshPresetTexts(true).updated'), 1);
  assert.equal(p.run('settings.hostPersona'), p.run('PRESET_JEFF_LAETI.hostPersona'));
  // Une fiche écrite par l'auditeur, sans rapport avec le duo, n'est jamais touchée.
  p.run("settings.hostPersona = 'Aime le funk. Manie : dit « chef » à tout le monde.'");
  assert.deepEqual(JSON.parse(JSON.stringify(p.run('refreshPresetTexts(true)'))), { updated: 0, edited: 0 });
});

test('fiches : expressions fétiches, détails personnels et running gags sont extraits', () => {
  const p = loadPanel();
  const say = p.run('fileSayings(PRESET_JEFF_LAETI.hostPersona, "A").concat(fileSayings(PRESET_JEFF_LAETI.cohostPersona, "B"))');
  const by = (t) => say.find((x) => x.text === t);
  assert.ok(by('Oki-doki').offer && !by('Oki-doki').rare);
  assert.ok(by('Whoa !').offer && by('Whoa !').rare);
  assert.ok(by('Bordel…').rare);
  assert.ok(!by('Hum. Ouais. Bref.').offer, 'une réaction citée est surveillée, pas proposée');
  assert.equal(p.run('fileGags(PRESET_JEFF_LAETI.duoRelation).length'), 3);
  assert.match(p.run('fileGags(PRESET_JEFF_LAETI.duoRelation)[0]'), /^l’accoutrement \(.*insiste\)$/);
  const facets = p.run('fileFacets(PRESET_JEFF_LAETI.hostPersona, "A").map((x) => x.text)');
  assert.ok(facets.some((x) => /^Manies/.test(x)) && facets.some((x) => /Marielle/.test(x)));
  assert.ok(!facets.some((x) => /^Tics|^Réactions/.test(x)));
  // Fiche courte tirée au sort : chaque phrase est un détail, sauf le rôle dans le duo.
  assert.equal(p.run("fileFacets('Aime le funk des années 70. Manie : note chaque solo de guitare sur 10. Dans la vie : a un chat qui s’appelle Riff. Ne supporte pas les fondus trop longs. Dans le duo : la mémoire de la station.', 'A').length"), 3);
});

test('dosage : jamais deux tics de suite, une expression dite passe au repos, un seul running gag par émission', () => {
  const p = loadPanel();
  p.run('Object.assign(settings, PRESET_JEFF_LAETI); var __s = { variety: { angles: [] } }; var __t = 1e12; var __log = [];');
  for (let i = 0; i < 80; i++) {
    p.run("__t += 4 * 60e3; var __f = ficheFocus(__s, " + (i % 3 ? "'talkover'" : "'interlude'") + ", ['A', 'B'], __t);" +
      "if (__f.tic) noteSayings(__s, 'Bon. ' + __f.tic.text + ' On enchaîne.', __t); __log.push(__f);");
  }
  const log = JSON.parse(JSON.stringify(p.run('__log')));
  assert.ok(log.some((f) => f.tic), 'un tic est proposé de temps en temps');
  assert.ok(log.filter((f) => f.tic).length < 40, 'mais pas à chaque fois');
  for (let i = 1; i < log.length; i++) {
    assert.ok(!(log[i].tic && log[i - 1].tic), 'deux tics de suite à ' + i);
    // 4 minutes plus tôt, l'expression a été dite : elle est au repos, et pas proposée de nouveau.
    if (log[i - 1].tic) assert.ok(log[i].rest.includes(log[i - 1].tic.text), 'repos à ' + i);
    if (log[i].tic) assert.ok(!log[i].rest.includes(log[i].tic.text));
  }
  assert.equal(log.filter((f) => f.gag).length, 1, 'un seul running gag dans l’émission');
  assert.ok(log.every((f) => f.hasGags));
  assert.notEqual(log[0].mood.A, log[0].mood.B);
  assert.ok(log.every((f) => f.mood.A === log[0].mood.A), 'l’humeur du jour ne change pas pendant l’émission');
  // Seul à l'antenne : pas de running gag (il se joue à deux), et seulement les expressions de celui qui parle.
  const solo = JSON.parse(JSON.stringify(p.run("ficheFocus({ variety: { angles: [] } }, 'talkover', ['B'], 1e12)")));
  assert.equal(solo.hasGags, false);
  assert.equal(solo.mood.A, '');
});

test('mots trop entendus : « chef » est compté, les prénoms et les expressions fétiches ne le sont pas', () => {
  const p = loadPanel();
  const lines = ['Oki-doki, chef, on enchaîne.', 'Allez chef, un vrai générique.', 'Merci chef. Laeti adore ce générique.', 'Oki-doki, dit Laeti.'];
  const words = p.run('overused(' + JSON.stringify(lines) + ', new Set(["laeti", "oki-doki", "oki", "doki"]))');
  assert.deepEqual([...words].sort(), ['chef', 'générique']);
  // Deux fois seulement : un mot de 4 lettres n'est pas encore suspect.
  assert.ok(!p.run('overused(["Bref, on y va.", "Bref."], new Set())').includes('bref'));
});

test('radio dans une autre langue : fiche en anglais comprise, petits mots anglais jamais « à éviter », tic au repos sans le reconnaître', () => {
  const p = loadPanel();
  // Guillemets anglais ou droits, rubrique « Catchphrases », « once an hour ».
  const say = [...p.run("fileSayings('Dry wit. Catchphrases: “Okey-dokey” to wrap up; \"Blimey…\" once an hour; “Not bad.” as his biggest compliment. Loves 80s synths and film scores.', 'A')")];
  assert.deepEqual(say.map((x) => x.text), ['Okey-dokey', 'Blimey…', 'Not bad.']);
  assert.ok(say.every((x) => x.offer));
  assert.deepEqual(say.map((x) => x.rare), [false, true, false]);
  // En anglais, « that » et « with » ne remplissent pas la liste des mots à éviter ; un vrai mot répété, si.
  p.run("settings.radioLang = 'en'");
  const words = [...p.run('overused(["That was great, with that guitar.", "With that voice, that chorus about love.", "That guitar again, with love, about time."], new Set())')];
  assert.deepEqual(words.sort(), ['guitar']);
  // La fiche est en français, la radio en anglais : « Oki-doki » est dit « Okey-dokey », que Mood DJ ne peut pas
  // reconnaître dans le texte. L'expression proposée est donc comptée comme dite, et passe au repos.
  p.run('Object.assign(settings, PRESET_JEFF_LAETI); var __s = { variety: { angles: [] } }; var __log = [];');
  for (let i = 0; i < 60; i++) p.run("__log.push(ficheFocus(__s, 'interlude', ['A', 'B'], 1e12 + " + i + ' * 4 * 60e3))');
  const log = JSON.parse(JSON.stringify(p.run('__log')));
  assert.ok(log.some((f) => f.tic));
  for (let i = 1; i < log.length; i++) if (log[i - 1].tic) assert.ok(log[i].rest.includes(log[i - 1].tic.text), 'repos à ' + i);
});

test('fiche que Mood DJ ne sait pas découper : rien n’est interdit, la fiche est suivie comme avant', async () => {
  const p = loadPanel();
  p.run("Object.assign(settings, { hostPersona: 'ロック好き。ギターソロに点数をつける。', cohostPersona: 'fan de rock', duoRelation: '' }); hostMemory = { A: [], B: [], L: [] };");
  const f = JSON.parse(JSON.stringify(p.run("ficheFocus({ variety: { angles: [] } }, 'interlude', ['A', 'B'], 1e12)")));
  assert.deepEqual([f.hasSayings, f.hasFacets, f.hasGags, f.tic, f.facet], [false, false, false, null, null]);
  const bg = loadBackground();
  await bg.run('writeAnnouncement({ kind: "talkover", host: "Alex", cohost: "Sam", duo: true, turns: 2, next: "X de Y", focus: ' + JSON.stringify(f) + ' })');
  const user = bg.__calls[0].body.messages[0].content;
  assert.doesNotMatch(user, /DOSAGE DES FICHES|Aucun détail personnel|Aucune expression fétiche/);
  assert.match(user, /HUMEUR DU JOUR/);
});

test('coupure de parole : « >> » est noté sur la réplique et n’est jamais lu', () => {
  const p = loadPanel();
  const r = JSON.parse(JSON.stringify(p.run("takeMarks(parseTurns('A: >> Bonsoir à tous.\\nB: Moi, ce que j’aime, c’est quand la basse…\\nA: >> {amused} … arrive enfin.\\nB: Laisse-moi >> finir !\\nB: >> Bon.', true))")));
  assert.deepEqual(r.turns.map((t) => !!t.cut), [false, false, true, false, false]);
  assert.equal(r.turns[2].emotion, 'amused');
  assert.equal(r.turns[2].text, '… arrive enfin.');
  for (const t of r.turns) assert.doesNotMatch(t.text, />/);
});

test('programme : une part des interventions devient une conversation, jamais deux de suite, et jamais sur « Jamais »', () => {
  const p = loadPanel();
  const share = (chat) => {
    p.run("Object.assign(settings, { chat: '" + chat + "', radioFreq: 'third', programme: true, voiceEngine: 'systeme' }); var __s = { lastLines: [], played: [], queue: [] }; var __free = [];" +
      "for (var i = 0; i < 300; i++) { var pl = planAnnouncement(__s, 'talkover', { title: 'A', artist: 'B' }, { title: 'C', artist: 'D', key: 'k' + i }, 1e12 + i * 6e5, 'programme', 3, false); __free.push(pl.free ? pl.angle.id : ''); }");
    return [...p.run('__free')];
  };
  assert.ok(share('off').every((x) => !x), 'sur « Jamais », toujours le programme');
  const some = share('parfois');
  const n = some.filter(Boolean).length;
  assert.ok(n > 60 && n < 140, 'environ une sur trois : ' + n + ' sur 300');
  for (let i = 1; i < some.length; i++) assert.ok(!(some[i] && some[i - 1]), 'deux conversations de suite');
  assert.ok(some.includes('bavardage'), 'le bavardage sort');
  assert.ok(!some.includes('programme'));
  const often = share('souvent').filter(Boolean).length;
  assert.equal(often, 150, 'une sur deux, en alternance');
  // Invité au micro, dédicace, réponse d'un jeu, choix d'un animateur : jamais de conversation libre.
  p.run("settings.chat = 'souvent'; var __n = 0; for (var i = 0; i < 50; i++) if (planAnnouncement({ lastLines: [], played: [], queue: [] }, 'talkover', null, { title: 'C', artist: 'D', key: 'x' }, 1e12, 'programme', 3, true).free) __n++;");
  assert.equal(p.run('__n'), 0);
});

test('phrases toutes faites : on parle aux auditeurs (« vous »), sans prénom', () => {
  const p = loadPanel();
  p.run("var __c = { host: 'Alex', cohost: 'Sam', listener: 'Luc', greet: 'Bonsoir', time: 'vingt heures', part: 'soirée', ambiance: 'rock du soir', weather: '', prev: { title: 'Wonderwall', artist: 'Oasis' }, next: { title: 'Song 2', artist: 'Blur' }, trend: 'monte' };");
  for (const kind of ['intro', 'interlude', 'talkover']) {
    for (let i = 0; i < 12; i++) {
      for (const text of [p.run("templateLine('" + kind + "', __c)"), p.run("templateDuo('" + kind + "', __c)")]) {
        assert.match(text, /Song 2/);
        assert.doesNotMatch(text, /\b(tu|toi|te|ton|ta|tes)\b|Luc|Installe-toi/i, text);
      }
    }
  }
  assert.match(p.run("templateDuo('interlude', __c)"), /Vous écoutez Mood DJ/);
  assert.doesNotMatch(p.run("templateLineEn('intro', Object.assign({ greetEn: 'Good evening', ambianceEn: 'rock' }, __c))"), /Luc/);
});

test('consignes : vouvoiement, français parlé, aucune allusion aux goûts ; dosage, dynamique et coupure transmis', async () => {
  const bg = loadBackground();
  await bg.run("writeAnnouncement({ kind: 'interlude', host: 'Jeff', cohost: 'Laeti', duo: true, turns: 4, lang: 'fr', next: 'X de Y', previous: 'Z de W', listener: 'Luc', listenMode: 'jaime', cuts: 1," +
    " dynamic: 'pas de vanne cette fois : un enthousiasme simple et sincère, partagé'," +
    " focus: { tic: { who: 'A', text: 'Oki-doki' }, rest: ['Whoa !'], facet: { who: 'B', text: 'Manies : le mug brûlant.' }, gag: '', hasGags: true, mood: { A: 'd’humeur taquine', B: 'd’humeur rêveuse' } }," +
    " change: { from: 'rock', to: 'jazz' }, persona: { a: 'Fiche A.', b: 'Fiche B.', relation: 'Relation.' } })");
  const body = bg.__calls[0].body;
  const system = body.system.map((x) => x.text).join('\n');
  const user = body.messages[0].content;
  assert.match(system, /toujours « vous »/);
  assert.match(system, /ÉCRIS POUR L'OREILLE/);
  assert.match(system, /Ne parle jamais des goûts des auditeurs/);
  assert.doesNotMatch(system + user, /tutoyant|radio musicale personnelle|MODE D'ÉCOUTE|Prénom de l'auditeur|Luc|à la demande de l'auditeur/);
  assert.match(user, /Dynamique de cette intervention[^\n]*enthousiasme simple et sincère/);
  assert.doesNotMatch(user, /Ils se chambrent/);
  assert.match(user, /commence par « >> »/);
  assert.match(user, /Expression fétiche : une seule au plus, « Oki-doki » \(A, Jeff\)/);
  assert.match(user, /Au repos, déjà entendues récemment, à ne pas dire : « Whoa ! »/);
  assert.match(user, /Un seul détail personnel peut affleurer[^\n]*\(B, Laeti\) : Manies : le mug brûlant\./);
  assert.match(user, /Aucun running gag cette fois\./);
  assert.match(user, /HUMEUR DU JOUR[^\n]*A, d’humeur taquine ; B, d’humeur rêveuse/);
  assert.match(user, /c'est la programmation de la station qui change/);
  // Sans dosage ni coupure demandés (bilan de fin, exemples des Réglages) : les consignes d'avant restent valables.
  await bg.run("writeAnnouncement({ kind: 'talkover', host: 'Alex', cohost: 'Sam', duo: true, turns: 2, next: 'X de Y' })");
  const plain = bg.__calls[1].body.messages[0].content;
  assert.match(plain, /Ils se chambrent/);
  assert.doesNotMatch(plain, /DOSAGE DES FICHES|« >> »/);
});

test('coanimateur seul à l’antenne : son humeur du jour est transmise', async () => {
  const bg = loadBackground();
  await bg.run("writeAnnouncement({ kind: 'talkover', host: 'Laeti', hostGender: 'femme', lang: 'fr', next: 'X de Y', focus: { tic: null, rest: [], facet: null, gag: '', hasGags: false, mood: { A: '', B: 'd’humeur joueuse' } } })");
  const user = bg.__calls[0].body.messages[0].content;
  assert.match(user, /HUMEUR DU JOUR[^\n]*: d’humeur joueuse\./);
  assert.doesNotMatch(user, /running gag/i);
});

test('consignes dans une autre langue : on s’adresse à l’ensemble des auditeurs', async () => {
  const bg = loadBackground();
  await bg.run("writeAnnouncement({ kind: 'talkover', host: 'Alex', lang: 'en', next: 'X de Y' })");
  const system = bg.__calls[0].body.system.map((x) => x.text).join('\n');
  assert.match(system, /à l'ensemble des auditeurs \(au pluriel\)/);
  assert.doesNotMatch(system, /tutoiement/);
});
