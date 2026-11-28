// Mood DJ — panneau et moteur DJ (monde isolé de l’extension) : onglet Réglages.
// Les fichiers mdj-*.js puis content.js sont chargés dans l’ordre du manifest et partagent la même portée :
// une fonction d’un fichier peut appeler celle d’un autre, mais le code exécuté au chargement ne doit
// utiliser que ce qui est défini dans les fichiers précédents (vérifié par tests/split.test.js).
'use strict';

// ------------------------------------------------------ onglet Réglages
// Genre affiché pour chaque animateur : choisi, sinon déduit de la voix choisie.
function hostGenderUi() {
  const g = settings.voiceGender;
  if (g === 'homme' || g === 'femme') return g;
  if (settings.voiceEngine === 'gemini') return geminiVoices().gA;
  const v = pickVoice();
  return (v && voiceGender(v)) || 'homme';
}
function cohostGenderUi() {
  if (settings.voiceEngine === 'gemini') return geminiVoices().gB;
  return cohostGenderOf(hostGenderUi());
}

// Pages de l'extension : saisie des clés, mentions légales et confidentialité.
function openExtPage(page, focus) {
  try {
    chrome.runtime.sendMessage({ type: 'mdj-open', page, focus: focus || '' }, () => { void chrome.runtime.lastError; });
  } catch (e) {
    toast("Impossible d'ouvrir la page : recharge YouTube Music (F5).", null, 8000);
  }
}

