'use strict';
// Phrases toutes faites en anglais (radio dans une autre langue que le français, sans IA).
const test = require('node:test');
const assert = require('node:assert/strict');
const { contentSlice, core } = require('./helpers');

const C = core();
const pick = (a) => a[0];
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const code = contentSlice('\nfunction spokenTitle(', '\nfunction templateLine(') + contentSlice('\n// Phrases toutes faites en anglais', '\nfunction b64ToBuffer(') + contentSlice('\nfunction timeParts(', '\nfunction trendOf(');
const api = new Function('C', 'pick', 'cap', code + '; return { spokenTitle, templateLineEn, templateDuoEn, timeParts };')(C, pick, cap);

test('heure à l’anglaise', () => {
  assert.equal(api.timeParts(new Date(2026, 0, 1, 14, 5)).timeEn, '2:05 PM');
  assert.equal(api.timeParts(new Date(2026, 0, 1, 0, 0)).timeEn, '12 AM');
  assert.equal(api.timeParts(new Date(2026, 0, 1, 9, 30)).greetEn, 'Good morning');
});

test('titre dit sans « (Remastered) »', () => {
  assert.equal(api.spokenTitle('Wonderwall (Remastered)'), 'Wonderwall');
});

test('annonces en anglais, sans mot français', () => {
  const tp = api.timeParts(new Date(2026, 0, 1, 20, 15));
  const c = { host: 'Alex', cohost: 'Sam', listener: '', greetEn: tp.greetEn, timeEn: tp.timeEn, part: 'soirée', ambianceEn: 'rock · evening', weatherEn: '12 degrees in Brest, rain',
    prev: { title: 'Wonderwall', artist: 'Oasis' }, next: { title: 'Song 2', artist: 'Blur' }, trend: 'monte' };
  for (const kind of ['intro', 'interlude', 'talkover']) {
    for (const text of [api.templateLineEn(kind, c), api.templateDuoEn(kind, c)]) {
      assert.match(text, /Song 2/);
      assert.doesNotMatch(text, /\b(avec|c'est|tu écoutes|il est|puis)\b/i, text);
    }
  }
});
