'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('./helpers').core();

test('rapprochement YouTube Music : la version studio passe avant le live, le karaoké et le remix', () => {
  const want = { artist: 'Blur', title: 'Song 2' };
  const items = [
    { videoId: 'live', title: 'Song 2 (Live at Glastonbury)', artists: ['Blur'], type: 'MUSIC_VIDEO_TYPE_OMV', duration: 130 },
    { videoId: 'karaoke', title: 'Song 2 (Karaoke Version)', artists: ['Karaoke Hits'], type: 'MUSIC_VIDEO_TYPE_ATV', duration: 122 },
    { videoId: 'studio', title: 'Song 2', artists: ['Blur'], type: 'MUSIC_VIDEO_TYPE_ATV', duration: 122 },
    { videoId: 'remix', title: 'Song 2 (Remix)', artists: ['Blur'], type: 'MUSIC_VIDEO_TYPE_ATV', duration: 200 }
  ];
  assert.equal(C.bestMatch(want, items).videoId, 'studio');
});

test('rapprochement : un autre artiste avec le même titre est refusé', () => {
  assert.equal(C.bestMatch({ artist: 'Blur', title: 'Song 2' }, [{ videoId: 'x', title: 'Song 2', artists: ['Someone Else'], type: 'MUSIC_VIDEO_TYPE_ATV', duration: 150 }]), null);
});

test('liste noire : un artiste banni ne passe pas, même en featuring ou sans « The »', () => {
  const banned = new Set([C.artistKey('The Black Eyed Peas')]);
  assert.ok(C.isBanned(banned, 'Black Eyed Peas'));
  assert.ok(C.isBanned(banned, 'Shakira feat. The Black Eyed Peas'));
  assert.ok(!C.isBanned(banned, 'Blur'));
});

test('choix du titre : jamais un titre déjà joué, banni ou en échec', () => {
  const t = (artist, title, energy) => ({ artist, title, energy, key: C.keyOf(artist, title) });
  const pool = [t('A', 'un', 3), t('B', 'deux', 3), t('C', 'trois', 3)];
  const ctx = { used: new Set([pool[0].key]), failed: new Set([pool[1].key]), banned: new Set(), target: 3 };
  assert.equal(C.pickTrack([pool], ctx).title, 'trois');
  ctx.banned = new Set([C.artistKey('C')]);
  assert.equal(C.pickTrack([pool], ctx), null);
});