function tabReglages() {
  const body = h('div', { class: 'body' });
  const hostName = (settings.hostName || 'Alex').trim() || 'Alex';
  const coName = (settings.cohostName || 'Sam').trim() || 'Sam';
  const engine = settings.voiceEngine === 'gemini' ? 'gemini' : 'systeme';
  const GENDERS = [['femme', 'Une femme'], ['homme', 'Un homme']];
  const textField = (id, label, value, placeholder, onSave) => h('div', { class: 'section', style: { gap: '6px' } },
    h('label', { class: 'label', for: id }, label),
    h('input', { class: 'input', id, type: 'text', maxlength: '40', value: value || '', placeholder, onchange: (e) => onSave(e.target.value.trim()) }));
  const subhead = (text, note) => h('div', { class: 'subhead' }, h('span', null, text), note ? h('span', { class: 'muted' }, note) : null);

  // ---------------------------------------------------------- Clés API
  const keyBlock = (o) => {
    // Les clés se tapent dans une page de l'extension (chrome-extension://…), jamais dans la page
    // YouTube Music : ses scripts ne peuvent pas les lire ni capter la saisie ou le collage.
    const entry = h('div', { class: 'row' }, h('button', { class: 'btn small', type: 'button', onclick: () => openExtPage('keys', o.storeKey) },
      o.has ? 'Changer la clé…' : 'Saisir la clé…'), h('span', { class: 'muted' }, 'dans une page sécurisée de l’extension'));
    return h('div', { class: 'keyblock' },
      h('div', { class: 'row' }, h('span', { class: 'label white' }, o.title), pill(o.has ? 'Clé enregistrée' : 'Aucune clé')),
      h('div', { class: 'muted' }, o.use),
      entry,
      o.extra || o.has ? h('div', { class: 'btns' },
        o.extra || null,
        o.has ? h('button', {
          class: 'btn small', type: 'button',
          onclick: () => { try { chrome.storage.local.remove(o.storeKey); } catch (e) { /* ignore */ } o.removed(); render(); }
        }, 'Supprimer la clé') : null) : null,
      o.has ? null : h('div', { class: 'muted' }, o.help),
      o.after || null);
  };
  const keyParts = [
    h('h2', { class: 'label white' }, 'Clés API'),
    h('div', { class: 'muted' }, "Toutes facultatives : sans clé, Mood DJ marche avec son catalogue, des phrases toutes faites et la voix de l'ordinateur."),
    keyBlock({
      id: 'mdj-key', title: 'Claude (Anthropic)', storeKey: 'apiKey', has: hasClaude, placeholder: 'Colle ta clé Claude ici',
      use: 'Écrit les annonces, compose les sélections décrites en toutes lettres et classe tes titres.',
      help: 'Clé à créer dans la console Anthropic, rubrique API Keys.',
      removed: () => { hasClaude = false; syncTextKey(); toast('Clé Claude supprimée.'); },
      extra: h('button', {
        class: 'btn small', type: 'button', disabled: !hasClaude,
        onclick: () => {
          toast('Test de la connexion…', null, 3000);
          claude('test', {}).then((r) => toast('Connexion à Claude réussie' + (r && r.model ? ' (' + r.model + ')' : '') + '.'))
            .catch((e) => toast(e.message, null, 9000));
        }
      }, 'Tester'),
      after: h('div', { class: 'section', style: { gap: '6px' } },
        h('label', { class: 'label', for: 'mdj-model' }, 'Modèle Claude'),
        h('select', { class: 'select', id: 'mdj-model', onchange: (e) => { settings.model = e.target.value; saveSettings(); } },
          C.MODELS.map((m) => h('option', { value: m[0], selected: settings.model === m[0] }, m[1]))))
    }),
    keyBlock({
      id: 'mdj-gemini', title: 'Gemini (Google) · clé gratuite', storeKey: 'geminiKey', has: hasGemini1, placeholder: 'Colle ta clé Google AI Studio ici',
      use: 'Les voix Gemini des animateurs, et le duo à deux voix. Utilisée en premier.',
      help: 'Crée une clé sur aistudio.google.com (bouton « Get API key »), dans un projet sans facturation, puis colle-la ici.',
      removed: () => { hasGemini1 = false; hasGemini = hasGemini2; syncTextKey(); toast('Clé Gemini supprimée.'); }
    }),
    keyBlock({
      id: 'mdj-gemini2', title: 'Gemini (Google) · clé payante, en relais', storeKey: 'geminiKey2', has: hasGemini2, placeholder: 'Colle ta clé Gemini payante ici (facultatif)',
      use: "Prend le relais seulement quand la clé gratuite atteint sa limite (par minute ou du jour). Chaque voix passée par elle est facturée par Google : sur tes crédits, puis sur ta carte.",
      help: "Une clé créée dans un projet Google Cloud lié à un compte de facturation (marquée « Paid » dans AI Studio). Pense à fixer une alerte de budget dans la console Google Cloud.",
      removed: () => { hasGemini2 = false; hasGemini = hasGemini1; syncTextKey(); toast('Clé Gemini payante supprimée.'); }
    }),
    h('div', { class: 'muted' }, "Chaque clé reste dans ce navigateur et n'est envoyée qu'à son service (Anthropic, Google, Last.fm, Discogs, Setlist.fm ou Ticketmaster)." +
      ' Elles n\'apparaissent jamais dans le journal technique, ni dans la sauvegarde.')];
  // Sources d'anecdotes à clé : facultatives, elles complètent MusicBrainz, Wikidata, Deezer et Wikipédia.
  const testSource = (which, has, name) => h('button', {
    class: 'btn small', type: 'button', disabled: !has,
    onclick: () => {
      toast('Test de la connexion à ' + name + '…', null, 3000);
      claude('testsource', { which }).then((r) => toast(r && r.ok ? 'Connexion à ' + name + ' réussie.' : name + ' ne répond pas comme prévu.'))
        .catch((e) => toast(name + ' : ' + e.message, null, 9000));
    }
  }, 'Tester');
  const srcBlocks = [
    keyBlock({
      id: 'mdj-lastfm', title: 'Last.fm · clé gratuite', storeKey: 'lastfmKey', has: hasLastfm, placeholder: 'Colle ta clé API Last.fm ici',
      use: "Pour les animateurs : l'audience et les tags des titres, la bio des artistes. Pour « Mix de ce titre » : les artistes proches selon les auditeurs.",
      help: "Connecte-toi sur last.fm, puis crée une clé sur last.fm/api/account/create (un nom d'application suffit, le reste peut rester vide). Colle la « API key », pas le « Shared secret ».",
      removed: () => { hasLastfm = false; toast('Clé Last.fm supprimée.'); },
      extra: testSource('lastfm', hasLastfm, 'Last.fm')
    }),
    keyBlock({
      id: 'mdj-discogs', title: 'Discogs · jeton gratuit', storeKey: 'discogsToken', has: hasDiscogs, placeholder: 'Colle ton jeton Discogs ici',
      use: "Pour les animateurs : l'édition d'origine (label, pays, format), les styles précis et les crédits détaillés (producteurs, musiciens, ingénieurs du son).",
      help: 'Connecte-toi sur discogs.com, puis dans Paramètres › Développeurs, clique sur « Générer un nouveau jeton » et colle-le ici.',
      removed: () => { hasDiscogs = false; toast('Jeton Discogs supprimé.'); },
      extra: testSource('discogs', hasDiscogs, 'Discogs')
    }),
    keyBlock({
      id: 'mdj-setlist', title: 'Setlist.fm · clé gratuite', storeKey: 'setlistfmKey', has: hasSetlist, placeholder: 'Colle ta clé API Setlist.fm ici',
      use: "Pour les animateurs : le dernier concert de l'artiste et la place du morceau sur scène (joué à tous les concerts, en ouverture, en rappel… ou jamais).",
      help: 'Crée un compte sur setlist.fm, puis demande une clé sur setlist.fm/settings/api (usage non commercial). Elle arrive en général tout de suite.',
      removed: () => { hasSetlist = false; toast('Clé Setlist.fm supprimée.'); },
      extra: testSource('setlistfm', hasSetlist, 'Setlist.fm')
    }),
    keyBlock({
      id: 'mdj-ticketmaster', title: 'Ticketmaster · clé gratuite', storeKey: 'ticketmasterKey', has: hasTicketmaster, placeholder: 'Colle ta « Consumer Key » Ticketmaster ici',
      use: "Pour les animateurs : un court flash concert quand l'artiste qui passe a des dates prévues (au plus une fois tous les 3 jours par artiste), et « près de chez toi » si c'est dans ta ville de la météo.",
      help: 'Crée un compte sur developer.ticketmaster.com, puis dans « My Apps », copie la « Consumer Key ».',
      removed: () => { hasTicketmaster = false; toast('Clé Ticketmaster supprimée.'); },
      extra: testSource('ticketmaster', hasTicketmaster, 'Ticketmaster'),
      after: h('div', { class: 'section', style: { gap: '6px' } },
        h('label', { class: 'label', for: 'mdj-concertcountry' }, 'Concerts annoncés'),
        h('select', { class: 'select', id: 'mdj-concertcountry', onchange: (e) => { settings.concertCountry = e.target.value; saveSettings(); } },
          [['FR', 'En France'], ['BE', 'En Belgique'], ['CH', 'En Suisse'], ['CA', 'Au Canada'], ['LU', 'Au Luxembourg'], ['all', 'Partout dans le monde']]
            .map((o) => h('option', { value: o[0], selected: (settings.concertCountry || 'FR') === o[0] }, o[1]))))
    })
  ];
  // Qui écrit les textes (annonces, sélections décrites, classement des titres).
  const engineNow = settings.textEngine === 'gemini' ? 'gemini' : 'claude';
  const engineNote = !hasClaude && !hasGemini ? 'Aucune clé : les animateurs piochent dans des phrases toutes faites.'
    : engineNow === 'claude' && !hasClaude ? 'Pas de clé Claude : Gemini écrit les textes.'
      : engineNow === 'gemini' && !hasGemini ? 'Pas de clé Gemini : Claude écrit les textes.'
        : (engineNow === 'claude' ? 'Claude écrit les textes' : 'Gemini écrit les textes') + ((engineNow === 'claude' ? hasGemini : hasClaude) ? ', et ' + (engineNow === 'claude' ? 'Gemini' : 'Claude') + ' prend le relais en cas de panne, de limite atteinte ou de crédit épuisé.' : '.');
  const textCard = h('div', { class: 'card' },
    h('h2', { class: 'label white' }, 'Qui écrit les textes ?'),
    h('div', { class: 'muted' }, 'Annonces, interludes, invités, sélections décrites en toutes lettres, classement de tes titres.'),
    seg([['claude', 'Claude'], ['gemini', 'Gemini']], engineNow, (id) => { settings.textEngine = id; saveSettings(); render(); }, 'Moteur des textes'),
    h('div', { class: 'muted' }, engineNote),
    engineNow === 'gemini' ? h('div', { class: 'section', style: { gap: '6px' } },
      h('label', { class: 'label', for: 'mdj-gtextmodel' }, 'Modèle Gemini pour les textes'),
      h('select', { class: 'select', id: 'mdj-gtextmodel', onchange: (e) => { settings.geminiTextModel = e.target.value; saveSettings(); } },
        [['gemini-3.8-flash', 'Gemini 3.8 Flash · rapide, conseillé'], ['gemini-4-argon', 'Gemini 4 Argon · plus récent, plus cher']]
          .map((o) => h('option', { value: o[0], selected: (settings.geminiTextModel || 'gemini-3.8-flash') === o[0] }, o[1]))),
      h('div', { class: 'muted' }, 'Utilise tes clés Gemini (la gratuite, puis la payante en relais). Si Google renomme le modèle, Mood DJ prend tout seul le Flash le plus récent.'),
      h('div', { class: 'btns' }, h('button', {
        class: 'btn small', type: 'button', disabled: !hasGemini,
        onclick: () => {
          toast('Test de Gemini pour les textes…', null, 3000);
          claude('testgeminitext', {}).then((r) => toast('Gemini répond' + (r && r.model ? ' (' + r.model + (r.cle ? ', clé ' + r.cle : '') + ')' : '') + '.'))
            .catch((e) => toast(e.message, null, 9000));
        }
      }, 'Tester'))) : null);
  const POWER_NOTES = {
    eco: 'Textes courts, écrits par le modèle le plus léger (Claude Haiku 5.5 ou Gemini 3.8 Flash), duo à trois répliques au plus, sans mémoire des animateurs. Le moins cher.',
    normal: 'Le modèle choisi plus haut écrit les textes. Les animateurs ont leur personnalité et se souviennent de ce qu’ils racontent d’une émission à l’autre.',
    max: 'Le modèle le plus puissant (Claude Opus 5.5 ou Gemini 4 Argon) écrit des dialogues plus longs et plus travaillés, sauf par-dessus les intros. Plus vivant, mais plus cher (avec Claude, environ deux fois le prix de Sonnet) et un peu plus lent : l’annonce est préparée à l’avance.'
  };
  // Consommation du jour : coût estimé de Claude, et nombre d'appels Gemini par clé.
  const usageLine = () => {
    const today = new Date();
    const day = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const u = aiUsage && aiUsage.day === day ? aiUsage : { claudeUsd: 0, claudeCalls: 0, geminiFree: 0, geminiPaid: 0 };
    const usd = (u.claudeUsd || 0).toFixed(2);
    return h('div', { class: 'section', style: { gap: '4px' } },
      h('div', { class: 'label' }, 'Consommation du jour (estimation)'),
      h('div', { class: 'muted' }, 'Claude', ' : ≈ ' + (uiIsEnglish() ? usd : usd.replace('.', ',')) + ' $ · ' + (u.claudeCalls || 0) + ' ', (u.claudeCalls || 0) > 1 ? 'appels' : 'appel'),
      h('div', { class: 'muted' }, 'Gemini', ' : ' + (u.geminiFree || 0) + ' ', 'avec la clé gratuite', ' · ' + (u.geminiPaid || 0) + ' ', 'avec la clé payante'),
      h('div', { class: 'muted' }, 'D’après les tarifs publics de Claude. Les appels Gemini avec la clé payante sont facturés par Google, à ses tarifs.'));
  };
  const CAP_AUTO = { eco: 'Automatique : 40 textes et 60 voix par heure', normal: 'Automatique : 150 textes et 150 voix par heure', max: 'Automatique : 300 textes et 300 voix par heure' };
  const powerCard = h('div', { class: 'card' },
    h('h2', { class: 'label white' }, 'Puissance de l’IA'),
    h('div', { class: 'muted' }, 'Pour les textes des animateurs : annonces, interludes, invités, bilans.'),
    seg([['eco', 'Économe'], ['normal', 'Normale'], ['max', 'Pleine puissance']], aiPower(), (id) => { settings.aiPower = id; saveSettings(); render(); }, 'Puissance de l’IA'),
    h('div', { class: 'muted' }, POWER_NOTES[aiPower()]),
    h('label', { class: 'label', for: 'mdj-aicap' }, 'Plafond d’appels par heure'),
    h('select', { class: 'select', id: 'mdj-aicap', onchange: (e) => { settings.aiCap = e.target.value; saveSettings(); render(); } },
      [['auto', CAP_AUTO[aiPower()]], ['20', '20 par heure'], ['40', '40 par heure'], ['80', '80 par heure'], ['150', '150 par heure'], ['300', '300 par heure']]
        .map((o) => h('option', { value: o[0], selected: String(settings.aiCap || 'auto') === o[0] }, o[1]))),
    h('div', { class: 'muted' }, 'Compté à part pour les textes et pour les voix Gemini. Au-delà, Mood DJ n’appelle plus l’IA jusqu’à l’heure suivante et les animateurs passent aux phrases toutes faites. Ce plafond ne remplace pas une limite de dépenses fixée dans la console du service.'),
    usageLine());
  const srcIntro = h('div', { class: 'muted' }, "Sources d'anecdotes en plus, facultatives : sans elles, les animateurs puisent déjà dans MusicBrainz, Wikidata, Deezer et Wikipédia.");
  const keysView = isFull()
    ? [keyParts[1], cols(card(keyParts[2]), card(keyParts[3]), card(keyParts[4])), cols(textCard, powerCard),
      h('h3', { class: 'label white' }, "Sources d'anecdotes"), srcIntro, cols(card(srcBlocks[0]), card(srcBlocks[1])),
      h('h3', { class: 'label white' }, 'Concerts'), cols(card(srcBlocks[2]), card(srcBlocks[3])), keyParts[5]]
    : [card(keyParts), textCard, powerCard, card(h('h2', { class: 'label white' }, "Sources d'anecdotes"), srcIntro, srcBlocks)];

  // ------------------------------------------------------------- Langues
  const langCard = h('div', { class: 'card' },
    h('h2', { class: 'label white' }, 'Langues'),
    h('label', { class: 'label', for: 'mdj-uilang' }, 'Langue de l’interface'),
    h('select', { class: 'select', id: 'mdj-uilang', onchange: (e) => { settings.uiLang = e.target.value; saveSettings(); i18nCache.clear(); render(); } },
      [['auto', 'Automatique (langue de Chrome)'], ['fr', 'Français'], ['en', 'English']].map((o) => h('option', { value: o[0], selected: (settings.uiLang || 'auto') === o[0] }, o[1]))),
    h('label', { class: 'label', for: 'mdj-radiolang' }, 'Langue de la radio'),
    h('select', { class: 'select', id: 'mdj-radiolang', onchange: (e) => { settings.radioLang = e.target.value; saveSettings(); render(); } },
      RADIO_LANG_LIST.map((o) => h('option', { value: o[0], selected: radioLang() === o[0] }, o[1]))),
    h('div', { class: 'muted' }, radioLang() === 'fr'
      ? 'Les animateurs parlent français.'
      : 'Les animateurs parlent la langue choisie : l’IA écrit directement dans cette langue, et les voix Gemini la parlent. Sans IA pour les textes (clé Claude ou Gemini), les animateurs utilisent des phrases toutes faites, en anglais pour toute autre langue que le français. Avec la voix de l’ordinateur, il faut une voix de cette langue installée sur l’ordinateur.'));

  // --------------------------------------------------------------- Voix
  const missing = engine === 'gemini' && !hasGemini ? 'Gemini' : '';
  const voiceCard = h('div', { class: 'card' },
    h('h2', { class: 'label white' }, 'Voix'),
    h('div', { class: 'muted' }, 'Qui fait parler les animateurs ?'),
    seg([['systeme', 'Ordinateur'], ['gemini', 'Gemini']], engine, (id) => { settings.voiceEngine = id; settings.voiceChosen = true; saveSettings(); render(); }, 'Moteur de voix'),
    h('div', { class: 'muted' }, engine === 'gemini'
      ? 'Voix naturelles de Google, avec le duo à deux voix. Le ton suit le style de chaque animateur, avec de petits rires ou des pauses quand Claude écrit les annonces.'
      : "Les voix installées sur ton ordinateur : gratuites et immédiates, mais plus robotiques. Pas de duo."),
    missing ? h('div', { class: 'muted warn' }, 'Ajoute ta clé ' + missing + (isFull() ? ' dans la rubrique « Clés API ».' : " dans « Clés API » ci-dessus.") + " En attendant, c'est la voix de l'ordinateur qui parle.") : null);
  if (engine === 'gemini') {
    append(voiceCard, [
      h('label', { class: 'label', for: 'mdj-gmodel' }, 'Modèle Gemini'),
      h('select', { class: 'select', id: 'mdj-gmodel', onchange: (e) => { settings.geminiModel = e.target.value; saveSettings(); } },
        h('option', { value: 'gemini-3.8-flash-tts', selected: settings.geminiModel !== 'gemini-3.8-flash-lite-tts' }, 'Gemini 3.8 Flash TTS · meilleure qualité'),
        h('option', { value: 'gemini-3.8-flash-lite-tts', selected: settings.geminiModel === 'gemini-3.8-flash-lite-tts' }, 'Gemini 3.8 Flash-Lite TTS · plus économique')),
      h('div', { class: 'muted' }, "Dans l'offre gratuite, Google peut utiliser le texte des annonces pour améliorer ses produits. Si Gemini ne répond pas, ou si tes crédits du mois sont épuisés, la voix de l'ordinateur prend le relais : la radio ne devient jamais muette.")]);
  } else {
    voiceCard.appendChild(h('div', { class: 'muted' }, "La voix de Claude n'est pas disponible pour les extensions. Pour une voix vraiment humaine, choisis Gemini."));
  }

  // ---------------------------------------------------------- Animateurs
  const hg = hostGenderUi();
  const gv = engine === 'gemini' ? geminiVoices() : null;
  const geminiSelect = (id, current, auto, gender, onPick) => h('select', { class: 'select', id, onchange: (e) => onPick(e.target.value) },
    h('option', { value: '', selected: !current }, 'Automatique (' + auto + ')'),
    GEMINI_VOICES.filter((v) => v[1] === gender).map((v) => h('option', { value: v[0], selected: current === v[0] }, v[0] + ' · ' + v[2])));
  let hostVoice;
  if (engine === 'gemini') {
    hostVoice = h('div', { class: 'voicepick' },
      geminiSelect('mdj-gvoice', settings.geminiVoice, gv.a, hg, (v) => { settings.geminiVoice = v; saveSettings(); render(); }),
      hasGemini ? h('button', { class: 'btn small', type: 'button', id: 'mdj-test-a', onclick: () => testGeminiVoice('A') }, 'Tester') : null);
  } else {
    const fr = frenchVoices();
    const others = voices().filter((v) => !/^fr/i.test(v.lang));
    const gLabel = (v) => { const g = voiceGender(v); return g ? ' · ' + g : ''; };
    const missingGender = !fr.some((v) => voiceGender(v) === hg);
    hostVoice = [
      h('select', { class: 'select', id: 'mdj-voice', onchange: (e) => { settings.voiceURI = e.target.value; saveSettings(); } },
        h('option', { value: '', selected: !settings.voiceURI }, 'Automatique (une voix ' + (hg === 'femme' ? 'de femme' : "d'homme") + ')'),
        fr.map((v) => h('option', { value: v.voiceURI, selected: settings.voiceURI === v.voiceURI }, v.name + gLabel(v))),
        others.length ? h('optgroup', { label: 'Autres langues' }, others.map((v) => h('option', { value: v.voiceURI, selected: settings.voiceURI === v.voiceURI }, v.name + ' (' + v.lang + ')'))) : null),
      missingGender && fr.length ? h('div', { class: 'muted' }, 'Aucune voix française ' + (hg === 'homme' ? 'masculine' : 'féminine') +
        " n'est installée sur cet ordinateur. Sous Windows : Paramètres › Heure et langue › Voix. Sur Mac : Réglages › Accessibilité › Contenu énoncé › Voix du système.") : null];
  }
  const duoPossible = engine === 'gemini';
  const cg = settings.duo ? cohostGenderUi() : 'femme';
  // Personnalité (fiche modifiable) et souvenirs gardés, pour l'animateur A ou B.
  const personaBlock = (who) => {
    if (!hasKey) return null;
    ensurePersonas();
    const key = who === 'A' ? 'hostPersona' : 'cohostPersona';
    const id = who === 'A' ? 'mdj-persona-a' : 'mdj-persona-b';
    const n = (hostMemory[who] || []).length;
    return h('div', { class: 'section', style: { gap: '6px' } },
      h('label', { class: 'label', for: id }, 'Personnalité'),
      h('textarea', {
        class: 'input', id, rows: '4', maxlength: '2500', spellcheck: 'true', value: settings[key] || '',
        style: { height: 'auto', minHeight: '104px', padding: '8px 10px', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.4' },
        onchange: (e) => { settings[key] = e.target.value.trim(); saveSettings(); }
      }),
      h('div', { class: 'muted' }, 'Ses goûts, une manie, un bout de sa vie : l’IA s’en sert par petites touches. Tu peux la réécrire à ta façon.'),
      h('div', { class: 'btns' },
        h('button', {
          class: 'btn small', type: 'button',
          onclick: () => { settings[key] = makePersona(who === 'A' ? 0 : 1, null, settings[who === 'A' ? 'cohostPersona' : 'hostPersona']); hostMemory[who] = []; saveMemory(); saveSettings(); render(); }
        }, 'Nouvelle personnalité'),
        h('button', {
          class: 'btn small', type: 'button', disabled: !n,
          onclick: () => { hostMemory[who] = []; saveMemory(); toast('Souvenirs oubliés.'); render(); }
        }, 'Oublier ses souvenirs'),
        // 2.36 : ce que l'animateur a raconté de lui à l'antenne, à relire et à oublier un par un.
        n ? h('button', {
          class: 'btn small', type: 'button', 'aria-expanded': memOpen[who] ? 'true' : 'false',
          onclick: () => { memOpen[who] = !memOpen[who]; render(); }
        }, memOpen[who] ? 'Masquer ses souvenirs' : 'Voir ses souvenirs', ' (' + n + ')') : null),
      n && memOpen[who] ? h('div', { class: 'section', style: { gap: '6px' } },
        h('div', { class: 'muted' }, 'Ce qu’il ou elle a raconté de sa vie à l’antenne, du plus récent au plus ancien. L’IA s’en souvient d’une émission à l’autre, pour ne pas se contredire.'),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '260px', overflowY: 'auto', paddingRight: '4px' } },
          (hostMemory[who] || []).slice().reverse().map((m) => h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
            // Le souvenir est affiché tel quel, sans passer par la traduction de l'interface.
            h('span', { class: 'muted', style: { flex: '1', minWidth: '0' } }, document.createTextNode(m.t)),
            h('button', {
              class: 'btn small', type: 'button', title: 'Oublier ce souvenir', 'aria-label': 'Oublier ce souvenir', style: { flex: 'none', height: '26px', minWidth: '26px', padding: '0 8px' },
              onclick: () => { hostMemory[who] = (hostMemory[who] || []).filter((x) => x !== m); saveMemory(); render(); }
            }, '×'))))) : null,
      h('label', { class: 'label', for: id + '-story' }, 'Son histoire'),
      h('textarea', {
        class: 'input', id: id + '-story', rows: '3', maxlength: '2000', spellcheck: 'true', value: settings[SLOT[who].story] || '',
        placeholder: 'Son passé, son parcours, ce qu’il ou elle garde pour soi…',
        style: { height: 'auto', minHeight: '80px', padding: '8px 10px', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.4' },
        onchange: (e) => { settings[SLOT[who].story] = e.target.value.trim(); saveSettings(); }
      }),
      h('div', { class: 'muted' }, 'Facultatif : son lore personnel. L’IA y fait allusion rarement, et ne trahit jamais un secret.'),
      engine === 'gemini' ? h('div', { class: 'section', style: { gap: '6px' } },
        h('label', { class: 'label', for: id + '-voice' }, 'Direction de la voix (Gemini)'),
        h('input', {
          class: 'input', id: id + '-voice', type: 'text', maxlength: '200', value: settings[who === 'A' ? 'hostVoiceNote' : 'cohostVoiceNote'] || '',
          placeholder: 'ex. : débit posé, un temps avant la chute',
          onchange: (e) => { settings[who === 'A' ? 'hostVoiceNote' : 'cohostVoiceNote'] = e.target.value.trim(); saveSettings(); }
        })) : null,
      aiPower() === 'eco' ? h('div', { class: 'muted' }, 'En mode Économe, les souvenirs ne sont ni rappelés ni enregistrés.')
        : h('div', { class: 'muted' }, n ? 'Souvenirs gardés : ' + n : 'Pas encore de souvenir : ils se créent au fil des émissions.'),
      profilePicker('mdj-prof-' + who, 'Mes animateurs', hostProfiles, builtinHosts(), (p) => loadHostProfile(who, p), deleteHostProfile,
        h('button', { class: 'btn small', type: 'button', onclick: () => saveHostProfile(who) }, 'Enregistrer cet animateur')),
      h('div', { class: 'muted' }, 'Enregistre sa fiche, son histoire, sa voix et ses souvenirs, pour le reprendre plus tard ici ou à l’autre place.'));
  };
  let loreCard = null;
  if (hasKey) {
    ensureLore();
    const nL = (hostMemory.L || []).length;
    loreCard = h('div', { class: 'card' },
      h('h2', { class: 'label white' }, 'L’univers de la station'),
      h('div', { class: 'muted' }, 'Le studio, des personnages qu’on n’entend jamais, une légende, l’histoire des animateurs et une intrigue en cours. Les animateurs y font allusion de temps en temps, comme des habitués.'),
      h('textarea', {
        class: 'input', id: 'mdj-lore', rows: '6', maxlength: '1500', spellcheck: 'true', value: settings.stationLore || '', 'aria-label': 'L’univers de la station',
        style: { height: 'auto', minHeight: '150px', padding: '8px 10px', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.4' },
        onchange: (e) => { settings.stationLore = e.target.value.trim(); saveSettings(); }
      }),
      h('div', { class: 'muted' }, 'Tu peux tout réécrire : c’est toi l’auteur de cet univers. {A} et {B} sont remplacés par les prénoms des animateurs.'),
      h('div', { class: 'label' }, 'Dosage'),
      seg([['off', 'Jamais'], ['discret', 'Discret'], ['regulier', 'Régulier'], ['fort', 'Très présent']], loreLevel(), (id) => { settings.loreLevel = id; saveSettings(); render(); }, 'Dosage de l’univers'),
      h('div', { class: 'muted' }, aiPower() === 'eco' ? 'En mode Économe, l’univers de la station n’est pas utilisé.'
        : { off: 'Les animateurs n’en parlent jamais.', discret: 'Une allusion de temps en temps, environ une intervention sur sept.', regulier: 'Une allusion environ une intervention sur trois.', fort: 'Souvent, même par-dessus les intros : la station devient un personnage.' }[loreLevel()]),
      h('div', { class: 'btns' },
        h('button', {
          class: 'btn small', type: 'button',
          onclick: () => { settings.stationLore = makeLore(); hostMemory.L = []; saveMemory(); saveSettings(); render(); }
        }, 'Nouvel univers'),
        h('button', {
          class: 'btn small', type: 'button', disabled: !nL,
          onclick: () => { hostMemory.L = []; saveMemory(); toast('Événements oubliés.'); render(); }
        }, 'Oublier les événements')),
      h('div', { class: 'muted' }, nL ? 'Événements retenus : ' + nL : 'Ce que les animateurs inventent à l’antenne (un incident au studio, l’intrigue qui avance) sera retenu ici.'),
      profilePicker('mdj-lore-prof', 'Mes univers', loreProfiles, builtinLores(), loadLoreProfile, deleteLoreProfile,
        h('button', { class: 'btn small', type: 'button', onclick: saveLoreProfile }, 'Enregistrer cet univers')),
      h('div', { class: 'muted' }, 'Enregistre l’univers, la relation du duo, le dosage et les événements retenus.'));
  }
  const presetRow = hasKey ? h('div', { class: 'section', style: { gap: '6px' } },
    h('div', { class: 'btns' }, h('button', { class: 'btn small', type: 'button', onclick: () => applyPreset(PRESET_JEFF_LAETI) }, 'Charger le duo Jeff & Laeti'),
      settings.duo ? h('button', { class: 'btn small', type: 'button', onclick: swapHosts, title: 'Le coanimateur devient l’animateur principal, et inversement' }, 'Inverser les animateurs') : null),
    h('div', { class: 'muted' }, 'Un ancien cadreur qui regarde la musique et une ancienne ingénieure du son qui l’écoute : fiches, relation, univers et voix d’un coup. Tout reste modifiable, et « Annuler » remet tes réglages.')) : null;
  const pickCard = hasKey ? h('div', { class: 'card' },
    h('h2', { class: 'label white' }, 'Le choix des animateurs'),
    h('div', { class: 'muted' }, 'De temps en temps, un animateur choisit lui-même un titre : son coup de cœur, ou un titre amené par l’univers de la station. Il le fait attendre, le lance avec son histoire, et l’autre donne son verdict.'),
    seg([['off', 'Jamais'], ['rare', 'Rare'], ['souvent', 'Souvent']], picksLevel(), (id) => { settings.hostPicks = id; saveSettings(); render(); }, 'Le choix des animateurs'),
    h('div', { class: 'muted' }, aiPower() === 'eco' ? 'En mode Économe, les animateurs ne choisissent pas de titres.'
      : { off: 'Seule ta sélection choisit les titres.', rare: 'Environ un titre sur six, toujours dans ton ambiance.', souvent: 'Environ un titre sur quatre, toujours dans ton ambiance.' }[picksLevel()]),
    h('div', { class: 'muted' }, 'Le titre est vérifié sur YouTube Music, respecte ta liste noire et apparaît dans « À suivre » avec la mention « choix de … » : tu peux le retirer. Un appel d’IA de plus par titre choisi.')) : null;
  const hostCard = h('div', { class: 'card' },
    h('h2', { class: 'label white' }, 'Animateurs'),
    presetRow,
    subhead(hg === 'femme' ? 'Animatrice principale' : 'Animateur principal', 'Parle seul, ou mène le duo.'),
    textField('mdj-host', 'Prénom', settings.hostName, 'Alex', (v) => { settings.hostName = v || 'Alex'; saveSettings(); render(); }),
    h('div', { class: 'label' }, hostName + ' est'),
    seg(GENDERS, hg, (id) => {
      settings.voiceGender = id;
      settings.voiceURI = '';
      if (settings.geminiVoice && genderOfGemini(settings.geminiVoice) !== id) settings.geminiVoice = '';
      saveSettings();
      render();
    }, 'Genre de la voix'),
    h('label', { class: 'label', for: 'mdj-hoststyle' }, 'Style'),
    h('select', { class: 'select', id: 'mdj-hoststyle', onchange: (e) => { settings.hostStyle = e.target.value; saveSettings(); render(); } },
      HOST_STYLE_LABELS.map((x) => h('option', { value: x[0], selected: settings.hostStyle === x[0] }, x[1]))),
    personaBlock('A'),
    h('label', { class: 'label', for: engine === 'gemini' ? 'mdj-gvoice' : 'mdj-voice' }, 'Voix de ' + hostName),
    hostVoice,
    switchRow("Duo d'animateurs", duoPossible ? 'Deux animateurs qui se répondent et se chambrent' : 'Nécessite les voix Gemini (carte Voix)', settings.duo, (v) => { settings.duo = v; saveSettings(); render(); }));
  let coCard = null;
  if (settings.duo) {
    const coItems = [
      subhead(cg === 'femme' ? 'Coanimatrice' : 'Coanimateur', duoPossible ? null : "Le duo a besoin des voix Gemini : choisis Gemini dans « Voix ». En attendant, " + hostName + ' parle seul.'),
      textField('mdj-cohost', 'Prénom', settings.cohostName, 'Sam', (v) => { settings.cohostName = v || 'Sam'; saveSettings(); render(); }),
      h('div', { class: 'label' }, coName + ' est'),
      seg(GENDERS, cg, (id) => {
        settings.cohostGender = id;
        if (settings.geminiVoiceB && genderOfGemini(settings.geminiVoiceB) !== id) settings.geminiVoiceB = '';
        saveSettings(); render();
      }, 'Genre du coanimateur'),
      h('label', { class: 'label', for: 'mdj-cohoststyle' }, 'Style'),
      h('select', { class: 'select', id: 'mdj-cohoststyle', onchange: (e) => { settings.cohostStyle = e.target.value; saveSettings(); render(); } },
        HOST_STYLE_LABELS.map((x) => h('option', { value: x[0], selected: (settings.cohostStyle || 'decale') === x[0] }, x[1]))),
      duoPossible ? personaBlock('B') : null,
      duoPossible && hasKey ? h('div', { class: 'section', style: { gap: '6px' } },
        h('label', { class: 'label', for: 'mdj-relation' }, 'Relation du duo'),
        h('textarea', {
          class: 'input', id: 'mdj-relation', rows: '5', maxlength: '4000', spellcheck: 'true', value: settings.duoRelation || '',
          placeholder: 'Comment ils se parlent, qui taquine qui, qui mène quand, leurs running gags, ce qu’il ne faut jamais faire…',
          style: { height: 'auto', minHeight: '130px', padding: '8px 10px', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.4' },
          onchange: (e) => { settings.duoRelation = e.target.value.trim(); saveSettings(); }
        }),
        h('div', { class: 'muted' }, 'Facultatif : la « bible » du duo, envoyée à l’IA à chaque dialogue.')) : null,
      duoPossible ? h('label', { class: 'label', for: 'mdj-gvoiceb' }, 'Voix de ' + coName) : null,
      duoPossible ? h('div', { class: 'voicepick' },
        geminiSelect('mdj-gvoiceb', settings.geminiVoiceB, gv.b, cg, (v) => { settings.geminiVoiceB = v; saveSettings(); render(); }),
        hasGemini ? h('button', { class: 'btn small', type: 'button', id: 'mdj-test-b', onclick: () => testGeminiVoice('B') }, 'Tester') : null) : null,
      duoPossible && hasGemini ? h('div', { class: 'btns' }, h('button', { class: 'btn small', type: 'button', id: 'mdj-test-duo', onclick: () => testGeminiVoice('duo') }, 'Tester le duo')) : null];
    // Pleine page : l'animateur et son coanimateur côte à côte.
    if (isFull()) coCard = card(coItems);
    else append(hostCard, coItems);
  }

  // ------------------------------------------------------ Animation radio
  // Titre de réglage avec un bouton « Tester » qui fait entendre un exemple.
  // Curseur « musique ou bavardage » (2.38) : parmi les conversations, la part hors musique.
  const mixText = (n) => (n <= 0 ? 'Que de la musique' : n >= 100 ? 'Que du bavardage' : (100 - n) + ' % musique · ' + n + ' % bavardage');
  const chatMixRow = () => {
    const val = h('span', { class: 'label white' }, mixText(chatMix()));
    return h('div', { class: 'section', style: { gap: '6px' } },
      h('div', { class: 'row' }, h('label', { class: 'label', for: 'mdj-chatmix' }, 'Musique ou bavardage'), val),
      h('input', {
        type: 'range', id: 'mdj-chatmix', min: '0', max: '100', step: '10', value: String(chatMix()),
        oninput: (e) => { settings.chatMix = Number(e.target.value); val.textContent = tr(mixText(chatMix())); },
        onchange: saveSettings
      }),
      h('div', { class: 'scale' }, h('span', null, 'Musique'), h('span', null, 'Bavardage')),
      h('div', { class: 'muted' }, 'De quoi parlent ces conversations. À gauche, de musique : un chambrage, un désaccord, une devinette, un défi, une note sur dix, une anecdote. À droite, de tout le reste : la vie du studio, un débat absurde, un « tu préfères », un mini-jeu.'));
  };
  const labelTest = (txt, what, tip) => h('div', { class: 'row' }, h('div', { class: 'label' }, txt),
    h('button', { class: 'btn small', type: 'button', title: tip, 'aria-label': tip, onclick: () => demoAnnouncement(what) }, 'Tester'));
  const radioHead = h('div', { class: 'row' },
    h('h2', { class: 'label white' }, 'Animation radio'),
    switchBtn('Mode radio', settings.radio, (v) => { settings.radio = v; saveSettings(); }));
  const radioA = [
    switchRow("L'IA écrit les annonces", hasKey ? 'Des annonces variées, écrites à chaque fois par ' + (settings.textEngine === 'gemini' ? (hasGemini ? 'Gemini' : 'Claude') : (hasClaude ? 'Claude' : 'Gemini')) : 'Nécessite une clé Claude ou Gemini (Clés API)', settings.claudeAnnounce, (v) => { settings.claudeAnnounce = v; saveSettings(); }),
    h('label', { class: 'label', for: 'mdj-freq' }, "Annonces par-dessus l'intro des titres"),
    h('select', { class: 'select', id: 'mdj-freq', onchange: (e) => { settings.radioFreq = e.target.value; saveSettings(); render(); } },
      C.FREQS.map((f) => h('option', { value: f[0], selected: settings.radioFreq === f[0] }, f[1]))),
    h('div', { class: 'label' }, 'Rythme des interventions'),
    seg([['naturel', 'Naturel'], ['regulier', 'Régulier']], naturalRhythm() ? 'naturel' : 'regulier', (id) => { settings.rhythm = id; saveSettings(); render(); }, 'Rythme des interventions'),
    h('div', { class: 'muted' }, naturalRhythm()
      ? 'Les interventions tombent un peu au hasard autour du réglage, avec la même moyenne : on ne devine plus quand l’animateur va parler. Jamais deux interventions collées.'
      : 'Les interventions tombent toujours au même rang (par exemple tous les 3 titres).'),
    settings.radioFreq === 'every' || settings.radioFreq === 'third'
      ? switchRow('Programme des titres à venir', settings.radioFreq === 'every' ? 'Le programme, puis une chronique, puis un moment de culture' : naturalRhythm() ? 'Les animateurs annoncent les 2 à 4 titres qui arrivent' : 'Les animateurs annoncent les 3 titres qui arrivent',
        settings.programme !== false, (v) => { settings.programme = v; saveSettings(); render(); }) : null,
    (settings.radioFreq === 'every' || settings.radioFreq === 'third') && settings.programme !== false
      ? h('div', { class: 'muted', id: 'mdj-prog-note' }, settings.radioFreq === 'every'
        ? "Un cycle de 3 titres. Avant le 1er : le programme, les 3 titres qui arrivent, sur le fondu. Avant le 2e : la chronique, une vraie pause avec une anecdote développée (et de temps en temps l'heure et la météo). Avant le 3e : un fait de culture musicale, sur le fondu. Puis un nouveau programme." + (naturalRhythm() ? " En rythme naturel, le cycle fait parfois 4 titres, avec un deuxième moment de culture." : '') + " Selon « Bavardage et discussions », plus bas, une partie de ces interventions devient une conversation entre les animateurs. Les titres annoncés au programme sont verrouillés ; si tu en passes un, les animateurs le sautent aussi."
        : (naturalRhythm() ? "Tous les 2 à 4 titres (tiré au sort), l'annonce présente les titres qui arrivent jusqu'à la suivante, sur le fondu." : "Tous les 3 titres, l'annonce présente les 3 titres qui arrivent, sur le fondu.") + " Les titres annoncés sont verrouillés, et seulement eux ; si tu en passes un, les animateurs le sautent aussi.") : null,
    h('div', { class: 'label' }, "Moment de l'annonce"),
    seg([['fondu', 'Sur le fondu'], ['intro', "Sur l'intro du suivant"]], settings.announceAt === 'intro' ? 'intro' : 'fondu', (id) => { settings.announceAt = id; saveSettings(); render(); }, "Moment de l'annonce"),
    h('div', { class: 'muted' }, settings.announceAt === 'intro'
      ? "L'animateur parle quand le titre suivant a démarré, musique baissée."
      : "L'animateur commence à parler sur la fin du titre, et sa voix fait le pont avec le suivant, comme à la radio. Dans tous les cas, l'annonce est préparée dès le début du titre en cours."),
    labelTest('Interludes', 'interlude', 'Écouter un exemple d\'interlude'),
    seg(INTERLUDES, settings.interludes || 'parfois', (id) => { settings.interludes = id; saveSettings(); render(); }, 'Interludes'),
    h('div', { class: 'muted' }, settings.radioFreq === 'every' && settings.programme !== false
      ? (settings.interludes === 'off'
        ? "Avec le programme, la chronique se fait normalement en interlude. Sur « Jamais », elle est dite sur le fondu, sans pause."
        : "Avec le programme, l'interlude sert à la chronique : une vraie pause tous les 3 titres, avec jingle et fond sonore. « Parfois » et « Souvent » reviennent au même.")
      : "Un interlude, c'est une vraie pause radio entre deux titres : jingle, fond sonore et un moment d'animation, avec de temps en temps l'heure et la météo." + (naturalRhythm() ? " Parfois : tous les 3 à 5 titres. Souvent : tous les 2 ou 3." : " Parfois : tous les 4 titres. Souvent : tous les 2.")),
    labelTest('Anecdotes sur les groupes et les morceaux', 'anecdote', 'Écouter une anecdote sur le titre en cours (ou sur un classique)'),
    seg([['rare', 'Rarement'], ['souvent', 'Souvent'], ['max', 'Très souvent']], settings.anecdotes || 'souvent', (id) => { settings.anecdotes = id; saveSettings(); render(); }, 'Anecdotes'),
    h('div', { class: 'muted' }, "Des anecdotes vraies, tirées de la page de l'artiste sur YouTube Music, de son article Wikipédia et de celui du morceau, pour que les animateurs n'inventent rien. Une histoire déjà racontée n'est pas reprise avant longtemps. Il faut la clé Claude." +
      (settings.programme !== false && (settings.radioFreq === 'every' || settings.radioFreq === 'third')
        ? (chatLevel() === 'off' ? ' Avec le programme, la chronique et la culture courte sont toujours des anecdotes : ce réglage ne change rien tant que « Bavardage et discussions » est sur « Jamais ».'
          : ' Avec le programme, la chronique et la culture courte sont toujours des anecdotes ; ce réglage dit quelle part des conversations en raconte une.') : '')),
    labelTest('Bavardage et discussions', 'bavardage', 'Écouter un moment de bavardage entre deux titres'),
    seg([['off', 'Jamais'], ['parfois', 'Parfois'], ['souvent', 'Souvent'], ['max', 'Tout le temps']], chatLevel(), (id) => { settings.chat = id; saveSettings(); render(); }, 'Bavardage et discussions'),
    h('div', { class: 'muted' }, (chatLevel() === 'off'
      ? 'Les animateurs s’en tiennent au programme et aux anecdotes : pas de conversation entre eux, pas de bavardage hors musique, pas de jeu.'
      : chatLevel() === 'max'
        ? 'Chaque intervention est une conversation entre les animateurs : plus de programme détaillé, de chronique ni de rubrique. À l’ouverture d’un programme, ils rappellent les titres à venir. L’intro, les invités, les dédicaces et les changements d’ambiance gardent leur place.'
        : chatLevel() === 'souvent'
          ? 'Presque toutes les interventions sont des conversations entre les animateurs, à la place du programme, de la chronique ou de la culture courte. À l’ouverture d’un programme, ils rappellent les titres à venir.'
          : 'Une intervention sur deux est une conversation entre les animateurs, à la place du programme, de la chronique ou de la culture courte. À l’ouverture d’un programme, ils rappellent les titres à venir.') +
      (chatLevel() !== 'off' && !(settings.duo && engine === 'gemini') ? ' Avec un seul animateur, ce sont des apartés glissés aux auditeurs : le duo (voix Gemini) leur va bien mieux.' : '')),
    chatLevel() !== 'off' ? chatMixRow() : null,
    chatLevel() !== 'off' && hasKey ? [
      h('div', { class: 'label' }, 'Jeux entre les animateurs'),
      seg([['off', 'Jamais'], ['parfois', 'Parfois'], ['souvent', 'Souvent']], gameLevel(), (id) => { settings.games = id; saveSettings(); render(); }, 'Jeux entre les animateurs'),
      h('div', { class: 'muted' }, gameLevel() === 'off' ? 'Pas de vrai ou faux.'
        : (gameLevel() === 'souvent' ? 'Le vrai ou faux sort plus souvent que les autres conversations autour de la musique.'
          : 'Le vrai ou faux est une conversation parmi les autres : il sort de temps en temps, comme un défi ou une devinette.') +
          ' Il lui faut une fiche fiable sur le titre. En « À chaque titre », à l’ouverture d’un programme, la question porte sur le deuxième titre et la réponse tombe juste avant lui.')
    ] : null,
    switchRow("Bilan de fin d'émission", 'Quand une sélection se termine : souvenirs, invités, score des jeux, et la prochaine émission de la grille', settings.showRecap !== false,
      (v) => { settings.showRecap = v; saveSettings(); }),
    labelTest('Spécialiste invité', 'guest', 'Écouter l\'arrivée d\'un invité, sur le titre en cours (ou sur un classique)'),
    seg([['off', 'Jamais'], ['rare', 'Rarement'], ['souvent', 'Souvent']], settings.guestFreq || 'rare', (id) => { settings.guestFreq = id; saveSettings(); render(); }, 'Spécialiste invité'),
    h('div', { class: 'muted' }, (settings.guestFreq === 'off' ? "Pas d'invité dans l'émission." :
      (settings.guestFreq === 'souvent' ? 'Environ toutes les 30 minutes' : 'Environ une fois par heure') +
      ", un spécialiste du style qui passe (critique de jazz, producteur de beats, DJ, musicologue…) vient en studio pour deux ou trois interventions, à la place de " +
      ((settings.cohostName || 'Sam').trim() || 'Sam') + ". L'animateur l'annonce, l'accueille, puis il repart en lançant un titre. Chaque spécialité garde son invité d'une émission à l'autre.") +
      (useGemini() && hasKey ? '' : ' Il faut les voix Gemini.')),
    // 2.41 : avec le duo Jeff & Laeti, deux personnages de leur univers passent aussi au micro.
    isJeffLaeti() ? h('div', { class: 'row' },
      h('div', { style: { flex: '1', minWidth: '0' } },
        h('div', { class: 'label white' }, 'Camille et Arthur au micro'),
        h('div', { class: 'muted' }, settings.guestFreq === 'off'
          ? 'Mets « Spécialiste invité » sur Rarement ou Souvent pour qu’ils passent.'
          : 'Avec Jeff & Laeti, environ un passage d’invité sur deux revient à Camille, la serveuse du Ty Loup. Arthur passe bien plus rarement, et ne reste pas. Ils ne sont pas spécialistes de musique : ils font la conversation, à leur façon.')),
      h('button', { class: 'btn small', type: 'button', disabled: settings.castGuests === false, title: 'Écouter Camille arriver au micro', 'aria-label': 'Écouter Camille arriver au micro', onclick: () => demoAnnouncement('perso') }, 'Tester'),
      switchBtn('Camille et Arthur au micro', settings.castGuests !== false, (v) => { settings.castGuests = v; saveSettings(); render(); })) : null,
    guestListView()];
  const gemOk = useGemini();
  const radioB = [
    labelTest('Émotions des animateurs', 'interlude', 'Écouter un interlude avec ces émotions'),
    seg([['auto', 'Auto'], ['sobre', 'Sobre'], ['intime', 'Intime'], ['expressif', 'Expressif'], ['dechaine', 'Déchaîné']], emotionSetting(), (id) => { settings.emotion = id; saveSettings(); render(); }, 'Émotions des animateurs'),
    h('div', { class: 'muted' }, !gemOk ? "Les émotions demandent les voix Gemini : la voix de l'ordinateur reste neutre."
      : emotionSetting() === 'auto' ? 'Le ton suit l’émission : intime au coucher, la nuit ou sur un titre romantique ; sobre au travail ; déchaîné en fête, au sport ou quand l’énergie grimpe ; un cran de plus pour un jeu gagné, l’arrivée d’un invité ou un changement d’ambiance. Le style de l’animateur compte aussi (un Zen ne s’emballe jamais).' + (session && session.lastEmotion ? ' Dernière intervention : ' + EMO_NAMES[session.lastEmotion] + '.' : '')
      : emotionSetting() === 'intime' ? 'Voix proche du micro, douce et tendre, avec des silences et des respirations : le ton des émissions de nuit et des dédicaces émues. Pas de bruitages.'
      : emotionLevel() === 'sobre' ? 'Quelques petits rires et respirations, comme avant.'
        : emotionLevel() === 'dechaine' ? 'Grands éclats de rire, fous rires à deux, exclamations, emballement : un vrai plateau en folie. Le ton change à presque chaque réplique.'
          : 'De vrais rires quand c\'est drôle, de la surprise, de l\'émotion : chaque réplique peut avoir son ton (excité, chuchoté, faussement outré…).'),
    emotionSetting() === 'sobre' || emotionSetting() === 'intime' || !gemOk ? null : switchRow('Bruitages de plateau', 'Applaudissements, acclamations, ba-dum-tss, roulement de tambour, buzzer, petite victoire',
      settings.sfx !== false, (v) => { settings.sfx = v; saveSettings(); render(); }),
    emotionSetting() === 'sobre' || emotionSetting() === 'intime' || !gemOk || settings.sfx === false ? null : h('div', { class: 'btns' },
      h('button', {
        class: 'btn small', type: 'button',
        onclick: async () => {
          await callSafe('initAudio');
          for (const n of ['applaudissements', 'acclamations', 'badumtss', 'roulement', 'buzzer', 'victoire']) { toast('Bruitage : ' + n, null, 1500); await callSafe('playSfx', n); await sleep(250); }
        }
      }, 'Écouter les bruitages')),
    emotionSetting() === 'sobre' || !gemOk ? null : switchRow('Chanter, à l\'essai', 'Fredonner, chanter le nom de la station, entonner faux pour rire : jamais les paroles d\'une vraie chanson',
      !!settings.sing, (v) => { settings.sing = v; saveSettings(); }),
    emotionSetting() === 'sobre' || !gemOk ? null : h('div', { class: 'btns' },
      h('button', { class: 'btn small', type: 'button', title: 'Un interlude où un animateur chante à coup sûr', onclick: () => demoAnnouncement('chant') }, 'Tester le chant')),
    switchRow('Jingles', 'Petits habillages sonores Mood DJ', settings.jingles, (v) => { settings.jingles = v; saveSettings(); }),
    switchRow('Fond sonore', 'Musique discrète sous la voix pendant les interludes', settings.radioBed, (v) => { settings.radioBed = v; saveSettings(); }),
    h('div', { class: 'label' }, 'Habillage sonore'),
    seg([['auto', 'Selon l’ambiance'], ['classique', 'Classique Mood DJ']], settings.soundKit === 'classique' ? 'classique' : 'auto', (id) => { settings.soundKit = id; saveSettings(); render(); }, 'Habillage sonore'),
    h('div', { class: 'muted' }, settings.soundKit === 'classique' ? 'Toujours le même jingle et le même fond, quelle que soit la musique.'
      : 'Jingles et fond des interludes changent avec la musique : guitares saturées pour le rock, kick et nappe pompée en électro, contrebasse et ride en jazz, bourdon et flûte en celtique, cordes et timbales pour le classique, congas et marimba en latino… Plus doux la nuit, en mineur pour les humeurs sombres, plus rapide quand l’énergie monte. En ce moment : ' + (KIT_NAMES[kitOpts().kit] || 'pop') + '.'),
    h('div', { class: 'btns' }, h('button', {
      class: 'btn small', type: 'button',
      onclick: async () => {
        await callSafe('initAudio');
        const k = kitOpts();
        toast('Habillage « ' + (KIT_NAMES[k.kit] || 'pop') + ' » : jingle, puis fond sonore.', null, 4000);
        await callSafe('playJingle', 0, k);
        await callSafe('bedStart', 0.6, k);
        await sleep(9000);
        await callSafe('bedStop', 1.5);
      }
    }, 'Écouter l’habillage')),
    textField('mdj-listener', 'Ton prénom (facultatif)', settings.listenerName, 'Pour signer tes dédicaces à l’antenne', (v) => { settings.listenerName = v; saveSettings(); }),
    textField('mdj-city', 'Ville pour la météo (facultatif)', settings.weatherCity, 'ex. Lyon', (v) => { settings.weatherCity = v; weatherCache.at = 0; saveSettings(); }),
    h('div', { class: 'muted' }, 'La météo vient d\'Open-Meteo (gratuit, sans compte).'),
    h('div', { class: 'btns' },
      h('button', { class: 'btn small', type: 'button', onclick: () => demoAnnouncement('talkover') }, 'Écouter une annonce'),
      h('button', { class: 'btn small', type: 'button', onclick: () => demoAnnouncement('interlude') }, 'Écouter un interlude')),
    hasKey && settings.claudeAnnounce ? null : h('div', { class: 'muted' }, "Sans IA pour les textes, l'animateur pioche dans des phrases toutes faites. Avec une clé Claude ou Gemini, il écrit chaque annonce.")];
  const radioCards = isFull()
    ? [card(radioHead, radioA), card(h('h2', { class: 'label white' }, 'Habillage et écoute'), radioB)]
    : [card(radioHead, radioA, radioB)];

  // ------------------------------------------------------------- Lecture
  const lectureCard = (h('div', { class: 'card' },
    h('h2', { class: 'label white' }, 'Lecture'),
    switchRow('Mood DJ prioritaire', 'Pendant une sélection, YouTube Music ne change plus de titre tout seul', settings.priority !== false, (v) => { settings.priority = v; saveSettings(); }),
    h('div', { class: 'muted' }, "Les boutons Suivant et Précédent de YouTube Music, Maj+N, Maj+P et les touches multimédia pilotent Mood DJ. Si YouTube Music lance un titre de lui-même, Mood DJ reprend la main. Si tu choisis toi-même un morceau dans YouTube Music, il passe dans le mix et la sélection reprend juste après. La fenêtre « Toujours là ? » est confirmée automatiquement."),
    switchRow('Pas de lecture automatique au chargement', 'Quand la page se recharge, YouTube Music ne relance pas le dernier titre tout seul', settings.blockAutoplay !== false,
      (v) => { settings.blockAutoplay = v; saveSettings(); }),
    switchRow('Masquer le lecteur de YouTube Music en pleine page', 'Le mini-lecteur de Mood DJ prend sa place, en bas', settings.hideYtBar !== false,
      (v) => { settings.hideYtBar = v; saveSettings(); render(); })));

  // ----------------------------------------------------------- Mes J'aime
  const likesInfo = likes.items.length
    ? likes.items.length + ' titres, lus le ' + new Date(likes.at).toLocaleDateString(uiLocale()) + ' à ' + new Date(likes.at).toLocaleTimeString(uiLocale(), { hour: '2-digit', minute: '2-digit' }) + '.'
    : 'Pas encore lus.';
  const tagged = likes.items.filter((it) => { const k = C.keyOf(it.a, it.t); return CAT_BY_KEY.has(k) || meta[k]; }).length;
  const likesCard = (h('div', { class: 'card' },
    h('h2', { class: 'label white' }, "Mes J'aime"),
    h('div', { class: 'muted' }, likesInfo + (likes.items.length ? ' ' + tagged + ' classés par style et énergie' + (classifying ? ' (classement en cours…)' : '') + '.' : '')),
    h('div', { class: 'btns' },
      h('button', {
        class: 'btn small', type: 'button', disabled: likesLoading,
        onclick: () => loadLikes(true).then((it) => toast(it.length + " titres J'aime lus.")).catch((e) => toast(e.message))
      }, likesLoading ? 'Lecture…' : "Actualiser mes J'aime"),
      likes.items.length && hasKey ? h('button', {
        class: 'btn small', type: 'button', disabled: classifying > 0,
        onclick: () => {
          const missingTags = likes.items.map((it) => trackFromItem(it)).filter((t) => !t.tagged);
          if (!missingTags.length) { toast("Tous tes J'aime sont déjà classés."); return; }
          toast('Classement de ' + missingTags.length + ' titres par Claude…', null, 4000);
          classify(missingTags).then(() => { toast("J'aime classés."); render(); }).catch((e) => toast(e.message));
          render();
        }
      }, 'Tout classer') : null)));

  // ------------------------------------------------------------ Catalogue
  const builtin = CATALOG.filter((t) => !t.learned);
  const styles = new Set(builtin.map((t) => t.style)).size;
  const catCard = (h('div', { class: 'card' },
    h('h2', { class: 'label white' }, 'Catalogue'),
    h('div', { class: 'muted' }, 'Catalogue intégré : ' + builtin.length + ' titres répartis sur ' + styles + ' styles, classés par énergie, humeur et époque. Il fonctionne sans clé API.'),
    switchRow('Mes découvertes', learned.length + ' titres trouvés chez les artistes similaires, ajoutés au catalogue', settings.useLearned !== false, (v) => { settings.useLearned = v; saveSettings(); mergeLearnedIntoCatalog(); render(); }),
    learned.length ? h('div', { class: 'btns' }, h('button', {
      class: 'btn small', type: 'button',
      onclick: () => { learned = []; store({ learnedCat: [] }); mergeLearnedIntoCatalog(); toast('Découvertes effacées du catalogue.'); render(); }
    }, 'Effacer mes découvertes')) : null,
    h('div', { class: 'btns' },
      h('button', {
        class: 'btn small', type: 'button',
        onclick: () => { learn = { skips: {}, skipNames: {}, recent: [], disliked: learn.disliked || {}, guests: learn.guests || {}, banned: learn.banned || {} }; store({ learn }); bannedCache = null; toast('Titres passés et habitudes d\'écoute oubliés (liste noire, « Je n\'aime pas » et invités gardés).', null, 5000); }
      }, "Effacer l'apprentissage"),
      Object.keys(learn.disliked || {}).length ? h('button', {
        class: 'btn small', type: 'button',
        onclick: () => { learn.disliked = {}; store({ learn }); toast("Les titres « Je n'aime pas » peuvent de nouveau passer."); render(); }
      }, "Oublier mes « Je n'aime pas » (" + Object.keys(learn.disliked).length + ')') : null,
      h('button', {
        class: 'btn small', type: 'button',
        onclick: () => { cache = {}; store({ resolveCache: {} }); toast('Cache des recherches vidé.'); }
      }, 'Vider le cache'))));

  // ---------------------------------------------------------- Liste noire
  const banIn = h('input', {
    class: 'input', id: 'mdj-ban', type: 'text', maxlength: '80', placeholder: "Nom d'un artiste",
    onkeydown: (e) => { if (e.key === 'Enter') { e.preventDefault(); const v = banIn.value; banIn.blur(); banArtist(v); } }
  });
  const banned = Object.entries(learn.banned || {}).sort((a, b) => a[1].localeCompare(b[1], 'fr'));
  const disliked = Object.entries(learn.disliked || {}).slice(-40).reverse();
  const banCard = h('div', { class: 'card' },
    h('h2', { class: 'label white' }, 'Liste noire'),
    h('div', { class: 'muted' }, "Les artistes de cette liste ne passent plus jamais, quelle que soit la source (catalogue, J'aime, similaires, nouveautés, Claude), même en featuring. Tu peux aussi en ajouter depuis En cours ou l'Historique."),
    h('div', { class: 'row' }, banIn, h('button', { class: 'btn small', type: 'button', onclick: () => banArtist(banIn.value) }, 'Ajouter')),
    banned.length ? h('div', { class: 'chips' }, banned.map(([k, n]) => h('span', { class: 'ambchip' },
      h('span', { class: 'ambload' }, n),
      h('button', { type: 'button', class: 'ambdel', 'aria-label': 'Retirer ' + n + ' de la liste noire', title: 'Retirer de la liste noire', onclick: () => unbanArtist(k) }, icon('x', 14)))))
      : h('div', { class: 'muted' }, 'Aucun artiste pour le moment.'),
    subhead("Titres que je n'aime pas", disliked.length ? (Object.keys(learn.disliked).length + ' au total, les plus récents en premier') : 'Aucun : le pouce vers le bas du lecteur en ajoute un.'),
    disliked.length ? h('div', { class: 'histlist' }, disliked.map(([k, label]) => h('div', { class: 'qitem' },
      h('div', { class: 'qtext' }, h('span', { class: 'qa' }, label)),
      h('button', {
        class: 'x', type: 'button', 'aria-label': 'Ne plus détester ' + label, title: 'Ce titre peut de nouveau passer',
        onclick: () => { delete learn.disliked[k]; saveLearn(); toast('« ' + label + ' » peut de nouveau passer.', null, 3000); render(); }
      }, icon('x', 14))))) : null);

  // ----------------------------------------------------- Journal technique
  const logCard = (h('div', { class: 'card' },
    h('h2', { class: 'label white' }, 'Journal technique'),
    switchRow('Enregistrer le journal', dbgBuf.length + ' évènements gardés ' + WHERE, settings.debugLog !== false, (v) => { settings.debugLog = v; saveSettings(); render(); }),
    h('div', { class: 'btns' },
      h('button', { class: 'btn small', type: 'button', id: 'mdj-dl-log', onclick: () => downloadDebug() }, 'Télécharger'),
      h('button', { class: 'btn small', type: 'button', onclick: () => copyDebug() }, 'Copier'),
      h('button', { class: 'btn small', type: 'button', onclick: () => markProblem() }, 'Signaler un souci'),
      h('a', { class: 'btn small', href: 'mailto:biduletrash@yahoo.com?subject=' + encodeURIComponent('Mood DJ ' + VERSION + ' : un souci'), target: '_blank', rel: 'noopener' }, 'Écrire un mail'),
      h('button', { class: 'btn small', type: 'button', onclick: () => { dbgBuf = []; store({ debugLog: [] }); toast('Journal effacé.'); render(); } }, 'Effacer')),
    h('div', { class: 'muted' }, "Note tout ce que fait Mood DJ (titres, annonces, voix, fondus, réactions de YouTube Music, erreurs) pour comprendre un souci. Il reste " + WHERE + ", ne contient aucune clé API, mais inclut tes réglages (prénoms, ville de la météo)."),
    h('div', { class: 'muted' }, 'Un bug ? Clique sur « Signaler un souci » juste après, télécharge le journal, puis envoie-le par mail à biduletrash@yahoo.com en racontant ce qui s’est passé. Merci !')));
  const versionLine = h('div', { class: 'muted' }, 'Mood DJ · version ' + VERSION);

  // ------------------------------------------------ À propos, mentions légales
  const aboutCard = h('div', { class: 'card' },
    h('h2', { class: 'label white' }, 'À propos'),
    h('div', { class: 'muted' }, "Mood DJ est une extension indépendante, sans lien avec YouTube, Google, Anthropic ni les autres services utilisés. Elle n'a pas de serveur : tes données restent " + WHERE + ", sauf ce qui part vers les services dont tu as mis la clé. Les voix des animateurs et leurs textes sont produits par des IA."),
    h('div', { class: 'btns' },
      h('button', { class: 'btn small', type: 'button', onclick: () => openExtPage('legal') }, 'Mentions légales et confidentialité'),
      h('button', { class: 'btn small', type: 'button', onclick: () => openExtPage('legal', 'credits') }, 'Sources et crédits')),
    versionLine);

  if (!isFull()) {
    append(body, [langCard, keysView, voiceCard, hostCard, loreCard, pickCard, radioCards, gridCard(), lectureCard, banCard, likesCard, catCard, logCard, backupCard(), aboutCard]);
    return [body];
  }
  // Pleine page : un menu à gauche, et seulement les réglages de la rubrique choisie à droite.
  const groups = [
    ['emission', "L'émission", 'Annonces, interludes, anecdotes, jingles, météo',
      () => cols(radioCards[0], radioCards[1])],
    ['grille', 'Grille des émissions', 'Émissions programmées, réveil',
      () => cols(gridCard())],
    ['animateurs', 'Animateurs, voix, langues', 'Prénoms, styles, voix, duo, univers, langues',
      () => cols(hostCard, coCard, [loreCard, pickCard, langCard, voiceCard])],
    ['cles', 'Clés API', 'Claude, Gemini, sources et concerts', () => keysView],
    ['lecture', 'Lecture et bibliothèque', "Priorité, liste noire, J'aime, catalogue",
      () => cols([lectureCard, banCard], [likesCard, catCard])],
    ['donnees', 'Journal et sauvegarde', 'Diagnostic, export, import',
      () => cols(logCard, backupCard())],
    ['apropos', 'À propos', 'Mentions légales, confidentialité, crédits',
      () => cols(aboutCard)]
  ];
  const cur = groups.find((g) => g[0] === regTab) || groups[0];
  const nav = h('nav', { class: 'subnav', 'aria-label': 'Rubriques des réglages' },
    groups.map((g) => h('button', {
      type: 'button', class: g[0] === cur[0] ? 'on' : '', 'aria-current': g[0] === cur[0] ? 'page' : null,
      onclick: () => { regTab = g[0]; panelEl.dataset.tab = ''; render(); }
    }, h('span', null, g[1]), h('span', { class: 'hint' }, g[2]))),
    h('div', { class: 'navfoot' }, versionLine));
  append(body, h('div', { class: 'regwrap' }, nav, h('div', { class: 'regmain' }, h('h2', { class: 'regtitle' }, cur[1]), cur[3]())));
  return [body];
}
