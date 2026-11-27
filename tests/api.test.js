'use strict';
// Communication avec les IA : réponses structurées, nouvel essai, consommation, schémas pour Gemini.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadBackground } = require('./helpers');

const TOOL = { name: 'proposer_titres', description: 'Renvoie la liste.', input_schema: { type: 'object', properties: { titres: { type: 'array', items: { type: 'object', properties: { titre: { type: 'string' }, energie: { type: 'integer', minimum: 1, maximum: 5 } }, required: ['titre'] } } }, required: ['titres'] } };

test('Sonnet et Opus 5.5 : l’outil forcé devient une réponse JSON au schéma strict', () => {
  const bg = loadBackground();
  bg.__tool = TOOL;
  for (const model of ['claude-sonnet-5-5', 'claude-opus-5-5']) {
    const b = bg.run(`adaptForModel({ max_tokens: 4000, system: 'Programmateur.', tools: [__tool], tool_choice: { type: 'tool', name: 'proposer_titres' } }, '${model}')`);
    assert.equal(b.tools, undefined);
    assert.equal(b.tool_choice, undefined);
    assert.equal(b.asTool, 'proposer_titres');
    assert.equal(b.output_config.format.type, 'json_schema');
    const s = b.output_config.format.schema;
    assert.equal(s.additionalProperties, false);
    assert.equal(s.properties.titres.items.additionalProperties, false);
    assert.equal(s.properties.titres.items.properties.energie.minimum, undefined, 'bornes retirées');
    assert.match(b.system, /JSON/);
    assert.ok(!('asTool' in JSON.parse(JSON.stringify(b))), 'le marqueur ne part pas vers l’API');
  }
  // Haiku accepte encore l'outil forcé : inchangé.
  const h = bg.run(`adaptForModel({ tools: [__tool], tool_choice: { type: 'tool', name: 'proposer_titres' } }, 'claude-haiku-5-5')`);
  assert.equal(h.tool_choice.type, 'tool');
});

test('la réponse JSON est rendue sous forme d’appel d’outil, comme avant', async () => {
  let sent = null;
  const bg = loadBackground({ settings: { model: 'claude-sonnet-5-5' }, apiKey: 'k', fakeText: false,
    fetch: async (url, init) => { sent = JSON.parse(init.body); return { ok: true, status: 200, json: async () => ({ model: 'claude-sonnet-5-5', content: [{ type: 'text', text: '{"titres":[{"titre":"Song 2","energie":4}]}' }], usage: { input_tokens: 1000, output_tokens: 200 } }) }; } });
  bg.__tool = TOOL;
  const data = await bg.run("callClaude({ max_tokens: 4000, system: 'x', tools: [__tool], tool_choice: { type: 'tool', name: 'proposer_titres' }, messages: [] })");
  assert.ok(sent.output_config.format);
  assert.equal(data.content[0].type, 'tool_use');
  assert.equal(data.content[0].input.titres[0].titre, 'Song 2');
});

test('Claude surchargé (529) : un seul nouvel essai, puis la réponse', async () => {
  let n = 0;
  const bg = loadBackground({ apiKey: 'k', fakeText: false,
    fetch: async () => { n++; return n === 1 ? { ok: false, status: 529, json: async () => ({ error: { message: 'Overloaded' } }) } : { ok: true, status: 200, json: async () => ({ content: [{ type: 'text', text: 'ok' }] }) }; } });
  const data = await bg.run('callClaude({ max_tokens: 10, messages: [] })');
  assert.equal(n, 2);
  assert.equal(data.content[0].text, 'ok');
});

test('consommation du jour : coût estimé de Claude d’après l’usage renvoyé', async () => {
  const bg = loadBackground({ apiKey: 'k', fakeText: false,
    fetch: async () => ({ ok: true, status: 200, json: async () => ({ model: 'claude-sonnet-5-5', content: [], usage: { input_tokens: 1000000, output_tokens: 100000, cache_read_input_tokens: 1000000 } }) }) });
  await bg.run('callClaude({ max_tokens: 10, messages: [] })');
  await new Promise((r) => setTimeout(r, 20));
  const u = bg.store.aiUsage;
  assert.equal(u.claudeCalls, 1);
  assert.ok(Math.abs(u.claudeUsd - (2 + 1 + 0.1)) < 1e-9, 'Sonnet : 1 M en entrée (2 $) + 0,1 M en sortie (1 $) + 1 M lus en cache (0,10 $)');
});

test('Gemini : un schéma demandé devient une réponse JSON imposée', () => {
  const bg = loadBackground();
  const g = bg.run("geminiTextBody({ max_tokens: 600, messages: [{ role: 'user', content: 'x' }], output_config: { format: { type: 'json_schema', schema: PICK_SCHEMA } } }, false)");
  assert.equal(g.generationConfig.responseMimeType, 'application/json');
  assert.equal(g.generationConfig.responseSchema.type, 'OBJECT');
  assert.deepEqual(Object.keys(g.generationConfig.responseSchema.properties), ['artiste', 'titre', 'energie', 'pourquoi']);
});

test('choix d’un animateur : schéma JSON, énergie visée et choix précédents (zappé ou non) envoyés', async () => {
  const bg = loadBackground({ reply: '{"artiste":"Vangelis","titre":"Blade Runner Blues","energie":2,"pourquoi":"la pluie"}' });
  await bg.run("hostPick({ kind: 'coeur', name: 'Jeff', energy: 2, history: [{ title: 'Tears in Rain de Vangelis', skipped: true }, { title: 'Nightcall de Kavinsky', skipped: false }] })");
  const body = bg.__calls[0].body;
  assert.equal(body.output_config.format.schema.additionalProperties, false);
  assert.match(body.messages[0].content, /énergie autour de 2 sur 5/);
  assert.match(body.messages[0].content, /Tears in Rain de Vangelis » : zappé/);
  assert.match(body.messages[0].content, /Nightcall de Kavinsky » : écouté jusqu’au bout/);
});

test('annonce après un choix zappé : l’animateur encaisse', async () => {
  const bg = loadBackground();
  await bg.run("writeAnnouncement({ kind: 'talkover', host: 'Laeti', cohost: 'Jeff', duo: true, turns: 3, next: 'X de Y', hostPickAfter: { who: 'B', name: 'Jeff', kind: 'coeur', why: '', skipped: true } })");
  // 2.35 : l'animateur encaisse toujours, mais sans désigner l'auditeur (les animateurs parlent à tous les auditeurs).
  assert.match(bg.__calls[0].body.messages[0].content, /écourté à l’antenne/);
  assert.doesNotMatch(bg.__calls[0].body.messages[0].content, /l’auditeur l’a zappé/);
});
