// Mood DJ — télécommande (fenêtre de l'icône de l'extension).
'use strict';

const $ = (id) => document.getElementById(id);
const ICONS = {
  play: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg>',
  pause: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"></path></svg>',
  heart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"></path></svg>',
  heartOn: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"></path></svg>',
  vol: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"></path></svg>',
  mute: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9zM16 9l5 6M21 9l-5 6"></path></svg>'
};

const fmt = (sec) => {
  sec = Math.max(0, Math.round(Number(sec) || 0));
  return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
};

let tab = null;
let state = null;
let dragging = false;
let lastVolume = 80;

async function findTab() {
  const tabs = await chrome.tabs.query({ url: 'https://music.youtube.com/*' });
  return tabs.find((t) => t.audible) || tabs.find((t) => t.active) || tabs[0] || null;
}

async function send(cmd, value) {
  if (!tab) tab = await findTab();
  if (!tab) return null;
  try {
    return await chrome.tabs.sendMessage(tab.id, { type: 'mdj-remote', cmd, value });
  } catch (e) {
    return null;
  }
}

function setIcon(el, name) {
  if (el.dataset.icon === name) return;
  el.dataset.icon = name;
  el.innerHTML = ICONS[name];
}

function show(st) {
  state = st;
  const has = !!(st && tab);
  $('none').hidden = has;
  $('player').hidden = !has;
  if (!has) {
    $('status').textContent = tab ? 'Actualise YouTube Music' : '';
    $('none').querySelector('p').textContent = tab
      ? "Mood DJ ne répond pas dans l'onglet YouTube Music : actualise la page."
      : "YouTube Music n'est ouvert dans aucun onglet.";
    $('open').textContent = tab ? "Aller à l'onglet" : 'Ouvrir YouTube Music';
    return;
  }
  const s = st.session;
  $('status').textContent = st.ad ? 'Publicité' : s ? ({ playing: 'DJ en cours', preparing: 'Préparation…', suspended: 'DJ en pause', ending: 'Fin…' }[s.status] || '') : 'Sans Mood DJ';
  $('title').textContent = st.title || 'Rien en lecture';
  $('artist').textContent = st.artist || '';
  $('next').textContent = s && s.next ? 'Ensuite : ' + s.next : (s ? s.label : '');
  const img = $('art');
  const src = st.videoId ? 'https://i.ytimg.com/vi/' + st.videoId + '/default.jpg' : '';
  if (img.dataset.src !== src) { img.dataset.src = src; if (src) img.src = src; else img.removeAttribute('src'); }
  if (!dragging) {
    $('seek').max = String(Math.max(1, Math.round(st.duration || 1)));
    $('seek').value = String(Math.round(st.time || 0));
    $('cur').textContent = fmt(st.time);
    $('vol').value = String(st.volume);
  }
  $('rem').textContent = st.duration ? '-' + fmt(st.duration - st.time) : '';
  setIcon($('toggle'), st.paused ? 'play' : 'pause');
  $('toggle').setAttribute('aria-label', st.paused ? 'Lecture' : 'Pause');
  setIcon($('like'), st.liked ? 'heartOn' : 'heart');
  $('like').setAttribute('aria-pressed', String(!!st.liked));
  setIcon($('mute'), st.volume ? 'vol' : 'mute');
  $('stop').hidden = !(s && s.status !== 'ended');
}

async function refresh() {
  if (dragging) return;
  show(await send('state'));
}

async function act(cmd, value) {
  const st = await send(cmd, value);
  if (st) show(st);
}

$('toggle').addEventListener('click', () => act('toggle'));
$('prev').addEventListener('click', () => act('prev'));
$('nextbtn').addEventListener('click', () => act('next'));
$('like').addEventListener('click', () => act('like'));
$('stop').addEventListener('click', () => act('stop'));
$('panel').addEventListener('click', async () => {
  if (!tab) return;
  await chrome.tabs.update(tab.id, { active: true });
  await chrome.windows.update(tab.windowId, { focused: true });
  await send('panel');
  window.close();
});
$('open').addEventListener('click', async () => {
  if (tab) {
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  } else {
    await chrome.tabs.create({ url: 'https://music.youtube.com/' });
  }
  window.close();
});

const seek = $('seek');
seek.addEventListener('pointerdown', () => { dragging = true; });
seek.addEventListener('input', () => { dragging = true; $('cur').textContent = fmt(Number(seek.value)); });
seek.addEventListener('change', async () => {
  await act('seek', Number(seek.value));
  dragging = false;
});

const vol = $('vol');
vol.addEventListener('pointerdown', () => { dragging = true; });
vol.addEventListener('input', () => { dragging = true; send('volume', Number(vol.value)); });
vol.addEventListener('change', () => {
  if (Number(vol.value) > 0) lastVolume = Number(vol.value);
  dragging = false;
});
$('mute').addEventListener('click', () => {
  const v = Number(vol.value);
  if (v > 0) { lastVolume = v; act('volume', 0); } else act('volume', lastVolume || 80);
});

(async () => {
  tab = await findTab();
  await refresh();
  setInterval(refresh, 700);
})();
