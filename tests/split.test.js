'use strict';
// Le panneau est découpé en plusieurs fichiers qui partagent la même portée. Ce test les charge dans
// l'ordre du manifest, avec un faux navigateur : si un fichier utilise au chargement quelque chose qui
// n'est défini que dans un fichier suivant (ou mal rangé), il échoue ici plutôt que chez l'auditeur.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { DIR, contentFiles } = require('./helpers');

function fakeBrowser() {
  const deep = () => new Proxy(function () {}, { get: (t, k) => (k === 'then' ? undefined : k === Symbol.toPrimitive ? () => '' : deep()), apply: () => deep(), construct: () => deep() });
  const listeners = [];
  const ctx = {
    console, URL, URLSearchParams, TextEncoder, TextDecoder, atob, btoa, Promise, Date, Math, JSON,
    setTimeout: () => 0, clearTimeout: () => {}, setInterval: () => 0, clearInterval: () => {},
    chrome: deep(), navigator: { language: 'fr-FR' }, location: { origin: 'https://music.youtube.com', href: 'https://music.youtube.com/' },
    document: { body: null, readyState: 'loading', addEventListener: (t, f) => listeners.push(t), createElement: () => deep(), documentElement: deep(), hidden: false },
    speechSynthesis: deep(), SpeechSynthesisUtterance: function () {}, performance: { now: () => 0 }
  };
  ctx.window = ctx;
  ctx.addEventListener = (t) => listeners.push(t);
  ctx.postMessage = () => {};
  vm.createContext(ctx);
  return { ctx, listeners };
}

test('le manifest charge tous les fichiers du panneau, content.js en dernier', () => {
  const files = contentFiles();
  const mdj = fs.readdirSync(DIR).filter((f) => /^mdj-.*\.js$/.test(f));
  for (const f of mdj) assert.ok(files.includes(f), f + ' absent du manifest');
  assert.equal(files[files.length - 1], 'content.js');
});

test('les fichiers du panneau se chargent dans l’ordre du manifest sans erreur', () => {
  const { ctx, listeners } = fakeBrowser();
  for (const f of contentFiles()) {
    assert.doesNotThrow(() => vm.runInContext(fs.readFileSync(path.join(DIR, f), 'utf8'), ctx, { filename: f }), f);
  }
  assert.ok(listeners.includes('DOMContentLoaded'), 'le démarrage attend la page');
  assert.equal(typeof vm.runInContext('typeof render', ctx), 'string');
  assert.equal(vm.runInContext('typeof render', ctx), 'function');
});
