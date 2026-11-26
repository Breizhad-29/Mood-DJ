// Mood DJ — panneau et moteur DJ (monde isolé de l’extension) : interface : bases, langue de l’interface, Mes ambiances, commandes, onglet Ambiance.
// Les fichiers mdj-*.js puis content.js sont chargés dans l’ordre du manifest et partagent la même portée :
// une fonction d’un fichier peut appeler celle d’un autre, mais le code exécuté au chargement ne doit
// utiliser que ce qui est défini dans les fichiers précédents (vérifié par tests/split.test.js).
'use strict';

// ======================================================== interface
let host = null;
let rootEl = null;
let panelEl = null;
let launchEl = null;
let toastEl = null;
let toastTimer = null;
let R = {};
let pendingRender = false;
const renderSoon = debounce(() => render(), 200);

function h(tag, props) {
  const el = document.createElement(tag);
  if (props) {
    for (const k of Object.keys(props)) {
      const v = props[k];
      if (v === null || v === undefined) continue;
      if (v === false && !k.startsWith('aria-')) continue;
      if (k === 'class') el.className = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'value') el.value = v;
      else if (k === 'hidden') el.hidden = !!v;
      else el.setAttribute(k, v === true ? '' : TR_ATTRS.has(k) ? tr(String(v)) : String(v));
    }
  }
  for (let i = 2; i < arguments.length; i++) append(el, arguments[i]);
  return el;
}
function append(el, c) {
  if (c === null || c === undefined || c === false) return;
  if (Array.isArray(c)) { for (const x of c) append(el, x); return; }
  el.appendChild(typeof c === 'string' ? document.createTextNode(tr(c)) : typeof c === 'number' ? document.createTextNode(String(c)) : c);
}

