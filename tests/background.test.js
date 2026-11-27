'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadBackground } = require('./helpers');

test('les lignes cachées (souvenirs, lore, sujet à suivre) ne sont jamais lues', () => {
  const bg = loadBackground();
  bg.__raw = "A: Je l'ai vu en 1998.\nB: Non !\nSOUVENIR A : a vu Blur en 1998\nLORE : Gégé a réparé la machine à café\nÀ SUIVRE : le concert de 1998";
  const r = bg.run('splitMemory(__raw)');
  assert.equal(r.spoken, "A: Je l'ai vu en 1998.\nB: Non !");
  assert.deepEqual(JSON.parse(JSON.stringify(r.mem)), { souvenirs: [{ who: 'A', text: 'a vu Blur en 1998' }], suivi: 'le concert de 1998', lore: ['Gégé a réparé la machine à café'] });
});

test('« B: Réponse : c’était faux ! » reste une vraie réplique, mais RÉPONSE : est cachée', () => {
  const bg = loadBackground();
  bg.__raw = "B: Réponse : c'était faux !\nRÉPONSE : le vrai fait";
  const r = bg.run('splitHidden(__raw)');
  assert.equal(r.spoken, "B: Réponse : c'était faux !");
  assert.equal(r.hidden.answer, 'le vrai fait');
});

test('réglages envoyés à chaque modèle Claude', () => {
  const bg = loadBackground();
  const opus = bg.run("adaptForModel({ max_tokens: 1200, thinking: { type: 'disabled' }, tool_choice: { type: 'tool', name: 'x' } }, 'claude-opus-5-5')");
  assert.equal(opus.thinking, undefined, 'Opus 5.5 : la réflexion ne se coupe pas');
  assert.equal(opus.output_config.effort, 'medium');
  assert.ok(opus.max_tokens >= 6000);
  assert.equal(opus.tool_choice.type, 'auto');
  assert.equal(bg.run("adaptForModel({}, 'claude-sonnet-5-5')").thinking.type, 'between_tools');
  assert.equal(bg.run("adaptForModel({}, 'claude-haiku-5-5')").thinking.type, 'disabled');
});

test('un modèle inconnu (réglage importé) est remplacé par le modèle par défaut', async () => {
  let sent = null;
  const bg = loadBackground({ settings: { model: 'claude-inexistant' }, apiKey: 'k', fakeText: false,
    fetch: async (url, init) => { sent = JSON.parse(init.body); return { ok: true, json: async () => ({ content: [] }) }; } });
  await bg.run('callClaude({ max_tokens: 10, messages: [] })');
  assert.equal(sent.model, 'claude-sonnet-5-5');
});

test('le garde-fou de dépenses tient avec des appels simultanés, et borne un plafond importé', async () => {
  const bg = loadBackground({ settings: { aiCap: '5' } });
  const r = await Promise.allSettled(Array.from({ length: 12 }, () => bg.run("paidGuard('announce')")));
  assert.equal(r.filter((x) => x.status === 'fulfilled').length, 5);
  bg.store.settings.aiCap = '99999';
  assert.equal(await bg.run("paidLimit('texte')"), 500);
  bg.store.settings = { aiPower: 'eco' };
  assert.equal(await bg.run("paidLimit('voix')"), 60);
});

test('consignes : partie fixe identique d’une annonce à l’autre (cache), partie variable à part', async () => {
  const bg = loadBackground();
  const call = (mem, emo) => bg.run(`writeAnnouncement({ kind: 'interlude', host: 'Jeff', cohost: 'Laeti', duo: true, turns: 4, tags: true, next: 'Song 2 de Blur',
    persona: { a: 'Ancien cadreur.', b: 'Ancienne ingé son.', relation: 'Il regarde, elle écoute.', memA: ${JSON.stringify(mem)}, memB: [] }, emotion: '${emo}' })`);
  await call(['a vu Blur en 1998'], 'expressif');
  await call(['a vu Blur en 1998', 'a un chat'], 'dechaine');
  const [s1, s2] = bg.__calls.map((c) => c.body.system);
  assert.equal(s1[0].text, s2[0].text);
  // 2.36 : cache d'une heure (une émission qui parle tous les trois titres ne relisait jamais le cache de 5 minutes).
  assert.deepEqual(JSON.parse(JSON.stringify(s1[0].cache_control)), { type: 'ephemeral', ttl: '1h' });
  assert.match(s1[0].text, /PERSONNALITÉ DE B/);
  assert.match(s1[0].text, /LEUR RELATION/);
  assert.match(s1[1].text, /a vu Blur/);
  assert.notEqual(s1[1].text, s2[1].text);
});

