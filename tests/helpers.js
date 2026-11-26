// Mood DJ — outils communs aux tests (node --test tests/).
// background.js tourne dans un contexte vm avec un faux « chrome » : aucun appel réseau réel.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DIR = path.join(__dirname, '..', 'mood-dj');

function fakeChrome(store) {
  const deep = () => new Proxy(function () {}, { get: (t, k) => (k === 'then' ? undefined : k === 'id' ? 'test' : deep()), apply: () => deep() });
  const session = {};
  return new Proxy({}, {
    get: (t, k) => (k === 'storage'
      ? {
        local: { get: async () => store, set: async (o) => Object.assign(store, o) },
        session: { get: async (k2) => ({ [k2]: session[k2] }), set: async (o) => Object.assign(session, o) }
      }
      : deep())
  });
}

// Charge background.js. options.reply : texte renvoyé par la fausse IA ; options.fetch : faux fetch.
function loadBackground(options) {
  const o = options || {};
  const store = { settings: Object.assign({}, o.settings || {}) };
  if (o.apiKey) store.apiKey = o.apiKey;
  const ctx = { chrome: fakeChrome(store), console, setTimeout, clearTimeout, URL, URLSearchParams, TextEncoder, atob, btoa, fetch: o.fetch || (async () => { throw new Error('pas de réseau dans les tests'); }) };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(DIR, 'background.js'), 'utf8'), ctx, { filename: 'background.js' });
  if (o.fakeText !== false) {
    ctx.__calls = [];
    ctx.__reply = o.reply || 'A: Bonsoir.\nB: Et voici la suite.';
    vm.runInContext("callText = async (body, model, opts) => { __calls.push({ body, model, opts }); return { content: [{ type: 'text', text: typeof __reply === 'function' ? __reply(body) : __reply }], stop_reason: 'end_turn', usage: __usage || {} }; }; var __usage = null;", ctx);
  }
  ctx.store = store;
  ctx.run = (code) => vm.runInContext(code, ctx);
  return ctx;
}

// Fichiers du panneau, dans l'ordre du manifest (ils partagent la même portée).
function contentFiles() {
  const m = JSON.parse(fs.readFileSync(path.join(DIR, 'manifest.json'), 'utf8'));
  const cs = m.content_scripts.find((c) => c.js.includes('content.js'));
  return cs.js;
}
// Extrait une suite de fonctions du panneau (entre deux repères) pour les tester seules.
function contentSlice(from, to) {
  const src = contentFiles().map((f) => fs.readFileSync(path.join(DIR, f), 'utf8')).join('\n');
  const i = src.indexOf(from);
  const j = src.indexOf(to, i);
  if (i < 0 || j < 0) throw new Error('repère introuvable dans le panneau : ' + from);
  return src.slice(i, j);
}

module.exports = { DIR, loadBackground, contentSlice, contentFiles, core: () => require(path.join(DIR, 'core.js')) };