// ------------------------------------------------ langue de l'interface
// Le code est écrit en français ; en anglais, chaque texte affiché passe par tr() au moment où il
// est mis dans la page : correspondance exacte dans le dictionnaire (i18n-en.js), sinon les morceaux
// connus d'une phrase composée (« Prochaine intervention : » + « dans » + …) sont traduits un à un.
const I18N_EN = typeof MDJ_I18N_EN === 'object' && MDJ_I18N_EN ? MDJ_I18N_EN : {};
const TR_ATTRS = new Set(['title', 'placeholder', 'aria-label', 'alt', 'aria-valuetext']);
const I18N_GLUE = [
  [/Nouvel essai possible dans/g, 'Try again in'], [/\bdans (\d)/g, 'in $1'], [/\bles (\d+) /g, 'the $1 '], [/\b(\d+) titres\b/g, '$1 tracks'], [/\b(\d+) titre\b/g, '$1 track'],
  [/\btitres\b/g, 'tracks'], [/\ble titre\b/g, 'the track'], [/\bappels\b/g, 'calls'], [/\ben une heure\b/g, 'in one hour'],
  [/\ble maximum\b/g, 'the maximum'], [/\brevient\b/g, 'is back'],
  [/ et /g, ' and '], [/ ou /g, ' or '], [/ avec /g, ' with '], [/ pour /g, ' for '], [/ sur /g, ' on '], [/ puis /g, ' then '],
  [/\bjours?\b/g, (m) => (m === 'jour' ? 'day' : 'days')], [/\bminutes\b/g, 'minutes'], [/ à (\d)/g, ' at $1'], [/\baujourd’hui\b|\baujourd'hui\b/g, 'today'],
  [/\bdemain\b/g, 'tomorrow'], [/^Environ /g, 'About '], [/^Fin · /g, 'End · '], [/^Sur /g, 'Over '], [/^Cycle de /g, 'Cycle of '], [/ : /g, ': ']
];
const i18nCache = new Map();
let i18nFrags = null;
const uiLocale = () => (uiIsEnglish() ? 'en-GB' : 'fr-FR');
function uiIsEnglish() {
  const s = settings && settings.uiLang;
  if (s === 'en') return true;
  if (s === 'fr') return false;
  let l = '';
  try { l = chrome.i18n.getUILanguage(); } catch (e) { l = navigator.language || 'fr'; }
  return !/^fr/i.test(l || 'fr');
}
// force : traduit même si l'interface est en français (phrases de la radio en anglais).
function tr(s, force) {
  if (typeof s !== 'string' || !s || (!force && !uiIsEnglish())) return s;
  const hit = i18nCache.get(s);
  if (hit !== undefined) return hit;
  let out = I18N_EN[s];
  if (out === undefined) {
    const t = s.trim();
    if (t && t !== s && I18N_EN[t] !== undefined) out = s.replace(t, I18N_EN[t]);
  }
  if (out === undefined) {
    if (!i18nFrags) i18nFrags = Object.keys(I18N_EN).filter((k) => k.trim().length >= 4 && /[\s:·,.!?’']/.test(k.trim())).sort((a, b) => b.length - a.length);
    // Décennies : « années 80, 90 et 2000 » → « the 80s, 90s and 2000s ».
    out = s.replace(/([Aa])nnées ((?:\d{2,4})(?:(?:, | et )\d{2,4})*)/g,
      (m, a, l) => (a === 'A' ? 'The ' : 'the ') + l.replace(/\d{2,4}/g, '$&s').replace(/ et /g, ' and '));
    let hits = 0;
    for (const k of i18nFrags) if (out.includes(k)) { out = out.split(k).join(I18N_EN[k]); hits++; }
    // Petits mots de liaison restés entre les morceaux : seulement dans une phrase de l'interface déjà
    // reconnue (jamais dans un titre de chanson ou un nom d'artiste affiché seul).
    if (hits || out !== s) for (const [re, en] of I18N_GLUE) out = out.replace(re, en);
  }
  if (i18nCache.size > 6000) i18nCache.clear();
  i18nCache.set(s, out);
  return out;
}
const SVGNS = 'http://www.w3.org/2000/svg';
function sv(tag, attrs) {
  const el = document.createElementNS(SVGNS, tag);
  for (const k of Object.keys(attrs || {})) el.setAttribute(k, attrs[k]);
  for (let i = 2; i < arguments.length; i++) if (arguments[i]) el.appendChild(arguments[i]);
  return el;
}

function icon(name, size) {
  const z = String(size || 20);
  const base = { width: z, height: z, viewBox: '0 0 24 24', 'aria-hidden': 'true' };
  const stroke = Object.assign({ fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, base);
  switch (name) {
    case 'vinyl': return sv('svg', stroke, sv('circle', { cx: '12', cy: '12', r: '8.5' }), sv('circle', { cx: '12', cy: '12', r: '2.5' }), sv('path', { d: 'M12 5.5a6.5 6.5 0 0 1 6.5 6.5' }));
    case 'close': return sv('svg', stroke, sv('path', { d: 'M6 6l12 12M18 6L6 18' }));
    case 'expand': return sv('svg', stroke, sv('path', { d: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5' }));
    case 'shrink': return sv('svg', stroke, sv('path', { d: 'M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5' }));
    case 'sparkle': return sv('svg', Object.assign({ fill: 'currentColor' }, base), sv('path', { d: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z' }));
    case 'mic': return sv('svg', stroke, sv('rect', { x: '9', y: '3', width: '6', height: '11', rx: '3' }), sv('path', { d: 'M5 11a7 7 0 0 0 14 0M12 18v3' }));
    case 'x': return sv('svg', stroke, sv('path', { d: 'M7 7l10 10M17 7L7 17' }));
    case 'play': return sv('svg', Object.assign({ fill: 'currentColor' }, base), sv('path', { d: 'M8 5v14l11-7z' }));
    case 'pause': return sv('svg', Object.assign({ fill: 'currentColor' }, base), sv('path', { d: 'M7 5h4v14H7zM13 5h4v14h-4z' }));
    case 'prev': return sv('svg', Object.assign({ fill: 'currentColor' }, base), sv('path', { d: 'M6 5h2v14H6zM19 5v14L9 12z' }));
    case 'next': return sv('svg', Object.assign({ fill: 'currentColor' }, base), sv('path', { d: 'M16 5h2v14h-2zM5 5v14l10-7z' }));
    case 'heart': return sv('svg', stroke, sv('path', { d: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z' }));
    case 'heartOn': return sv('svg', Object.assign({ fill: 'currentColor' }, base), sv('path', { d: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z' }));
    case 'ban': return sv('svg', stroke, sv('circle', { cx: '12', cy: '12', r: '8.5' }), sv('path', { d: 'M6 6l12 12' }));
    case 'mixseed': return sv('svg', stroke, sv('circle', { cx: '12', cy: '12', r: '2.5' }), sv('path', { d: 'M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14' }));
    case 'thumbDown': return sv('svg', stroke, sv('path', { d: 'M10 15v4a3 3 0 0 0 3 3l4-9V2H5.7a2 2 0 0 0-2 1.7l-1.4 9a2 2 0 0 0 2 2.3zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3' }));
    case 'thumbDownOn': return sv('svg', Object.assign({ fill: 'currentColor' }, base), sv('path', { d: 'M10 15v4a3 3 0 0 0 3 3l4-9V2H5.7a2 2 0 0 0-2 1.7l-1.4 9a2 2 0 0 0 2 2.3zM18 2h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2z' }));
    case 'vol': return sv('svg', stroke, sv('path', { d: 'M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11' }));
    case 'mute': return sv('svg', stroke, sv('path', { d: 'M4 9v6h4l5 4V5L8 9zM16 9l5 6M21 9l-5 6' }));
    default: return sv('svg', base);
  }
}

// Dernier clic ou touche sur la page YouTube Music (hors panneau Mood DJ) : sert à savoir si
// un changement de titre vient de toi ou de YouTube Music.
let lastPageAction = 0;
const markPageAction = (e) => {
  try { if (host && e.composedPath && e.composedPath().includes(host)) return; } catch (err) { /* ignore */ }
  lastPageAction = Date.now();
};
document.addEventListener('pointerdown', markPageAction, true);
document.addEventListener('keydown', markPageAction, true);

function mountUi() {
  host = document.createElement('div');
  host.id = 'mooddj-host';
  host.setAttribute('data-version', VERSION);
  host.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;z-index:2147483000;';
  // Fermé : les scripts de la page YouTube Music ne peuvent pas lire le contenu du panneau.
  rootEl = host.attachShadow({ mode: 'closed' });
  const style = document.createElement('style');
  style.textContent = MDJ_CSS;
  rootEl.appendChild(style);
  const wrap = h('div', { class: 'root' });
  rootEl.appendChild(wrap);
  launchEl = h('button', { class: 'launch', type: 'button', title: 'Mood DJ', 'aria-label': 'Ouvrir Mood DJ', onclick: togglePanel }, icon('vinyl', 26));
  panelEl = h('aside', { class: 'panel', 'aria-label': 'Mood DJ' });
  panelEl.hidden = !settings.panelOpen;
  toastEl = h('div', { class: 'toast', role: 'status' });
  toastEl.hidden = true;
  wrap.appendChild(launchEl);
  wrap.appendChild(panelEl);
  wrap.appendChild(toastEl);
  // Les raccourcis clavier de YouTube Music ne doivent pas réagir quand on tape dans le panneau.
  for (const type of ['keydown', 'keyup', 'keypress']) host.addEventListener(type, (e) => e.stopPropagation());
  // YouTube Music écoute le clavier tout en haut de la page (espace = lecture/pause, Maj+N…) et voit
  // les touches tapées dans le panneau comme venant de la page. On les arrête dès le départ, au
  // niveau de la fenêtre : la saisie continue normalement (l'action par défaut n'est pas annulée),
  // et Entrée/Échap sont renvoyées au champ lui-même, sans ressortir du panneau.
  const guardKeys = (e) => {
    const path = e.composedPath ? e.composedPath() : [];
    if (!host || !path.includes(host)) return;
    e.stopImmediatePropagation();
    if (e.type === 'keydown' && e.isTrusted && (e.key === 'Enter' || e.key === 'Escape')) {
      // Panneau fermé (shadow root « closed ») : le chemin vu d'ici s'arrête à l'hôte.
      const t = path[0] !== host ? path[0] : (rootEl && rootEl.activeElement);
      if (t && t.dispatchEvent && t !== host) {
        t.dispatchEvent(new KeyboardEvent('keydown', {
          key: e.key, code: e.code, shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, altKey: e.altKey, metaKey: e.metaKey,
          bubbles: true, composed: false, cancelable: true
        }));
      }
    }
  };
  for (const type of ['keydown', 'keyup', 'keypress']) window.addEventListener(type, guardKeys, true);
  rootEl.addEventListener('focusout', () => {
    setTimeout(() => { if (pendingRender && !editingField()) { pendingRender = false; render(); } }, 50);
  });
  document.body.appendChild(host);
  setInterval(() => { if (!host.isConnected && document.body) document.body.appendChild(host); }, 2000);
  render();
}

let miniDragging = false;
let dragTimer = null;
function setDragging(on, delay) {
  clearTimeout(dragTimer);
  if (on) {
    miniDragging = true;
    dragTimer = setTimeout(() => setDragging(false, 0), 2500);
    return;
  }
  dragTimer = setTimeout(() => {
    miniDragging = false;
    if (pendingRender && !editingField()) { pendingRender = false; render(); }
  }, delay || 0);
}
function editingField() {
  if (miniDragging) return true;
  const a = rootEl && rootEl.activeElement;
  return !!(a && (a.tagName === 'INPUT' && ['text', 'password', 'time', 'search'].includes(a.type)));
}

function togglePanel() {
  panelEl.hidden = !panelEl.hidden;
  settings.panelOpen = !panelEl.hidden;
  saveSettings();
  render();
}

function toggleFull() {
  settings.panelFull = !settings.panelFull;
  saveSettings();
  render();
}

// Pleine page : on mesure la zone de contenu de YouTube Music (sous le bandeau du haut, à droite
// du menu de gauche, au-dessus du lecteur) et on y cale le panneau. Le menu de gauche peut être
// réduit ou agrandi à tout moment : la mesure est refaite régulièrement.
function visibleRect(sel) {
  for (const el of document.querySelectorAll(sel)) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && r.right > 0 && getComputedStyle(el).visibility !== 'hidden') return r;
  }
  return null;
}
function contentBox() {
  const nav = visibleRect('ytmusic-nav-bar, #nav-bar-background');
  const bar = visibleRect('ytmusic-player-bar');
  let left = 0;
  for (const sel of ['#guide-wrapper', 'ytmusic-guide-renderer', '#mini-guide', '#mini-guide-renderer']) {
    const r = visibleRect(sel);
    if (r && r.left < 40 && r.right < innerWidth / 2) left = Math.max(left, r.right);
  }
  const top = nav ? Math.max(0, nav.bottom) : 64;
  const bottom = hideBar() ? 0 : bar && bar.top < innerHeight ? Math.max(0, innerHeight - bar.top) : 72;
  return { top: Math.round(top), left: Math.round(left), bottom: Math.round(bottom) };
}
// En pleine page, la barre de lecture de YouTube Music peut être masquée : le mini-lecteur de
// Mood DJ la remplace. Elle reste en place (juste invisible) pour que ses boutons marchent encore.
const hideBar = () => !!settings.panelFull && settings.hideYtBar !== false && panelEl && !panelEl.hidden;
function setYtBarHidden(on) {
  if (on && !document.getElementById('mooddj-hidebar-style')) {
    const st = document.createElement('style');
    st.id = 'mooddj-hidebar-style';
    st.textContent = 'html.mooddj-hidebar ytmusic-player-bar, html.mooddj-hidebar #player-bar-background ' +
      '{ visibility: hidden !important; pointer-events: none !important; }';
    (document.head || document.documentElement).appendChild(st);
  }
  document.documentElement.classList.toggle('mooddj-hidebar', on);
}
let fullTimer = null;
let lastBox = '';
function placePanel() {
  if (!panelEl) return;
  const full = !!settings.panelFull && !panelEl.hidden;
  setYtBarHidden(hideBar());
  panelEl.classList.toggle('full', full);
  toastEl.classList.toggle('full', full);
  // Les menus de YouTube Music (trois points, ajout à une playlist…) doivent rester au-dessus.
  host.style.zIndex = full ? '2100' : '2147483000';
  if (!full) {
    if (lastBox) { panelEl.style.left = panelEl.style.top = panelEl.style.bottom = ''; lastBox = ''; }
    if (fullTimer) { clearInterval(fullTimer); fullTimer = null; }
    return;
  }
  const b = contentBox();
  const key = b.top + ',' + b.left + ',' + b.bottom;
  if (key !== lastBox) {
    lastBox = key;
    panelEl.style.top = b.top + 'px';
    panelEl.style.left = b.left + 'px';
    panelEl.style.bottom = b.bottom + 'px';
  }
  if (!fullTimer) fullTimer = setInterval(placePanel, 300);
}
addEventListener('resize', () => placePanel());

function setTab(t) {
  tab = t;
  render();
}

// Deux copies de Mood DJ dans Chrome (une ancienne version restée active, ou l'onglet pas
// rechargé après une mise à jour) : elles se disputeraient la lecture et les annonces.
let dupWarnedAt = 0;
function otherCopy() {
  if (!host) return null;
  const others = Array.from(document.querySelectorAll('#mooddj-host')).filter((x) => x !== host);
  return others.length ? (others[0].getAttribute('data-version') || 'ancienne') : null;
}
function checkDuplicate(force) {
  const v = otherCopy();
  if (!v || (!force && Date.now() - dupWarnedAt < 10 * 60000)) return !!v;
  dupWarnedAt = Date.now();
  const what = v === VERSION ? 'deux copies de la version ' + VERSION + ', chargées depuis deux dossiers'
    : v === 'ancienne' ? "une ancienne version et la " + VERSION : 'la version ' + v + ' et la ' + VERSION;
  dlog('session', 'deux copies de Mood DJ actives', { autre: v, celle_ci: VERSION });
  toast('Attention : deux Mood DJ tournent dans Chrome (' + what + '). Elles se disputent la lecture. ' +
    "Dans chrome://extensions, supprime ou désactive l'ancienne, puis recharge cet onglet.", null, 30000);
  return true;
}

function toast(msg, action, ms) {
  dlog('message', String(msg));
  if (!toastEl) return;
  toastEl.replaceChildren(h('div', { class: 'grow' }, msg));
  if (action) toastEl.appendChild(h('button', { type: 'button', onclick: () => { toastEl.hidden = true; action.fn(); } }, action.label));
  toastEl.classList.toggle('shift', !panelEl.hidden);
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, ms || 6000);
}

function render() {
  if (!panelEl) return;
  launchEl.classList.toggle('on', !!(session && session.status === 'playing'));
  launchEl.hidden = !panelEl.hidden;
  launchEl.setAttribute('aria-label', tr(panelEl.hidden ? 'Ouvrir Mood DJ' : 'Fermer Mood DJ'));
  toastEl.classList.toggle('shift', !panelEl.hidden);
  placePanel();
  if (panelEl.hidden) { R = {}; return; }
  if (editingField()) { pendingRender = true; return; }
  const oldBody = panelEl.querySelector('.body');
  const keepScroll = oldBody && panelEl.dataset.tab === tab ? oldBody.scrollTop : 0;
  R = {};
  let content;
  if (tab === 'encours') content = tabEnCours();
  else if (tab === 'son') content = tabSon();
  else if (tab === 'reglages') content = tabReglages();
  else if (tab === 'historique') content = tabHistorique();
  else content = tabAmbiance();
  panelEl.replaceChildren(header(), tabsBar(), ...content, miniPlayer());
  panelEl.dataset.tab = tab;
  const nb = panelEl.querySelector('.body');
  if (nb && keepScroll) nb.scrollTop = keepScroll;
  updateLive();
}

function statusText() {
  const s = session;
  if (!s) return 'Prêt';
  return { preparing: 'Préparation…', playing: 'En cours', suspended: 'En pause', ending: 'Fin…', ended: 'Terminé' }[s.status] || '';
}

function header() {
  return h('div', { class: 'head' },
    h('div', { class: 'brand' }, h('div', { class: 'logo' }, icon('vinyl', 18)), 'Mood DJ'),
    h('div', { class: 'row' },
      h('span', { class: 'status' }, statusText()),
      h('button', {
        class: 'iconbtn', type: 'button', onclick: toggleFull,
        title: settings.panelFull ? 'Revenir au panneau latéral' : 'Pleine page',
        'aria-label': settings.panelFull ? 'Revenir au panneau latéral' : 'Afficher Mood DJ en pleine page'
      }, icon(settings.panelFull ? 'shrink' : 'expand', 20)),
      h('button', { class: 'iconbtn', type: 'button', 'aria-label': 'Fermer le panneau', onclick: togglePanel }, icon('close', 20))));
}

function tabsBar() {
  const T = [['ambiance', 'Ambiance'], ['encours', 'En cours'], ['historique', 'Historique'], ['son', 'Son'], ['reglages', 'Réglages']];
  return h('nav', { class: 'tabs', 'aria-label': 'Onglets Mood DJ' },
    T.map(([id, label]) => h('button', {
      type: 'button', class: 'tab' + (tab === id ? ' on' : ''), 'aria-current': tab === id ? 'page' : null,
      onclick: () => setTab(id)
    }, label)));
}

function section(title, content) {
  return h('div', { class: 'section' }, h('h2', { class: 'label' }, title), content);
}

// Pleine page : les rubriques se rangent en colonnes (qui se replient si la fenêtre est étroite).
const isFull = () => !!settings.panelFull;
function cols() {
  const list = Array.from(arguments).filter((c) => c && (!Array.isArray(c) || c.some(Boolean)));
  return h('div', { class: 'cols n' + list.length }, list.map((c) => h('div', { class: 'col' }, c)));
}
const colTitle = (t) => h('div', { class: 'coltitle' }, t);
const card = (...kids) => h('div', { class: 'card' }, kids);
let regTab = 'emission';

function chips(options, current, onPick) {
  return h('div', { class: 'chips' }, options.map((o) => h('button', {
    type: 'button', class: 'chip' + (o[0] === current ? ' on' : ''), 'aria-pressed': String(o[0] === current),
    onclick: () => onPick(o[0])
  }, o[1])));
}

// Époques : plusieurs décennies peuvent être allumées en même temps.
function eraChips() {
  const list = C.eraList(sel.era);
  const isOn = (id) => (id === 'all' ? !list.length : list.includes(id));
  return h('div', { class: 'chips' }, C.ERAS.map((o) => h('button', {
    type: 'button', class: 'chip' + (isOn(o[0]) ? ' on' : ''), 'aria-pressed': String(isOn(o[0])),
    onclick: () => { sel.era = C.toggleEra(sel.era, o[0]); selChanged(); }
  }, o[1])));
}

function seg(options, current, onPick, label) {
  return h('div', { class: 'seg', role: 'group', 'aria-label': label || null }, options.map((o) => h('button', {
    type: 'button', class: o[0] === current ? 'on' : '', 'aria-pressed': String(o[0] === current), onclick: () => onPick(o[0])
  }, o[1])));
}

function switchBtn(label, value, onChange) {
  const btn = h('button', { type: 'button', class: 'switch', 'aria-label': label, 'aria-pressed': String(!!value) },
    h('span', { class: 'tr' }, h('span', { class: 'kn' })));
  btn.addEventListener('click', () => {
    const v = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', String(v));
    onChange(v, btn);
  });
  return btn;
}

function switchRow(title, desc, value, onChange) {
  const sw = switchBtn(title, value, onChange);
  const descEl = desc ? h('span', { class: 'muted' }, desc) : null;
  const row = h('div', { class: 'row' }, h('div', { class: 'swtext' }, h('span', { class: 'swtitle' }, title), descEl), sw);
  row._switch = sw;
  row._desc = descEl;
  return row;
}

function pill(text) {
  return text ? h('span', { class: 'pill' }, text) : null;
}

function energyBars(n) {
  return h('div', { class: 'ebars', role: 'img', 'aria-label': 'Énergie ' + n + ' sur 5' },
    [6, 9, 12, 15, 18].map((px, i) => h('span', { class: i < n ? 'on' : '', style: { height: px + 'px' } })));
}

function curveCard(selx, sess) {
  const path = sv('path', { d: C.curvePath(selx, 340, 80), fill: 'none', stroke: sess ? '#5a5a5a' : '#ff3b3b', 'stroke-width': '3', 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke' });
  R.curvePath = path;
  const svgEl = sv('svg', { width: '100%', height: '80', viewBox: '0 0 340 80', preserveAspectRatio: 'none', role: 'img', 'aria-label': "Courbe d'énergie" },
    sv('line', { x1: '0', y1: '70', x2: '340', y2: '70', stroke: '#3d3d3d', 'stroke-width': '1', 'vector-effect': 'non-scaling-stroke' }),
    sv('line', { x1: '0', y1: '40', x2: '340', y2: '40', stroke: '#2c2c2c', 'stroke-width': '1', 'stroke-dasharray': '4 4', 'vector-effect': 'non-scaling-stroke' }),
    sv('line', { x1: '0', y1: '10', x2: '340', y2: '10', stroke: '#2c2c2c', 'stroke-width': '1', 'stroke-dasharray': '4 4', 'vector-effect': 'non-scaling-stroke' }),
    path);
  // Repères de temps sous la courbe : petit trait au quart d'heure, moyen à la demi-heure, grand à l'heure.
  const total = curveMinutes(selx, sess);
  const tickLabels = h('div', { class: 'ticklabels', 'aria-hidden': 'true' });
  if (total > 0) {
    const xOf = (m) => 10 + (m / total) * 320;
    const every = total > 720 ? 60 : total > 360 ? 30 : 15;
    const labelEvery = total <= 60 ? 15 : total <= 180 ? 30 : total <= 480 ? 60 : 120;
    for (let m = every; m < total; m += every) {
      const big = m % 60 === 0;
      const mid = !big && m % 30 === 0;
      const len = big ? 9 : mid ? 6 : 3.5;
      svgEl.appendChild(sv('line', {
        x1: xOf(m).toFixed(1), y1: '70', x2: xOf(m).toFixed(1), y2: String(70 + len),
        stroke: big ? '#9a9a9a' : mid ? '#707070' : '#505050', 'stroke-width': big ? '1.5' : '1', 'vector-effect': 'non-scaling-stroke'
      }));
      if (m % labelEvery === 0 && total - m >= labelEvery / 2) {
        tickLabels.appendChild(h('span', { style: { left: (xOf(m) / 340 * 100).toFixed(2) + '%' } }, C.fmtDuration(m)));
      }
    }
  }
  if (sess) {
    R.markerLine = sv('line', { x1: '10', y1: '6', x2: '10', y2: '74', stroke: '#ffffff', 'stroke-width': '1.5', 'vector-effect': 'non-scaling-stroke' });
    svgEl.appendChild(R.markerLine);
  }
  R.curveLabel = h('span', { class: 'muted', style: { textAlign: 'right' } }, curveLabelText(selx));
  R.curveEnd = h('span', null, curveEndText(sess));
  // Dans l'onglet Ambiance, la courbe se modifie directement : on l'attrape où l'on veut et on la tire.
  const editor = sess ? null : curveEditor(svgEl);
  return h('div', { class: 'card' },
    h('div', { class: 'row' }, h('h2', { class: 'label white', style: { fontSize: '13px' } }, "Courbe d'énergie"), R.curveLabel),
    editor ? editor.wrap : svgEl,
    tickLabels.childNodes.length ? tickLabels : null,
    h('div', { class: 'scale' }, h('span', null, sess ? 'Joué' : 'Début'), R.curveEnd),
    sess ? null : h('div', { class: 'row' },
      h('span', { class: 'label' }, 'Pinceau'),
      seg(CURVE_BRUSHES.map((b) => [b[0], b[1]]), curveBrush()[0], (v) => { settings.curveBrush = v; saveSettings(); render(); },
        'Largeur de la zone de courbe déplacée')),
    sess ? null : h('div', { class: 'row' },
      h('span', { class: 'muted' }, C.hasCustomCurve(selx) ? 'Courbe personnalisée.' : 'Attrape la courbe où tu veux et tire-la vers le haut ou le bas ; glisse de côté pour la redessiner.'),
      C.hasCustomCurve(selx) ? h('button', {
        class: 'btn small', type: 'button',
        onclick: () => { sel.curve = null; selChanged(); toast('Courbe du moment « ' + C.momentById(sel.moment).label + ' » rétablie.', null, 3000); }
      }, 'Courbe du moment') : null));
}

// Durée couverte par la courbe, en minutes : la sélection fixe, sinon un cycle.
function curveMinutes(selx, sess) {
  if (sess) return sess.mode === 'fixe' ? (sess.targetSec || 0) / 60 : sess.span || C.cycleMinutes(selx);
  if (selx.mode === 'fixe') return selx.duration === 'until' ? C.minutesUntil(selx.until) : Number(selx.duration) || 90;
  return C.cycleMinutes(selx);
}

function curveLabelText(selx) {
  const mo = C.momentById(selx.moment);
  return C.hasCustomCurve(selx) ? mo.label + ' : courbe personnalisée' : mo.label + ' : ' + mo.desc;
}

// Édition libre de la courbe : on l'attrape n'importe où sur le fil et on la tire. La zone autour
// suit en douceur (largeur réglée par le « pinceau ») ; en glissant de côté, on la redessine.
// La courbe est gardée sur 48 points, ce qui suffit pour un tracé fin sans à-coups.
const CURVE_RES = 48;
const CURVE_BRUSHES = [['fin', 'Fin', 0.035], ['moyen', 'Moyen', 0.07], ['large', 'Large', 0.14]];
const curveBrush = () => CURVE_BRUSHES.find((b) => b[0] === settings.curveBrush) || CURVE_BRUSHES[1];
function curveEditor(svgEl) {
  const wrap = h('div', { class: 'curvedit', title: 'Attrape la courbe et tire-la' }, svgEl);
  const dot = h('div', { class: 'cdot' });
  dot.hidden = true;
  wrap.appendChild(dot);
  let lastP = null;
  const posOf = (ev) => {
    const r = wrap.getBoundingClientRect();
    const px = (ev.clientX - r.left) / r.width * 340;
    const py = (ev.clientY - r.top) / r.height * 80;
    return { p: Math.max(0, Math.min(1, (px - 10) / 320)), e: Math.max(1, Math.min(5, 1 + (70 - py) / 15)) };
  };
  const showDot = (p) => {
    lastP = p;
    const e = C.targetEnergy(sel, p);
    dot.style.left = ((10 + p * 320) / 340 * 100).toFixed(2) + '%';
    dot.style.top = (70 - (e - 1) * 15).toFixed(1) + 'px';
    dot.hidden = false;
  };
  const ensure = () => {
    sel.curve = C.hasCustomCurve(sel) && sel.curve.length === CURVE_RES ? sel.curve.slice() : C.resampleCurve(C.curvePattern(sel), CURVE_RES);
  };
  // Rapproche la courbe du point visé, à plein au centre, de moins en moins sur les côtés.
  const pull = (p, e) => {
    const base = Number(sel.energy) || 3;
    const diff = e - C.targetEnergy(sel, p);
    const sig = curveBrush()[2];
    for (let i = 0; i < CURVE_RES; i++) {
      const d = i / (CURVE_RES - 1) - p;
      const w = Math.exp(-(d * d) / (2 * sig * sig));
      sel.curve[i] = Math.round(Math.max(1 - base, Math.min(5 - base, sel.curve[i] + diff * w)) * 100) / 100;
    }
    updateCurve();
    showDot(p);
  };
  wrap.addEventListener('pointermove', (ev) => { if (!wrap.classList.contains('drag')) showDot(posOf(ev).p); });
  wrap.addEventListener('pointerleave', () => { if (!wrap.classList.contains('drag')) { dot.hidden = true; lastP = null; } });
  wrap.addEventListener('pointerdown', (ev) => {
    ev.preventDefault();
    setDragging(true);
    wrap.setPointerCapture(ev.pointerId);
    wrap.classList.add('drag');
    ensure();
    const a = posOf(ev);
    pull(a.p, a.e);
    const move = (me) => { setDragging(true); const q = posOf(me); pull(q.p, q.e); };
    const up = () => {
      wrap.removeEventListener('pointermove', move);
      wrap.removeEventListener('pointerup', up);
      wrap.removeEventListener('pointercancel', up);
      wrap.classList.remove('drag');
      saveSel();
      updateSummary();
      liveUpdate();
      setDragging(false, 300);
      render();
    };
    wrap.addEventListener('pointermove', move);
    wrap.addEventListener('pointerup', up);
    wrap.addEventListener('pointercancel', up);
  });
  R.curveHandles = () => { if (lastP !== null && !dot.hidden) showDot(lastP); };
  return { wrap };
}

function curveEndText(s) {
  if (s) {
    if (s.mode === 'fixe') return 'Fin · ' + C.fmtDuration(s.targetSec / 60);
    return s.loop ? 'Cycle de ' + C.fmtDuration(s.span) : 'Sur ' + C.fmtDuration(s.span);
  }
  if (sel.mode === 'fixe') {
    return 'Fin · ' + (sel.duration === 'until' ? sel.until : C.fmtDuration(Number(sel.duration) || 90));
  }
  const mo = C.momentById(sel.moment);
  const m = C.cycleMinutes(sel);
  return mo.loop ? 'Cycle de ' + C.fmtDuration(m) : 'Sur ' + C.fmtDuration(m);
}

function cycleNote(selx) {
  const mo = C.momentById(selx.moment);
  const m = C.cycleMinutes(selx);
  const auto = !selx.cycle || selx.cycle === 'auto';
  const base = mo.loop
    ? "La courbe d'énergie se répète toutes les " + C.fmtDuration(m) + '.'
    : "La courbe d'énergie se déroule sur " + C.fmtDuration(m) + ', puis reste à ce niveau.';
  return base + (auto ? ' Durée choisie selon le moment (' + mo.label.toLowerCase() + ').' : ' Court : ça varie vite. Long : changements plus progressifs.') +
    ' Durée indicative : le cycle suit les titres choisis et peut varier de quelques minutes.';
}

// Durée du cycle : une barre à faire glisser (de 10 min à 4 h, par pas plus fins pour les durées
// courtes), et un bouton « Auto » qui reprend la durée prévue pour le moment choisi.
const CYCLE_STEPS = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240];
function cycleChips(selx, onPick) {
  const auto = !selx.cycle || selx.cycle === 'auto';
  const span = C.momentById(selx.moment).span;
  const cur = auto ? span : Number(selx.cycle) || span;
  const nearest = (m) => CYCLE_STEPS.reduce((bi, v, i) => (Math.abs(v - m) < Math.abs(CYCLE_STEPS[bi] - m) ? i : bi), 0);
  const val = h('span', { class: 'label white' }, auto ? 'Auto · ' + C.fmtDuration(span) : C.fmtDuration(cur));
  const range = h('input', {
    type: 'range', class: 'cyclebar' + (auto ? ' auto' : ''), min: '0', max: String(CYCLE_STEPS.length - 1), step: '1', value: String(nearest(cur)),
    'aria-label': 'Durée du cycle', 'aria-valuetext': C.fmtDuration(cur),
    oninput: (e) => {
      const m = CYCLE_STEPS[Number(e.target.value)];
      val.textContent = C.fmtDuration(m);
      e.target.classList.remove('auto');
      e.target.setAttribute('aria-valuetext', C.fmtDuration(m));
    },
    onchange: (e) => onPick(String(CYCLE_STEPS[Number(e.target.value)]))
  });
  return h('div', { class: 'section', style: { gap: '6px' } },
    h('div', { class: 'row' }, val,
      h('button', {
        type: 'button', class: 'chip' + (auto ? ' on' : ''), 'aria-pressed': String(auto),
        title: 'Durée prévue pour le moment « ' + C.momentById(selx.moment).label + ' »', onclick: () => onPick('auto')
      }, 'Auto (' + C.fmtDuration(span) + ')')),
    range,
    h('div', { class: 'scale' }, h('span', null, '15 min'), h('span', null, '4 h')));
}

function updateCurve() {
  if (R.curvePath) R.curvePath.setAttribute('d', C.curvePath(sel, 340, 80));
  if (R.curveLabel) R.curveLabel.textContent = tr(curveLabelText(sel));
  if (R.curveHandles) R.curveHandles();
}

function summaryText() {
  let source = sel.prompt.trim() ? (hasKey ? 'proposés par l’IA' : 'catalogue intégré (clé API manquante)') : 'catalogue intégré';
  if (sel.source === 'likes') source = "tirés de tes J'aime" + (Number(sel.likesMix) ? ' + ' + sel.likesMix + ' similaire' + (sel.likesMix === '1' ? '' : 's') + ' pour 1' : '');
  else if (sel.source === 'similar') source = 'artistes similaires (YouTube Music)';
  else if (sel.era === 'actuel') source = 'nouveautés YouTube Music';
  if (sel.source === 'discover') source += ', sans tes J\'aime';
  if (sel.mode === 'fixe') {
    const min = sel.duration === 'until' ? C.minutesUntil(sel.until) : (Number(sel.duration) || 90);
    const n = Math.max(1, Math.round(min / 4));
    const dl = sel.duration === 'until' ? "jusqu'à " + sel.until + ' (' + C.fmtDuration(min) + ')' : C.fmtDuration(min);
    return 'Environ ' + n + ' titres · ' + dl + ' · ' + source;
  }
  return 'En continu · titres ' + source;
}
function updateSummary() {
  if (R.summary) R.summary.textContent = tr(summaryText());
}
function energyText() {
  return sel.energy + ' · ' + C.ENERGY_LABELS[sel.energy - 1];
}

function selChanged() {
  saveSel();
  render();
  liveUpdate();
}

// ------------------------------------------------------ Mes ambiances
function saveAmbiance(name) {
  const n = String(name || '').trim().slice(0, 40) || plainLabel(sel).slice(0, 40);
  const i = savedAmb.findIndex((a) => a.name.toLowerCase() === n.toLowerCase());
  const entry = { name: n, sel: clone(ambSnap(sel)), at: Date.now() };
  if (i >= 0) savedAmb[i] = entry;
  else {
    if (savedAmb.length >= 40) { toast('40 ambiances au plus : supprime-en une avant d’en ajouter.'); return; }
    savedAmb.push(entry);
  }
  store({ savedAmbiances: savedAmb });
  toast(i >= 0 ? 'Ambiance « ' + n + ' » mise à jour.' : 'Ambiance « ' + n + ' » enregistrée.', null, 3000);
  render();
}
function loadAmbiance(a) {
  sel = Object.assign(clone(sel), clone(ambSnap(a.sel)));
  selChanged();
  toast('Ambiance « ' + a.name + ' » chargée.', { label: 'Lancer', fn: () => startFromUi(false) }, 6000);
}
function deleteAmbiance(a) {
  savedAmb = savedAmb.filter((x) => x !== a);
  store({ savedAmbiances: savedAmb });
  toast('Ambiance « ' + a.name + ' » supprimée.', {
    label: 'Annuler', fn: () => { savedAmb.push(a); store({ savedAmbiances: savedAmb }); render(); }
  }, 6000);
  render();
}
function ambianceSection() {
  const nameIn = h('input', {
    class: 'input', id: 'mdj-ambname', type: 'text', maxlength: '40', placeholder: 'Nom, ex. ' + plainLabel(sel).slice(0, 30),
    onkeydown: (e) => { if (e.key === 'Enter') { e.preventDefault(); const v = nameIn.value; nameIn.blur(); saveAmbiance(v); } }
  });
  const current = savedAmb.find((a) => sameAmb(a.sel, sel));
  return h('div', { class: 'section' },
    h('h2', { class: 'label' }, 'Mes ambiances'),
    // Menu déroulant, classé par nom ; choisir une ambiance la charge aussitôt.
    savedAmb.length
      ? h('div', { class: 'row' },
        h('select', {
          class: 'select', id: 'mdj-ambpick', 'aria-label': 'Choisir une de mes ambiances',
          onchange: (e) => { const a = savedAmb[Number(e.target.value)]; if (a) loadAmbiance(a); }
        },
        current ? null : h('option', { value: '', selected: true, disabled: true }, 'Choisir une ambiance… (' + savedAmb.length + ')'),
        savedAmb.map((a, i) => [a, i]).sort((x, y) => x[0].name.localeCompare(y[0].name, 'fr'))
          .map(([a, i]) => h('option', { value: String(i), selected: a === current }, a.name + ' — ' + styleText(a.sel) + ', ' + C.momentById(a.sel.moment).label.toLowerCase()))),
        current ? h('button', { class: 'iconbtn', type: 'button', 'aria-label': 'Supprimer ' + current.name, title: 'Supprimer « ' + current.name + ' »', onclick: () => deleteAmbiance(current) }, icon('x', 18)) : null)
      : h('div', { class: 'muted' }, 'Règle une ambiance (style, moment, énergie…), donne-lui un nom et enregistre-la pour la retrouver d’un clic.'),
    h('div', { class: 'row' }, nameIn,
      h('button', { class: 'btn small', type: 'button', onclick: () => saveAmbiance(nameIn.value) }, 'Enregistrer')),
    savedAmb.length ? h('div', { class: 'muted' }, (current ? 'Réglages actuels : « ' + current.name + ' ». ' : '') +
      'Enregistrer sous un nom déjà pris met cette ambiance à jour.') : null);
}

function startFromUi(saveOnly) {
  if (starting) return;
  starting = true;
  startSession(clone(sel), { saveOnly: !!saveOnly })
    .catch((e) => toast('Erreur : ' + e.message))
    .finally(() => { starting = false; render(); });
}

// ---------------------------------------------------- commandes de lecture
function nowPlaying() {
  const cur = session && session.current;
  if (cur && ps.videoId === cur.videoId) return { videoId: cur.videoId, title: cur.title, artist: cur.artist, duration: cur.duration };
  return { videoId: ps.videoId || '', title: ps.title || '', artist: ps.author || '', duration: 0 };
}

function djActive() {
  return !!(session && session.status === 'playing');
}

// Au rechargement de la page, YouTube Music relance tout seul le dernier titre. Mood DJ le met
// en pause tant que tu n'as rien lancé toi-même (une sélection, une ambiance, Lecture, un clic
// dans YouTube Music), pour ne pas se mélanger avec la préparation d'une émission.
const PAGE_LOADED_AT = Date.now();
let autoplayGuardOn = true;
let autoplayBlocked = 0;
function autoplayGuard() {
  if (!autoplayGuardOn) return;
  if (settings.blockAutoplay === false || session || starting || Date.now() - PAGE_LOADED_AT > 45000 || lastPageAction > PAGE_LOADED_AT) {
    autoplayGuardOn = false;
    return;
  }
  if (ps.ad || ps.paused || !ps.videoId) return;
  autoplayBlocked++;
  callSafe('pause');
  if (autoplayBlocked === 1) dlog('session', 'lecture automatique de YouTube Music mise en pause au chargement', { titre: ps.title || '' });
}

const ctl = {
  toggle: () => {
    autoplayGuardOn = false;
    // Pendant la préparation de l'intro, « Lecture » ne se bat plus avec elle : on saute l'intro
    // et le premier titre démarre tout de suite.
    if (session && session.inIntro && session.status === 'playing') {
      radioLog(session, "Lecture demandée pendant la préparation : l'intro est sautée.");
      return skip();
    }
    return callSafe(ps.paused ? 'resume' : 'pause');
  },
  next: () => (djActive() ? skip() : callSafe('ytNext')),
  prev: () => (djActive() ? onUserPrev() : callSafe('ytPrev')),
  seek: (sec) => callSafe('seek', Math.max(0, Number(sec) || 0)),
  volume: (v) => callSafe('setVolume', v),
  like: () => toggleLike(),
  dislike: () => toggleDislike(),
  mix: () => mixFromTrack()
};

// « Mix de ce titre » : une nouvelle sélection en continu qui part de l'artiste du titre en cours
// et de ses artistes proches, avec le même style, sous-style et niveau d'énergie (le moment est gardé).
let mixing = false;
async function mixFromTrack() {
  const np = nowPlaying();
  if (!np.videoId || !np.artist) { toast('Aucun titre en cours pour lancer un mix.'); return; }
  if (mixing || starting) return;
  mixing = true;
  try {
    const cur = session && session.current && session.current.videoId === np.videoId ? session.current : null;
    let t = cur || trackFromItem({ v: np.videoId, t: np.title, a: np.artist });
    if (!t.tagged && !t.style && hasKey) {
      toast('Claude écoute « ' + np.title + ' » pour trouver son style…', null, 4000);
      await withTimeout(classify([t]), 9000).catch(() => null);
      t = trackFromItem({ v: np.videoId, t: np.title, a: np.artist });
    }
    const styleOk = t.style && C.STYLES.some((x) => x.id === t.style);
    const subOk = styleOk && t.sub && C.styleById(t.style).subs.some((x) => x[0] === t.sub);
    sel = Object.assign(clone(DEFAULT_SEL), {
      source: 'similar', mode: 'continu', moment: sel.moment, cycle: sel.cycle,
      style: styleOk ? t.style : 'all', sub: subOk ? t.style + '/' + t.sub : 'all',
      energy: Math.max(1, Math.min(5, Math.round(Number(t.energy) || Number(sel.energy) || 3))),
      seed: { artist: np.artist, title: np.title }
    });
    saveSel();
    dlog('session', 'mix de ce titre', { titre: np.title, artiste: np.artist, style: sel.style, sous: sel.sub, energie: sel.energy });
    const name = ('Dans l’esprit de ' + np.artist).slice(0, 40);
    toast('Mix dans l’esprit de ' + np.artist + ' – ' + np.title + ' : ' + styleText(sel) + ', énergie ' + sel.energy + '.',
      { label: 'Enregistrer', fn: () => saveAmbiance(name) }, 10000);
    startFromUi(false);
  } finally {
    mixing = false;
  }
}

// « Je n'aime pas » : noté dans YouTube Music, le titre est passé et ne revient plus dans
// les sélections Mood DJ. Un second clic l'annule.
const isDisliked = (np) => !!(np && np.videoId && learn.disliked && learn.disliked[C.keyOf(np.artist, np.title)]);
async function toggleDislike() {
  const np = nowPlaying();
  if (!np.videoId) return;
  learn.disliked = learn.disliked || {};
  const key = C.keyOf(np.artist, np.title);
  const was = !!learn.disliked[key];
  try {
    await call('rate', np.videoId, was ? 'remove' : 'dislike');
  } catch (e) {
    toast(e.message);
    return;
  }
  if (was) {
    delete learn.disliked[key];
    saveLearn();
    toast('« Je n\'aime pas » retiré : ce titre peut de nouveau passer.', null, 3500);
    updateLive();
    return;
  }
  learn.disliked[key] = (np.artist || '') + ' — ' + (np.title || '');
  const keys = Object.keys(learn.disliked);
  if (keys.length > 3000) for (const k of keys.slice(0, keys.length - 3000)) delete learn.disliked[k];
  if (likedIds.has(np.videoId)) {
    likes.items = likes.items.filter((x) => x.v !== np.videoId);
    indexLikes();
    store({ likes });
  }
  saveLearn();
  dlog('lecture', "je n'aime pas", { titre: np.title, artiste: np.artist });
  const s = session;
  if (s) {
    s.failedKeys.add(key);
    for (let i = s.queue.length - 1; i >= 0; i--) if (s.queue[i].key === key) s.queue.splice(i, 1);
    if (s.status === 'playing') ensureQueue();
  }
  toast("Je n'aime pas : titre passé, il ne reviendra plus.", null, 3500);
  updateLive();
  ctl.next();
}

let lastVolume = 80;
async function toggleLike() {
  const np = nowPlaying();
  if (!np.videoId) return;
  const liked = likedIds.has(np.videoId);
  try {
    await call('rate', np.videoId, liked ? 'remove' : 'like');
    if (liked) {
      likes.items = likes.items.filter((x) => x.v !== np.videoId);
      toast("Retiré de tes J'aime.", null, 2500);
    } else {
      likes.items.unshift({ v: np.videoId, t: np.title, a: np.artist, d: np.duration || ps.duration || 0, y: '' });
      toast("Ajouté à tes J'aime.", null, 2500);
    }
    if (!likes.at) likes.at = Date.now();
    indexLikes();
    store({ likes });
    updateLive();
  } catch (e) {
    toast(e.message);
  }
}

function miniPlayer() {
  const np = nowPlaying();
  const mini = h('div', { class: 'mini' });
  R.mini = { videoId: np.videoId, el: mini };
  if (!np.videoId) {
    mini.appendChild(h('div', { class: 'muted' }, 'Rien en lecture pour le moment.'));
    return mini;
  }
  R.mini.like = h('button', { class: 'iconbtn', type: 'button', 'aria-label': "J'aime", 'aria-pressed': String(likedIds.has(np.videoId)), onclick: ctl.like },
    icon(likedIds.has(np.videoId) ? 'heartOn' : 'heart', 20));
  R.mini.dislike = h('button', {
    class: 'iconbtn', type: 'button', 'aria-label': "Je n'aime pas", title: "Je n'aime pas : passe le titre, il ne reviendra plus",
    'aria-pressed': String(isDisliked(np)), onclick: ctl.dislike
  }, icon(isDisliked(np) ? 'thumbDownOn' : 'thumbDown', 20));
  mini.appendChild(h('div', { class: 'row' },
    h('div', { class: 'art small' }, h('img', { src: 'https://i.ytimg.com/vi/' + np.videoId + '/default.jpg', alt: '' })),
    h('div', { class: 'qtext' }, h('span', { class: 'qt' }, np.title || '—'), h('span', { class: 'qa' }, np.artist || '')),
    h('div', { class: 'rate' },
      h('button', {
        class: 'iconbtn', type: 'button', 'aria-label': 'Mix de ce titre',
        title: 'Mix de ce titre : une sélection dans le même esprit (artistes proches, même style et même énergie)', onclick: ctl.mix
      }, icon('mixseed', 20)),
      R.mini.dislike, R.mini.like)));

  R.mini.cur = h('span', { class: 'tm' }, C.fmtTime(ps.time));
  R.mini.rem = h('span', { class: 'tm' }, '');
  const bar = h('input', { type: 'range', class: 'seekbar', min: '0', max: String(Math.max(1, Math.round(ps.duration || np.duration || 1))), step: '1', value: String(Math.round(ps.time || 0)), 'aria-label': 'Position dans le titre' });
  bar.addEventListener('pointerdown', () => setDragging(true));
  bar.addEventListener('input', () => { setDragging(true); R.mini.cur.textContent = C.fmtTime(Number(bar.value)); });
  bar.addEventListener('change', () => {
    ctl.seek(Number(bar.value));
    setDragging(false, 600);
  });
  R.mini.bar = bar;
  mini.appendChild(h('div', { class: 'row seekrow' }, R.mini.cur, bar, R.mini.rem));

  R.mini.play = h('button', { class: 'playbtn', type: 'button', 'aria-label': ps.paused ? 'Lecture' : 'Pause', onclick: () => ctl.toggle().then(() => setTimeout(updateLive, 250)) },
    icon(ps.paused ? 'play' : 'pause', 24));
  const vol = h('input', { type: 'range', class: 'vol', min: '0', max: '100', step: '1', value: String(ps.muted ? 0 : (ps.volume ?? 100)), 'aria-label': 'Volume' });
  vol.addEventListener('pointerdown', () => setDragging(true));
  vol.addEventListener('input', () => { setDragging(true); ctl.volume(Number(vol.value)); });
  vol.addEventListener('change', () => { if (Number(vol.value) > 0) lastVolume = Number(vol.value); setDragging(false, 300); });
  R.mini.vol = vol;
  R.mini.mute = h('button', {
    class: 'iconbtn', type: 'button', 'aria-label': 'Couper le son',
    onclick: () => {
      const v = Number(vol.value);
      if (v > 0) { lastVolume = v; vol.value = '0'; ctl.volume(0); } else { vol.value = String(lastVolume || 80); ctl.volume(lastVolume || 80); }
    }
  }, icon(ps.muted || !ps.volume ? 'mute' : 'vol', 20));
  mini.appendChild(h('div', { class: 'ctrls' },
    h('div', { class: 'volbox' }, R.mini.mute, vol),
    h('div', { class: 'transport' },
      h('button', { class: 'iconbtn', type: 'button', 'aria-label': 'Titre précédent', onclick: ctl.prev }, icon('prev', 22)),
      R.mini.play,
      h('button', { class: 'iconbtn', type: 'button', 'aria-label': 'Titre suivant', onclick: ctl.next }, icon('next', 22))),
    h('span', null)));
  updateMini();
  return mini;
}

function updateMini() {
  const M = R.mini;
  if (!M || !M.el) return;
  const np = nowPlaying();
  if (np.videoId !== M.videoId) {
    if (!miniDragging && M.el.isConnected) M.el.replaceWith(miniPlayer());
    return;
  }
  if (!np.videoId) return;
  const d = ps.duration || np.duration || 0;
  if (!miniDragging) {
    M.bar.max = String(Math.max(1, Math.round(d || 1)));
    M.bar.value = String(Math.round(ps.time || 0));
    M.cur.textContent = C.fmtTime(ps.time);
    M.vol.value = String(ps.muted ? 0 : (ps.volume ?? 100));
  }
  M.rem.textContent = d ? '-' + C.fmtTime(Math.max(0, d - (ps.time || 0))) : '';
  const wantPlay = !!ps.paused;
  if (M.play.dataset.state !== String(wantPlay)) {
    M.play.dataset.state = String(wantPlay);
    M.play.replaceChildren(icon(wantPlay ? 'play' : 'pause', 24));
    M.play.setAttribute('aria-label', tr(wantPlay ? 'Lecture' : 'Pause'));
  }
  const liked = likedIds.has(np.videoId);
  if (M.like.getAttribute('aria-pressed') !== String(liked)) {
    M.like.setAttribute('aria-pressed', String(liked));
    M.like.replaceChildren(icon(liked ? 'heartOn' : 'heart', 20));
  }
  const disliked = isDisliked(np);
  if (M.dislike && M.dislike.getAttribute('aria-pressed') !== String(disliked)) {
    M.dislike.setAttribute('aria-pressed', String(disliked));
    M.dislike.replaceChildren(icon(disliked ? 'thumbDownOn' : 'thumbDown', 20));
  }
  const muted = ps.muted || !ps.volume;
  if (M.mute.dataset.muted !== String(muted)) {
    M.mute.dataset.muted = String(muted);
    M.mute.replaceChildren(icon(muted ? 'mute' : 'vol', 20));
  }
}

// Télécommande (fenêtre de l'icône de l'extension).
function remoteState() {
  const np = nowPlaying();
  const s = session;
  return {
    videoId: np.videoId, title: np.title, artist: np.artist,
    time: ps.time || 0, duration: ps.duration || np.duration || 0, paused: !!ps.paused,
    volume: ps.muted ? 0 : (ps.volume ?? 100), liked: !!(np.videoId && likedIds.has(np.videoId)),
    ad: !!ps.ad,
    session: s && s.status !== 'ended' ? {
      status: s.status, label: plainLabel(s.sel), mode: s.mode,
      next: s.queue[0] ? s.queue[0].title + ' · ' + s.queue[0].artist : ''
    } : null
  };
}

async function handleRemote(msg) {
  const v = msg.value;
  switch (msg.cmd) {
    case 'toggle': await ctl.toggle(); break;
    case 'next': await ctl.next(); break;
    case 'prev': await ctl.prev(); break;
    case 'seek': await ctl.seek(v); break;
    case 'volume': await ctl.volume(v); break;
    case 'like': await ctl.like(); break;
    case 'stop': if (session && session.status !== 'ended') await endSession('stop', 0); break;
    case 'mark': markProblem(); break;
    case 'panel':
      if (panelEl.hidden) togglePanel();
      break;
    default: break;
  }
  await sleep(msg.cmd === 'state' ? 0 : 250);
  return remoteState();
}

// ------------------------------------------------------ onglet Ambiance
function sourceNote() {
  if (sel.source === 'likes') {
    const n = likes.items.length;
    const st = likesLoading ? "Lecture de tes J'aime…" : n ? n + " titres J'aime chargés." : "Tes J'aime seront lus au lancement (compte connecté).";
    return "Tes titres J'aime, filtrés selon l'ambiance et rangés selon la courbe d'énergie. " + st +
      (hasKey ? '' : " Sans clé API, seuls ceux présents dans le catalogue sont classés par style.");
  }
  if (sel.source === 'similar') {
    const tagged = likes.items.filter((it) => trackFromItem(it).tagged).length;
    const likeNote = !likes.items.length ? " Les artistes de départ viennent d'abord de tes J'aime (lus au lancement), sinon du catalogue."
      : tagged ? " Les artistes de départ viennent d'abord de tes J'aime qui collent à l'ambiance (" + tagged + ' classés par style), puis du catalogue.'
        : hasKey ? " Tes J'aime ne sont pas encore classés par style : Claude les classe au premier lancement, ils serviront de départ ensuite."
          : " Pour partir de tes J'aime, il faut les classer par style (clé Claude).";
    return "Mood DJ part de quelques artistes qui collent à l'ambiance, explore leurs « Vous aimerez peut-être aussi » sur YouTube Music et pioche dans leurs titres les plus écoutés." + likeNote + " La réserve s'agrandit toute seule pendant l'écoute, et chaque titre découvert rejoint ton catalogue personnel (" + learned.length + ' titres pour l\'instant).' +
      (hasKey ? ' Claude Haiku estime leur style, leur énergie et leur époque.' : " Sans clé API, l'énergie des titres découverts reste approximative.");
  }
  if (sel.source === 'discover') {
    return "Aucun titre de tes J'aime ni de ton historique Mood DJ." + (hasKey
      ? ' Claude va chercher des artistes et des morceaux moins évidents.'
      : ' Sans clé API, la découverte reste limitée au catalogue intégré.');
  }
  return "Catalogue intégré, ou Claude si tu décris l'ambiance.";
}
