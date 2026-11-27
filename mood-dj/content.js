// Mood DJ — panneau et moteur DJ (monde isolé de l’extension) : démarrage.
// Les fichiers mdj-*.js puis content.js sont chargés dans l’ordre du manifest et partagent la même portée :
// une fonction d’un fichier peut appeler celle d’un autre, mais le code exécuté au chargement ne doit
// utiliser que ce qui est défini dans les fichiers précédents (vérifié par tests/split.test.js).
'use strict';

// ============================================================ démarrage
async function init() {
  try { await loadAll(); } catch (e) { /* valeurs par défaut */ }
  mountUi();
  // 2.35 : anciens textes du duo Jeff & Laeti remplacés par les nouveaux (une seule fois).
  try { migratePreset(); } catch (e) { dlog('session', 'mise à jour du duo : ' + e.message); }
  // 2.36 : clé Gemini présente mais voix de l'ordinateur : la bascule est proposée une fois.
  setTimeout(() => { try { offerGeminiVoices(); } catch (e) { /* ignore */ } }, 4000);
  setTimeout(() => checkGridPending(), 1500);
  if (elevenRemoved) dlog('session', 'ElevenLabs retiré de Mood DJ', elevenRemoved);
  if (dataMigration) {
    dlog('session', 'séparation Rap / Hip-hop', { a_reclasser_par_claude: dataMigration.toClaude, repartis_par_annee: dataMigration.byYear });
    if (dataMigration.toClaude) setTimeout(() => classifyLikesLater(), 8000);
  }
  setTimeout(() => checkDuplicate(false), 3000);
  setInterval(() => checkDuplicate(false), 30000);
  try {
    window.speechSynthesis.addEventListener('voiceschanged', () => { if (tab === 'reglages') render(); });
  } catch (e) { /* ignore */ }
  try {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      // Seulement les messages de Mood DJ lui-même (télécommande, service en arrière-plan).
      if (!sender || sender.id !== chrome.runtime.id) return false;
      if (msg && msg.type === 'mdj-toggle-panel') { togglePanel(); return false; }
      if (msg && msg.type === 'mdj-grid-start') {
        const e = (settings.schedule || []).find((x) => x.id === msg.id);
        if (!e) { sendResponse({ ok: false }); return false; }
        sendResponse({ ok: true });
        startScheduled(e);
        return false;
      }
      if (msg && msg.type === 'mdj-remote') {
        handleRemote(msg).then(sendResponse).catch(() => sendResponse(remoteState()));
        return true;
      }
      return false;
    });
  } catch (e) { /* ignore */ }
}

if (document.body) init();
else document.addEventListener('DOMContentLoaded', init);
