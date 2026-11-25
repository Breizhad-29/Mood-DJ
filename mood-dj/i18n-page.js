// Mood DJ — traduction des pages de l'extension (télécommande, clés API) selon la langue choisie.
// Même principe que dans le panneau : correspondance exacte dans le dictionnaire, sinon morceaux connus.
'use strict';
(function () {
  const DICT = typeof MDJ_I18N_EN === 'object' && MDJ_I18N_EN ? MDJ_I18N_EN : {};
  const ATTRS = ['title', 'placeholder', 'aria-label', 'alt'];
  let english = false;
  let frags = null;
  const cache = new Map();
  function tr(s) {
    if (!english || typeof s !== 'string' || !s.trim()) return s;
    if (cache.has(s)) return cache.get(s);
    let out = DICT[s];
    if (out === undefined) { const t = s.trim(); if (DICT[t] !== undefined) out = s.replace(t, DICT[t]); }
    if (out === undefined) {
      if (!frags) frags = Object.keys(DICT).filter((k) => k.trim().length >= 4 && /[\s:·,.!?’']/.test(k.trim())).sort((a, b) => b.length - a.length);
      out = s;
      for (const k of frags) if (out.includes(k)) out = out.split(k).join(DICT[k]);
    }
    cache.set(s, out);
    return out;
  }
  function walk(root) {
    if (!english || !root) return;
    if (root.nodeType === 3) { const v = tr(root.nodeValue); if (v !== root.nodeValue) root.nodeValue = v; return; }
    if (root.nodeType !== 1 || root.tagName === 'SCRIPT' || root.tagName === 'STYLE') return;
    for (const a of ATTRS) if (root.hasAttribute(a)) { const v = tr(root.getAttribute(a)); if (v !== root.getAttribute(a)) root.setAttribute(a, v); }
    for (const c of root.childNodes) walk(c);
  }
  function start() {
    if (document.documentElement) document.documentElement.lang = english ? 'en' : 'fr';
    walk(document.body);
    if (english) document.title = tr(document.title);
    new MutationObserver((list) => {
      for (const m of list) {
        if (m.type === 'characterData') walk(m.target);
        else if (m.type === 'attributes') walk(m.target);
        else for (const n of m.addedNodes) walk(n);
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  window.mdjTr = tr;
  chrome.storage.local.get(['settings']).then((d) => {
    const s = (d && d.settings && d.settings.uiLang) || 'auto';
    let l = 'fr';
    try { l = chrome.i18n.getUILanguage(); } catch (e) { l = navigator.language || 'fr'; }
    english = s === 'en' || (s !== 'fr' && !/^fr/i.test(l));
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  }).catch(() => {});
})();