test('émission à deux : la partie fixe est la même en dialogue, pour A seul et pour B seule (un seul cache)', async () => {
  const bg = loadBackground();
  const base = "host: 'Jeff', cohost: 'Laeti', hostGender: 'homme', cohostGender: 'femme', style: 'pince', cohostStyle: 'chaleureux', next: 'Song 2 de Blur', persona: { a: 'Ancien cadreur.', b: 'Ancienne ingé son.', relation: 'Deux amis.', memA: ['a un chat'], memB: ['boit trop de thé'] }";
  await bg.run("writeAnnouncement({ kind: 'interlude', duo: true, turns: 4, " + base + ' })');
  await bg.run("writeAnnouncement({ kind: 'talkover', duo: false, solo: 'A', " + base + ' })');
  await bg.run("writeAnnouncement({ kind: 'talkover', duo: false, solo: 'B', " + base + ' })');
  const [duo, a, b] = bg.__calls.map((c) => c.body);
  assert.equal(duo.system[0].text, a.system[0].text);
  assert.equal(duo.system[0].text, b.system[0].text);
  assert.match(duo.system[0].text, /A = Jeff, un homme[^\n]*B = Laeti, une femme/);
  assert.match(duo.system[0].text, /PERSONNALITÉ DE A \(Jeff\)[\s\S]*PERSONNALITÉ DE B \(Laeti\)[\s\S]*LEUR RELATION/);
  // Qui parle est dit dans la demande, et les souvenirs des deux restent connus.
  assert.doesNotMatch(duo.messages[0].content, /PARLE SEUL/);
  assert.match(a.messages[0].content, /^CETTE FOIS, A PARLE SEUL : tu es Jeff/);
  assert.match(b.messages[0].content, /^CETTE FOIS, B PARLE SEULE : tu es Laeti/);
  assert.match(b.system[1].text, /CE QUE A A DÉJÀ RACONTÉ[\s\S]*a un chat[\s\S]*CE QUE B A DÉJÀ RACONTÉ[\s\S]*boit trop de thé/);
  // Émission à un seul animateur (ou invité au micro, sans la fiche du coanimateur) : les consignes d'avant.
  await bg.run("writeAnnouncement({ kind: 'talkover', host: 'Alex', next: 'X de Y', persona: { a: 'Fan de rock.' } })");
  const one = bg.__calls[3].body;
  assert.match(one.system[0].text, /^Tu es Alex, l'animateur de Mood DJ/);
  assert.match(one.system[0].text, /TA PERSONNALITÉ/);
  assert.doesNotMatch(one.messages[0].content, /PARLE SEUL/);
  // Émission qui ne parle qu'aux changements d'ambiance : aucun cache ne serait relu, on n'en écrit pas.
  await bg.run("writeAnnouncement({ kind: 'talkover', host: 'Alex', next: 'X de Y', sparse: true })");
  assert.equal(bg.__calls[4].body.system[0].cache_control, undefined);
});

test('un seul au micro : une étiquette « A: » ou un dialogue écrit par erreur ne passe pas à l’antenne', async () => {
  const say = async (reply, solo) => {
    const bg = loadBackground({ reply });
    return bg.run("writeAnnouncement({ kind: 'talkover', duo: false, solo: '" + solo + "', host: 'Jeff', cohost: 'Laeti', next: 'X de Y', persona: { a: 'Fiche A.', b: 'Fiche B.' } })");
  };
  assert.equal(await say('B: On enchaîne avec Blur, Song 2.', 'B'), 'On enchaîne avec Blur, Song 2.');
  assert.equal(await say('A: Bon, à toi.\nB: Merci. On enchaîne avec Blur, Song 2.', 'B'), 'Merci. On enchaîne avec Blur, Song 2.');
  assert.equal(await say('A: Pas mal, ce morceau. La suite, Blur.', 'A'), 'Pas mal, ce morceau. La suite, Blur.');
  assert.equal(await say('Sans étiquette : on enchaîne avec Blur.', 'A'), 'Sans étiquette : on enchaîne avec Blur.');
});

test('voix : une longue réplique est découpée aux phrases, plus jamais coupée en plein mot', async () => {
  const bg = loadBackground();
  const sentence = 'Voici une phrase assez longue pour remplir la chronique, avec ses virgules et son point final.';
  const long = Array(14).fill(sentence).join(' ');
  assert.ok(long.length > 1200);
  const parts = [...bg.run('splitSpeech(' + JSON.stringify(long) + ')')];
  assert.ok(parts.length >= 2);
  for (const x of parts) { assert.ok(x.length <= 700, x.length + ' caractères'); assert.match(x, /\.$/, 'chaque morceau finit sur une phrase entière'); }
  assert.equal(parts.join(' '), long, 'rien n’est perdu');
  assert.deepEqual([...bg.run("splitSpeech('Bonsoir à tous.')")], ['Bonsoir à tous.']);
  // Une phrase sans ponctuation, plus longue que la limite : coupée aux espaces, jamais au milieu d'un mot.
  const flat = Array(200).fill('mot').join(' ');
  const cut = [...bg.run('splitSpeech(' + JSON.stringify(flat) + ')')];
  assert.ok(cut.length >= 2 && cut.every((x) => x.length <= 700 && /^(mot ?)+$/.test(x)));
  assert.equal(cut.join(' '), flat);
});

test('taille des consignes d’une annonce en duo bien remplie : sous 40 000 signes', async () => {
  const bg = loadBackground();
  const long = (n) => 'x'.repeat(n);
  await bg.run(`writeAnnouncement({ kind: 'interlude', host: 'Jeff', cohost: 'Laeti', duo: true, turns: 6, tags: true, next: 'Song 2 de Blur', previous: 'Wonderwall de Oasis',
    facts: '${long(6000)}', persona: { a: '${long(2500)}', b: '${long(2500)}', storyA: '${long(2000)}', storyB: '${long(2000)}', relation: '${long(4000)}',
    memA: ${JSON.stringify(Array(12).fill('souvenir'))}, memB: ${JSON.stringify(Array(12).fill('souvenir'))} },
    lore: { text: '${long(1500)}', memories: ${JSON.stringify(Array(10).fill('événement'))} } })`);
  const b = bg.__calls[0].body;
  const size = b.system.map((x) => x.text).join('').length + b.messages[0].content.length;
  assert.ok(size < 40000, 'consignes trop longues : ' + size + ' signes');
});

test('mode Économe : modèle léger, pas de mémoire ; Pleine puissance : Opus', async () => {
  const bg = loadBackground();
  await bg.run("writeAnnouncement({ kind: 'talkover', host: 'Alex', next: 'X de Y', power: 'eco', persona: { a: 'fiche', memA: ['souvenir secret'] } })");
  await bg.run("writeAnnouncement({ kind: 'talkover', host: 'Alex', next: 'X de Y', power: 'max' })");
  assert.equal(bg.__calls[0].model, 'claude-haiku-5-5');
  assert.doesNotMatch(JSON.stringify(bg.__calls[0].body), /souvenir secret/);
  assert.equal(bg.__calls[1].model, 'claude-opus-5-5');
});

test('choix d’un animateur : réponse JSON entourée de texte, nettoyée et bornée', async () => {
  const bg = loadBackground({ reply: 'Voici : {"artiste": "Vangelis", "titre": "Blade Runner Blues", "energie": 9, "pourquoi": "la pluie <b>sur</b> L.A."} Bonne écoute' });
  const r = await bg.run("hostPick({ kind: 'coeur', name: 'Jeff', ambiance: 'Synthwave', styles: 'Électro', energy: 2 })");
  assert.equal(r.artist, 'Vangelis');
  assert.equal(r.title, 'Blade Runner Blues');
  assert.equal(r.energy, 5);
  assert.doesNotMatch(r.why, /[<>]/);
});

test('choix d’un animateur : une réponse sans JSON est refusée', async () => {
  const bg = loadBackground({ reply: 'Je ne sais pas.' });
  await assert.rejects(bg.run("hostPick({ kind: 'coeur', name: 'Jeff' })"));
});
