'use strict';
// 2.36 : le minutage des annonces. Le texte et la voix sont préparés séparément (la voix seulement en fin de
// titre), et la voix part d'autant plus tôt sur la fin du titre qu'elle est longue.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadPanel } = require('./helpers');

// Une fausse voix : un WAV de la durée voulue (16 bits mono, 24 kHz), en base64.
function wavB64(seconds) {
  const n = Math.round(seconds * 24000) * 2;
  const b = Buffer.alloc(44 + n);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n, 4); b.write('WAVE', 8); b.write('fmt ', 12); b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(24000, 24); b.writeUInt32LE(48000, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write('data', 36); b.writeUInt32LE(n, 40);
  return b.toString('base64');
}

test('voix sur le fondu : elle part d’autant plus tôt qu’elle est longue, sans couvrir plus de 22 s du titre', () => {
  const p = loadPanel();
  const lead = (sec, fade) => p.run('fadeVoiceLead(' + fade + ', { audio: b64ToBuffer(' + JSON.stringify(wavB64(sec)) + ') })');
  assert.equal(lead(8, 6), 8.5, 'annonce courte : comme avant, 8,5 s avant la fin');
  assert.equal(lead(20, 6), 12, '20 s de voix : 12 s sur la fin du titre, 8 s sur le suivant');
  assert.equal(lead(30, 6), 18);
  assert.equal(lead(50, 6), 22, 'plafond : jamais plus des 22 dernières secondes');
  assert.equal(lead(8, 12), 14.5, 'un long fondu garde son avance');
  // Voix de l'ordinateur (pas de fichier) : durée estimée d'après le texte, 2,6 mots par seconde.
  const words = Array(52).fill('mot').join(' ');
  assert.equal(p.run('voiceSeconds({ text: ' + JSON.stringify(words) + ' })'), 20);
  assert.equal(p.run('fadeVoiceLead(6, { text: ' + JSON.stringify(words) + ' })'), 12);
});

test('annonce préparée à l’avance : le texte d’abord, la voix seulement quand on la demande, une seule fois', async () => {
  const p = loadPanel();
  p.run('var __calls = []; var __wav = ' + JSON.stringify(wavB64(6)) + ';' +
    "claude = async (action, payload) => { __calls.push(action); return action === 'announce' ? 'A: Bon, on enchaîne.\\nB: Avec Blur, Song 2.' : action === 'gemini-tts' ? { b64: __wav } : {}; };" +
    // Pas de recherche d'anecdotes ici : dans ce faux navigateur, les délais d'attente ne se déclenchent jamais.
    "factsFor = async () => ({ text: '', src: '' }); genreFacts = async () => null;" +
    "hasKey = true; hasClaude = true; hasGemini = true; hasGemini1 = true;" +
    "Object.assign(settings, { radio: true, claudeAnnounce: true, voiceEngine: 'gemini', duo: true, programme: false, radioFreq: 'every', guestFreq: 'off', hostPicks: 'off', loreLevel: 'off', hostName: 'Jeff', cohostName: 'Laeti' });" +
    "var __next = { key: 'blur-song2', title: 'Song 2', artist: 'Blur', energy: 4 }; var __prev = { key: 'oasis-w', title: 'Wonderwall', artist: 'Oasis', energy: 2 };" +
    "var __s = { id: 's1', sel: clone(DEFAULT_SEL), queue: [__next], played: [__prev], lastLines: [], startedAt: Date.now(), transitions: 1 };");
  const ann = await p.run("prepareAnnouncement(__s, 'interlude', __prev, __next, Date.now() + 60000, { voice: 'later' })");
  assert.deepEqual([...p.run('__calls')], ['announce'], 'aucune voix fabriquée à la préparation');
  assert.equal(ann.voiced, false);
  assert.equal(ann.audio, null);
  assert.match(ann.text, /Song 2/);
  assert.match(ann.info, /voix à venir/);
  // Demandée de deux endroits à la fois (la fin du titre approche, puis l'enchaînement) : une seule fabrication.
  const [a, b] = await Promise.all([ann.voice(), ann.voice()]);
  assert.equal(a, b);
  assert.deepEqual([...p.run('__calls')], ['announce', 'gemini-tts']);
  assert.equal(ann.voiced, true);
  assert.ok(ann.audio && ann.audio.byteLength > 1000);
  assert.match(ann.info, /Gemini en duo/);
  assert.equal(p.run('voiceSeconds')(ann), 6);
  // Sans l'option, tout est prêt d'un coup, comme avant (exemples des Réglages, annonce faite au dernier moment).
  const full = await p.run("prepareAnnouncement(__s, 'talkover', __prev, __next, Date.now())");
  assert.equal(full.voiced, true);
});
