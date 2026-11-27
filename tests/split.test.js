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

// Le numéro affiché dans les Réglages et le journal (VERSION) était resté à 2.34.0 pendant toute la 2.35.
test('le même numéro de version partout : manifest, panneau, notes de version, guide anglais', () => {
  const version = JSON.parse(fs.readFileSync(path.join(DIR, 'manifest.json'), 'utf8')).version;
  assert.match(version, /^\d+\.\d+\.\d+$/);
  const etat = fs.readFileSync(path.join(DIR, 'mdj-etat.js'), 'utf8');
  assert.equal((etat.match(/const VERSION = '([^']+)';/) || [])[1], version, 'VERSION dans mdj-etat.js');
  const notes = fs.readFileSync(path.join(DIR, 'LISEZMOI.txt'), 'utf8');
  assert.ok(notes.split('\n')[0].endsWith('version ' + version), 'première ligne de LISEZMOI.txt');
  assert.ok(notes.includes('\n' + version + ' : '), 'notes de la version ' + version + ' dans LISEZMOI.txt');
  const guide = fs.readFileSync(path.join(DIR, 'GUIDE-EN.md'), 'utf8');
  assert.ok(guide.includes('Up to date with version ' + version + '.'), 'GUIDE-EN.md');
});
