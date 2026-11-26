// Mood DJ — mentions légales : ouvre la version anglaise quand l'interface est en anglais.
// « legal.html?fr » (lien « Version française » de la page anglaise) garde le français.
'use strict';
(function () {
  if (/[?&]fr\b/.test(location.search)) return;
  try {
    chrome.storage.local.get(['settings']).then((d) => {
      const s = (d && d.settings && d.settings.uiLang) || 'auto';
      let l = 'fr';
      try { l = chrome.i18n.getUILanguage(); } catch (e) { l = navigator.language || 'fr'; }
      if (s === 'en' || (s !== 'fr' && !/^fr/i.test(l))) location.replace('legal.en.html' + location.hash);
    }).catch(() => {});
  } catch (e) { /* page ouverte hors de l'extension */ }
})();
