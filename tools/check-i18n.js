#!/usr/bin/env node
// Mood DJ — vérifie que la version anglaise suit la version française.
// Lancé à chaque envoi sur GitHub (.github/workflows/i18n.yml), ou à la main : node tools/check-i18n.js
//
// Erreurs (le contrôle échoue) :
//  - un texte français de l'interface (panneau, télécommande, page des clés) sans traduction dans i18n-en.js ;
//  - legal.html et legal.en.html qui n'ont plus la même structure (sections, listes, tableau, liens).
// Avertissements (le contrôle passe) :
//  - GUIDE-EN.md qui annonce une autre version que manifest.json : le guide est peut-être à relire.
'use strict';
const fs = require('fs');
const path = require('path');

const DIR = process.env.MDJ_DIR || path.join(__dirname, '..', 'mood-dj');
const read = (f) => fs.readFileSync(path.join(DIR, f), 'utf8');
const errors = [];
const warnings = [];

// Dictionnaire français → anglais de l'interface.
const sandbox = {};
new Function('sandbox', read('i18n-en.js').replace(/\bvar MDJ_I18N_EN\b/, 'sandbox.D'))(sandbox);
const DICT = sandbox.D || {};
const known = (s) => DICT[s] !== undefined || DICT[s.trim()] !== undefined;
// Un texte « français » : un accent, ou un petit mot courant. Les noms identiques dans les deux langues
// (« Mood DJ », « Volume ») ne sont pas signalés.
const FRENCH = /[éèàçùâêîôûëïœ]|\b(le|la|les|des|du|un|une|et|ou|pour|avec|sur|dans|pas|au|aux|ton|ta|tes)\b/i;

// 1. Textes du panneau (content.js) : toast('…'), h('tag', {…}, '…'), title / placeholder / aria-label.
const unquote = (q) => q.slice(1, -1).replace(/\\(['"\\])/g, '$1');
const RE_JS = /(?:toast\(|\bh\('[a-z0-9]+',\s*(?:\{[^{}]*\}|null),\s*|(?:\btitle|\bplaceholder|'aria-label'):\s*)('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*")/g;
for (const f of ['content.js', 'popup.js', 'options.js']) {
  const src = read(f);
  const seen = new Set();
  let m;
  while ((m = RE_JS.exec(src))) {
    const s = unquote(m[1]);
    if (seen.has(s) || s.trim().length < 3 || !FRENCH.test(s) || known(s)) continue;
    seen.add(s);
    const line = src.slice(0, m.index).split('\n').length;
    errors.push(`${f}:${line} : texte sans traduction anglaise dans i18n-en.js : « ${s} »`);
  }
}

// 2. Textes des pages de l'extension (télécommande, clés API).
for (const f of ['popup.html', 'options.html']) {
  const html = read(f).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, '');
  const texts = [...html.matchAll(/>([^<>]+)</g)].map((m) => m[1])
    .concat([...html.matchAll(/\s(?:title|placeholder|aria-label|alt)="([^"]+)"/g)].map((m) => m[1]))
    .map((s) => s.replace(/\s+/g, ' ').trim());
  for (const s of new Set(texts)) {
    if (s.length >= 3 && FRENCH.test(s) && !known(s)) errors.push(`${f} : texte sans traduction anglaise dans i18n-en.js : « ${s} »`);
  }
}

// 3. Mentions légales : même structure en français et en anglais.
function shape(html) {
  const count = (re) => (html.match(re) || []).length;
  return {
    sections: [...html.matchAll(/<section[^>]*id="([^"]+)"/g)].map((m) => m[1]).join(', '),
    'titres h2': count(/<h2\b/g),
    'titres h3': count(/<h3\b/g),
    'éléments de liste': count(/<li\b/g),
    'lignes de tableau': count(/<tr\b/g),
    'liens externes': [...html.matchAll(/href="(https?:[^"]+)"/g)].map((m) => m[1].replace(/deed\.[a-z]+$/, 'deed')).sort().join(' ')
  };
}
if (!fs.existsSync(path.join(DIR, 'legal.en.html'))) {
  errors.push('legal.en.html est absent.');
} else {
  const fr = shape(read('legal.html'));
  const en = shape(read('legal.en.html'));
  for (const k of Object.keys(fr)) {
    if (fr[k] !== en[k]) errors.push(`Mentions légales : ${k} différents entre legal.html et legal.en.html (${k === 'liens externes' || k === 'sections' ? 'à comparer' : fr[k] + ' contre ' + en[k]}). Mets à jour legal.en.html.`);
  }
}

// 4. Guide anglais : version annoncée.
const version = JSON.parse(read('manifest.json')).version;
if (!fs.existsSync(path.join(DIR, 'GUIDE-EN.md'))) {
  warnings.push('GUIDE-EN.md est absent.');
} else {
  const m = read('GUIDE-EN.md').match(/version (\d+\.\d+(?:\.\d+)?)/i);
  if (!m) warnings.push('GUIDE-EN.md n\'indique pas la version qu\'il décrit (« Up to date with version X.Y.Z »).');
  else if (m[1] !== version) warnings.push(`GUIDE-EN.md décrit la version ${m[1]}, l'extension est en ${version} : relis le guide anglais et mets à jour son numéro de version.`);
}

for (const w of warnings) console.log('⚠️  ' + w);
for (const e of errors) console.log('❌ ' + e);
if (errors.length) {
  console.log(`\n${errors.length} problème(s) de traduction.`);
  process.exit(1);
}
console.log(`✅ Traduction anglaise à jour (${Object.keys(DICT).length} textes dans le dictionnaire, version ${version}).`);
