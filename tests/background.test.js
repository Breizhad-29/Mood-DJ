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
  assert.deepEqual(JSON.parse(JSON.stringify(s1[0].cache_control)), { type: 'ephemeral' });
  assert.match(s1[0].text, /PERSONNALITÉ DE B/);
  assert.match(s1[0].text, /LEUR RELATION/);
  assert.match(s1[1].text, /a vu Blur/);
  assert.notEqual(s1[1].text, s2[1].text);
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
