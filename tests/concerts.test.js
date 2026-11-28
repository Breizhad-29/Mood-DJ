'use strict';
// 2.43 : Ticketmaster est retiré. Les prochaines dates de concert viennent d'une recherche Google faite par Gemini,
// avec la clé Gemini déjà enregistrée : douze recherches par jour au plus, réponses gardées cinq jours, dates hors
// période écartées, longues séries dites au mois.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { DIR, loadBackground, loadPanel } = require('./helpers');

const day = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

// Un faux Gemini : répond aux demandes de recherche, et note ce qu'il reçoit.
function fakeGemini(answer) {
  const calls = [];
  const fetch = async (url, opts) => {
    const body = JSON.parse(opts.body);
    const key = opts.headers['x-goog-api-key'];
    calls.push({ url: String(url), key, body });
    const r = typeof answer === 'function' ? answer({ key, body, n: calls.length }) : answer;
    if (r && r.status) return { ok: false, status: r.status, json: async () => ({ error: { message: r.message || '', details: r.details || [] } }) };
    return { ok: true, status: 200, json: async () => ({ candidates: [{ content: { parts: [{ text: r.text }] },
      groundingMetadata: r.bare ? undefined : { webSearchQueries: ['concert'], groundingChunks: [{ web: { title: 'billetterie.example' } }], searchEntryPoint: { renderedContent: '<div class="container"><a class="chip" href="https://www.google.com/search?q=x">x</a></div>' } } }] }) };
  };
  return { fetch, calls };
}

test('Ticketmaster est retiré : plus de permission, plus de clé demandée, la clé enregistrée est effacée', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(DIR, 'manifest.json'), 'utf8'));
  assert.ok(!JSON.stringify(manifest).toLowerCase().includes('ticketmaster'));
  // Pages et guides : plus aucune mention. Code : plus rien en dehors des commentaires (lignes « // … »).
  for (const f of ['legal.html', 'legal.en.html', 'options.html', 'popup.html']) {
    const file = path.join(DIR, f);
    if (fs.existsSync(file)) assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /ticketmaster/i, f);
  }
  for (const f of ['../README.md', '../README.en.md']) assert.doesNotMatch(fs.readFileSync(path.join(DIR, f), 'utf8'), /ticketmaster/i, f);
  const code = (f) => fs.readFileSync(path.join(DIR, f), 'utf8').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
  for (const f of ['options.js', 'popup.js', 'mdj-ui-reglages.js', 'mdj-radio.js', 'mdj-annonces.js', 'background.js']) {
    if (fs.existsSync(path.join(DIR, f))) assert.doesNotMatch(code(f), /ticketmaster/i, f);
  }
  // Au chargement : la clé qui traînait dans le navigateur est effacée (et l'auditeur prévenu une fois).
  const etat = fs.readFileSync(path.join(DIR, 'mdj-etat.js'), 'utf8');
  assert.match(etat, /hadTicketmaster = !!d\.ticketmasterKey;\s*\n\s*if \(hadTicketmaster\) \{ try \{ chrome\.storage\.local\.remove\('ticketmasterKey'\)/);
  // Éteint d'office : Google peut facturer ces recherches.
  const p = loadPanel();
  assert.equal(p.run('DEFAULT_SETTINGS.concerts'), false);
  assert.equal(p.run('DEFAULT_SETTINGS.concertCountry'), 'FR');
  p.run('hasGemini = true; settings.concerts = false;');
  assert.equal(p.run('concertsOn()'), false);
  p.run('settings.concerts = true;');
  assert.equal(p.run('concertsOn()'), true);
  p.run('hasGemini = false;');
  assert.equal(p.run('concertsOn()'), false, 'sans clé Gemini, pas de recherche');
});

test('réponse de la recherche : dates à venir seulement, dans la période, sans marques de citation ni doublon', () => {
  const bg = loadBackground();
  const text = [
    day(10) + ' | Marseille | Le Dôme | [PerQueryResult(index="1.',
    day(11) + ' | Marseille | Le Dôme | vide',
    '* **' + day(40) + '** | Paris | Accor Arena | We Love Green [2]',
    day(40) + ' | paris | Accor Arena |',
    day(-3) + ' | Clisson | Val de Moine | Hellfest',
    day(400) + ' | Lyon | Halle Tony Garnier |',
    '2027-02-30 | Nice | Palais Nikaïa |',
    day(60) + ' |  | Salle sans ville |',
    day(70) + ' | Dijon',
    'Voici les dates trouvées :',
    'AUCUNE'
  ].join('\n');
  const got = JSON.parse(JSON.stringify(bg.run('parseConcerts')(text, day(0), day(270))));
  assert.deepEqual(got, [
    { date: day(10), city: 'Marseille', venue: 'Le Dôme', country: '', festival: '' },
    { date: day(11), city: 'Marseille', venue: 'Le Dôme', country: '', festival: '' },
    { date: day(40), city: 'Paris', venue: 'Accor Arena', country: '', festival: 'We Love Green' },
    { date: day(70), city: 'Dijon', venue: '', country: '', festival: '' }
  ]);
  assert.deepEqual(JSON.parse(JSON.stringify(bg.run('parseConcerts')('AUCUNE', day(0), day(270)))), []);
});

test('recherche de concerts : une demande à Gemini avec l’outil de recherche Google, la clé gratuite d’abord', async () => {
  const g = fakeGemini({ text: day(20) + ' | Reims | Reims Arena |\n' + day(21) + ' | Dijon | Zénith |' });
  const bg = loadBackground({ fetch: g.fetch });
  bg.store.geminiKey = 'cle-gratuite';
  bg.store.geminiKey2 = 'cle-payante';
  // L'artiste principal d'une collaboration, comme pour les autres fiches.
  const r = JSON.parse(JSON.stringify(await bg.run('concertsAhead')({ artist: 'Lady Gaga & Bradley Cooper', title: 'Shallow', country: 'FR' })));
  assert.equal(g.calls.length, 1);
  const c = g.calls[0];
  assert.match(c.url, /generativelanguage\.googleapis\.com\/v1beta\/models\/gemini-[\w.-]+:generateContent$/);
  assert.equal(c.key, 'cle-gratuite');
  assert.deepEqual(c.body.tools, [{ google_search: {} }]);
  const prompt = c.body.contents[0].parts[0].text;
  assert.match(prompt, new RegExp('Nous sommes le ' + day(0)));
  assert.match(prompt, /concerts à venir de l'artiste « Lady Gaga » \(qui interprète « Shallow »\) en France/);
  assert.match(prompt, new RegExp("entre aujourd'hui et le " + day(270)));
  assert.match(prompt, /N'invente rien, et ne donne aucun concert déjà passé/);
  assert.match(prompt, /« AAAA-MM-JJ \| ville \| salle \| nom du festival ou vide »/);
  assert.deepEqual(r.events.map((e) => e.date + ' ' + e.city), [day(20) + ' Reims', day(21) + ' Dijon']);
  assert.equal(r.cle, 'gratuite');
  assert.deepEqual(r.sources, ['billetterie.example']);
  assert.match(r.suggest, /class="chip"/);
  // Comptée dans la consommation du jour.
  assert.equal(bg.store.aiUsage.concerts, 1);
  assert.equal(bg.store.aiUsage.geminiFree, 1);
  // Le même artiste redemandé dans la foulée : pas de seconde recherche.
  await bg.run('concertsAhead')({ artist: 'Lady Gaga', country: 'FR' });
  assert.equal(g.calls.length, 1);
  // Partout dans le monde : la ville avec son pays.
  await bg.run('concertsAhead')({ artist: 'Earth, Wind & Fire', country: '' });
  assert.match(g.calls[1].body.contents[0].parts[0].text, /l'artiste « Earth, Wind & Fire » dans le monde entier.*\(la ville suivie du pays entre parenthèses\)/s);
});

test('recherche de concerts : la clé payante prend le relais, sans mettre la clé gratuite au repos pour les voix', async () => {
  const g = fakeGemini(({ key }) => (key === 'cle-gratuite' ? { status: 429, message: 'Quota exceeded for metric: generate_content_free_tier_requests, limit: 0' } : { text: day(5) + ' | Paris | La Cigale |' }));
  const bg = loadBackground({ fetch: g.fetch });
  bg.store.geminiKey = 'cle-gratuite';
  bg.store.geminiKey2 = 'cle-payante';
  const r = await bg.run('concertsAhead')({ artist: 'Feu! Chatterton', country: 'FR' });
  assert.deepEqual(g.calls.map((c) => c.key), ['cle-gratuite', 'cle-payante']);
  assert.equal(r.cle, 'payante');
  assert.equal(r.events.length, 1);
  assert.equal(bg.store.aiUsage.geminiPaid, 1);
  // La clé gratuite n'est écartée que pour ces recherches : elle sert toujours aux voix et aux textes.
  assert.equal(bg.run('freeKeyRestUntil'), 0);
  // Recherche suivante : la clé gratuite n'est pas réessayée tout de suite.
  await bg.run('concertsAhead')({ artist: 'Vianney', country: 'FR' });
  assert.deepEqual(g.calls.map((c) => c.key), ['cle-gratuite', 'cle-payante', 'cle-payante']);
});

test('recherche de concerts : sans clé, ou quand aucune clé ne peut chercher, une erreur claire et rien de compté', async () => {
  const none = loadBackground({ fetch: fakeGemini({ text: 'AUCUNE' }).fetch });
  await assert.rejects(none.run('concertsAhead')({ artist: 'Muse', country: 'FR' }), /pas de clé Gemini/);
  const g = fakeGemini({ status: 403, message: 'Search grounding is not enabled for this project' });
  const bg = loadBackground({ fetch: g.fetch });
  bg.store.geminiKey = 'cle-gratuite';
  await assert.rejects(bg.run('concertsAhead')({ artist: 'Muse', country: 'FR' }), /code 403/);
  await assert.rejects(bg.run('concertsAhead')({ artist: 'Orelsan', country: 'FR' }), /la recherche Google ne répond pas avec ta clé Gemini pour le moment/);
  assert.equal(g.calls.length, 1, 'la clé qui ne peut pas chercher n’est pas réessayée à chaque artiste');
  assert.ok(!(bg.store.aiUsage && bg.store.aiUsage.concerts));
  // Une panne chez Google (code 500) n'écarte pas la clé.
  const g5 = fakeGemini(({ n }) => (n === 1 ? { status: 500, message: 'Internal error' } : { text: 'AUCUNE' }));
  const bg5 = loadBackground({ fetch: g5.fetch });
  bg5.store.geminiKey2 = 'cle-payante';
  await assert.rejects(bg5.run('concertsAhead')({ artist: 'Muse', country: 'FR' }));
  const ok = await bg5.run('concertsAhead')({ artist: 'Orelsan', country: 'FR' });
  assert.deepEqual(JSON.parse(JSON.stringify(ok.events)), []);
});

test('recherche de concerts : douze artistes par jour au plus', async () => {
  const g = fakeGemini({ text: 'AUCUNE', bare: true });
  const bg = loadBackground({ fetch: g.fetch });
  bg.store.geminiKey2 = 'cle-payante';
  assert.equal(bg.run('CONCERT_DAY_MAX'), 12);
  for (let i = 0; i < 12; i++) {
    const r = await bg.run('concertsAhead')({ artist: 'Artiste ' + i, country: 'FR' });
    assert.deepEqual(JSON.parse(JSON.stringify(r.events)), []);
    assert.equal(r.suggest, '');
  }
  assert.equal(g.calls.length, 12);
  const over = await bg.run('concertsAhead')({ artist: 'Artiste de trop', country: 'FR' });
  assert.equal(over.capped, true);
  assert.equal(g.calls.length, 12);
  assert.equal(bg.store.aiUsage.concerts, 12);
});

test('test de la recherche depuis les Réglages : une vraie recherche, et la clé qui a servi', async () => {
  const g = fakeGemini({ text: day(30) + ' | Pérols | Sud de France Arena |' });
  const bg = loadBackground({ fetch: g.fetch });
  bg.store.geminiKey2 = 'cle-payante';
  const r = await bg.run('testSourceKey')({ which: 'concerts' });
  assert.equal(r.ok, true);
  assert.equal(r.cle, 'payante');
  assert.equal(r.dates, 1);
  await assert.rejects(bg.run('testSourceKey')({ which: 'ticketmaster' }), /source inconnue/);
});

test('consignes : les dates de concert viennent d’une recherche en ligne et se disent comme annoncées', async () => {
  const bg = loadBackground();
  await bg.run("writeAnnouncement({ kind: 'interlude', host: 'Alex', next: 'X de Y', facts: 'Concerts à venir de Y : 3 décembre 2026 à Pérols.' })");
  const sent = JSON.stringify(bg.__calls[0].body);
  assert.match(sent, /Les concerts à venir viennent d'une recherche en ligne, pas d'une billetterie/);
  assert.match(sent, /présentés comme annoncés/);
  assert.doesNotMatch(sent, /Ticketmaster/);
});

const PANEL = "hasGemini = true; hasKey = true; settings.concerts = true; settings.concertCountry = 'FR'; settings.weatherCity = ''; wikiCache = {}; saveWikiCache = () => {}; dlog = () => {};" +
  "var __asks = []; var __answer = null; claude = async (action, payload) => { if (action === 'concerts') { __asks.push(payload); if (__answer instanceof Error) throw __answer; return typeof __answer === 'function' ? __answer(payload) : __answer; } return null; };" +
  "var __t = (k, artist) => ({ key: k, title: 'Titre ' + k, artist: artist || 'Orelsan' });";

test('flash concert : la recherche est gardée cinq jours, et proposée une fois tous les trois jours par artiste', async () => {
  const p = loadPanel();
  p.run(PANEL + "__answer = { events: [{ date: '" + day(5) + "', city: 'Marseille', venue: 'Le Dôme', festival: '' }, { date: '" + day(6) + "', city: 'Marseille', venue: 'Le Dôme', festival: '' }], cle: 'payante', sources: ['orelsan.show'], suggest: '<div>g</div>' };");
  const line = await p.run("concertsFor(__t('a'))");
  assert.match(line, /^Concerts à venir de Orelsan \(d'après une recherche en ligne, à présenter comme annoncés ; nous sommes le \d/);
  assert.match(line, /à Marseille \(Le Dôme\) ; .* à Marseille \(Le Dôme\)\.$/);
  assert.deepEqual(JSON.parse(JSON.stringify(p.run('__asks'))), [{ artist: 'Orelsan', title: 'Titre a', country: 'FR' }]);
  // La source des dates, pour l'onglet En cours.
  const note = JSON.parse(JSON.stringify(p.run('concertNote')));
  assert.equal(note.artist, 'Orelsan');
  assert.deepEqual(note.sources, ['orelsan.show']);
  assert.equal(note.suggest, '<div>g</div>');
  // Le même titre redemandé (annonce préparée après les fiches) : la même ligne, sans nouvelle recherche.
  assert.equal(await p.run("concertsFor(__t('a'))"), line);
  // Un autre titre du même artiste dans la foulée : déjà proposé, on n'y revient pas avant trois jours.
  assert.equal(await p.run("concertsFor(__t('b'))"), '');
  assert.equal(p.run('__asks.length'), 1);
  // Quatre jours plus tard : proposé de nouveau, depuis la réponse gardée (pas de nouvelle recherche).
  p.run("wikiCache['gscsaid:' + artistK('Orelsan')].at -= 4 * 86400000; wikiCache['gsc:' + artistK('Orelsan') + '|FR'].at -= 4 * 86400000; concertLines.clear();");
  assert.match(await p.run("concertsFor(__t('c'))"), /Marseille/);
  assert.equal(p.run('__asks.length'), 1);
  // Six jours après la recherche : elle est refaite.
  p.run("wikiCache['gscsaid:' + artistK('Orelsan')].at -= 4 * 86400000; wikiCache['gsc:' + artistK('Orelsan') + '|FR'].at -= 2 * 86400000; concertLines.clear();");
  await p.run("concertsFor(__t('d'))");
  assert.equal(p.run('__asks.length'), 2);
});

test('flash concert : aucune date, plafond du jour, panne : rien n’est dit, et on n’insiste pas', async () => {
  const p = loadPanel();
  // Aucune date : rien à dire, et la réponse est gardée (pas de nouvelle recherche au titre suivant).
  p.run(PANEL + '__answer = { events: [], cle: "gratuite" };');
  assert.equal(await p.run("concertsFor(__t('a', 'Coldplay'))"), '');
  assert.equal(await p.run("concertsFor(__t('b', 'Coldplay'))"), '');
  assert.equal(p.run('__asks.length'), 1);
  assert.equal(p.run('concertNote'), null);
  // Plafond du jour atteint côté service : rien n'est gardé, et on n'y revient pas avant une heure.
  p.run('__answer = { capped: true };');
  assert.equal(await p.run("concertsFor(__t('c', 'Muse'))"), '');
  assert.equal(p.run("!!wikiCache['gsc:' + artistK('Muse') + '|FR']"), false);
  assert.equal(await p.run("concertsFor(__t('d', 'Angèle'))"), '');
  assert.equal(p.run('__asks.length'), 2, 'pas de nouvelle demande pendant la pause');
  // Une panne : pause d'une demi-heure.
  p.run("concertPause = 0; __answer = new Error('la recherche Google ne répond pas');");
  assert.equal(await p.run("concertsFor(__t('e', 'Pomme'))"), '');
  assert.ok(p.run('concertPause') > Date.now() + 25 * 60e3);
  // Une date passée entre-temps (réponse gardée cinq jours) ne s'annonce plus.
  p.run("concertPause = 0; wikiCache['gsc:' + artistK('Indochine') + '|FR'] = { at: Date.now() - 86400000, events: [{ date: '" + day(-1) + "', city: 'Paris', venue: 'La Seine Musicale', festival: '' }] };");
  assert.equal(await p.run("concertsFor(__t('f', 'Indochine'))"), '');
  // Éteint dans les Réglages : la fiche ne demande rien.
  p.run("settings.concerts = false; var __before = __asks.length;");
  assert.equal(p.run('concertsOn()'), false);
});

test('flash concert : une longue série dans la même salle se dit au mois, la ville de l’auditeur passe d’abord', () => {
  const p = loadPanel();
  const items = (list, home) => [...p.run('concertItems')(list, home)];
  const e = (date, city, venue, festival) => ({ date, city, venue: venue || '', festival: festival || '' });
  // Six soirs à Paris en décembre : le mois suffit. Deux soirs à Marseille : les deux dates.
  const got = items([e('2026-12-02', 'Marseille', 'Le Dôme'), e('2026-12-03', 'Marseille', 'Le Dôme'), e('2026-12-08', 'Paris', 'Accor Arena'), e('2026-12-09', 'Paris', 'Accor Arena'),
    e('2026-12-10', 'Paris', 'Accor Arena'), e('2026-12-11', 'Paris', 'Accor Arena'), e('2026-12-13', 'Paris', 'Accor Arena'), e('2026-12-14', 'Paris', 'Accor Arena')], '');
  assert.deepEqual(got, ['2 décembre 2026 à Marseille (Le Dôme)', '3 décembre 2026 à Marseille (Le Dôme)', 'plusieurs soirs en décembre 2026 à Paris (Accor Arena)']);
  // Chez toi d'abord, et jamais plus de quatre éléments.
  const home = items([e('2027-01-14', 'Reims', 'La Cartonnerie'), e('2027-01-20', 'Dijon', 'La Vapeur'), e('2027-01-21', 'Grenoble', 'La Belle Électrique'), e('2027-01-22', 'Strasbourg', 'La Laiterie'),
    e('2027-02-03', 'Brest', 'La Carène'), e('2027-06-26', 'Chambord', '', 'Chambord Live')], p.run("C.norm('Brest')"));
  assert.equal(home.length, 4);
  assert.equal(home[0], '3 février 2027 à Brest (La Carène), près de chez toi');
  assert.equal(home[1], '14 janvier 2027 à Reims (La Cartonnerie)');
  // Un festival est nommé ; le 1er du mois se dit « 1er ».
  assert.deepEqual(items([e('2027-07-01', 'Arras', 'Citadelle', 'Main Square Festival')], ''), ['1er juillet 2027 à Arras (Citadelle), au festival Main Square Festival']);
});

test('flash concert : une recherche trop lente ne retarde pas l’annonce, et sa réponse sert la fois suivante', async () => {
  const p = loadPanel();
  p.run(PANEL + "var __release = null; __answer = () => new Promise((res) => { __release = () => res({ events: [{ date: '" + day(9) + "', city: 'Rennes', venue: 'Le Liberté', festival: '' }], cle: 'payante', sources: [] }); });" +
    // L'attente est coupée tout de suite, comme si les neuf secondes étaient passées.
    "var __wt = withTimeout; withTimeout = (pr, ms) => (ms === CONCERT_WAIT ? Promise.reject(new Error('trop long')) : __wt(pr, ms));");
  assert.equal(p.run('CONCERT_WAIT'), 9000);
  assert.equal(await p.run("concertsFor(__t('a', 'Ninho'))"), '');
  // La recherche finit après coup : elle est gardée.
  p.run('__release();');
  await new Promise((r) => setImmediate(r));
  await new Promise((r) => setImmediate(r));
  assert.equal(p.run("wikiCache['gsc:' + artistK('Ninho') + '|FR'].events.length"), 1);
  assert.match(await p.run("concertsFor(__t('b', 'Ninho'))"), /à Rennes \(Le Liberté\)/);
  assert.equal(p.run('__asks.length'), 1);
  // Les restes de Ticketmaster et les vieilles réponses sont retirés de la mémoire des fiches.
  p.run("wikiCache['tm:x|FR'] = { at: Date.now(), events: [] }; wikiCache['tmsaid:x'] = { at: Date.now() }; wikiCache['gsc:vieux|FR'] = { at: Date.now() - 6 * 86400000, events: [] }; wikiCache['w:autre'] = { at: Date.now() - 30 * 86400000 }; pruneConcerts();");
  assert.deepEqual([...p.run("Object.keys(wikiCache).filter((k) => /^(tm|gsc:vieux|w:autre)/.test(k))")], ['w:autre']);
});

test('flash concert : demandé clairement quand la fiche donne des dates, jamais pendant un jeu', async () => {
  const bg = loadBackground();
  const fiche = 'Données sur le morceau « X » (MusicBrainz) : Première sortie : 2021.\nConcerts à venir de Y (d\'après une recherche en ligne, à présenter comme annoncés ; nous sommes le 28 novembre 2026) : 3 décembre 2026 à Pérols (Sud de France Arena).';
  const ask = async (extra) => {
    bg.__calls.length = 0;
    await bg.run('writeAnnouncement')(Object.assign({ kind: 'interlude', host: 'Alex', next: 'X de Y', facts: fiche }, extra || {}));
    return bg.__calls[0].body.messages[0].content;
  };
  assert.match(await ask(), /FLASH CONCERT, à placer cette fois : les fiches donnent des concerts à venir de l'artiste\. Dis-les en une phrase, après l'histoire et juste avant de lancer le titre, présentés comme annoncés/);
  // Une fiche sans dates : pas de flash demandé.
  assert.doesNotMatch(await ask({ facts: 'Données sur le morceau « X » (MusicBrainz) : Première sortie : 2021.' }), /FLASH CONCERT/);
  // Pendant un vrai ou faux, ou la réponse à une question : le jeu d'abord.
  assert.doesNotMatch(await ask({ express: { truth: 'vrai', bet: 'vrai', won: true, score: { A: 0, B: 1 }, gage: '' }, duo: true, cohost: 'Sam', turns: 4 }), /FLASH CONCERT/);
  assert.doesNotMatch(await ask({ hookAnswer: { type: 'question', title: 'X de Y', truth: 'vrai', question: 'q', answer: 'r' } }), /FLASH CONCERT/);
});

test('les concerts ne sont cherchés que pour être dits : ni pour les fiches préparées d’avance, ni pour un jeu', async () => {
  const p = loadPanel();
  p.run(PANEL + "__answer = { events: [{ date: '" + day(12) + "', city: 'Lille', venue: 'Zénith', festival: '' }], cle: 'payante', sources: [] };" +
    "artistFacts = async () => ''; artistWiki = async () => null; songFacts = async () => null; extCached = async () => null;");
  const t = "__t('a', 'Angèle')";
  // Fiches du début d'émission, vrai ou faux : pas de recherche.
  assert.doesNotMatch((await p.run('factsFor(' + t + ', { concerts: false })')).text, /Concerts à venir/);
  assert.equal(p.run('__asks.length'), 0);
  // Une annonce qui s'appuie sur la fiche : la recherche est faite, et la ligne arrive avec la fiche.
  const f = await p.run('factsFor(' + t + ')');
  assert.match(f.text, /Concerts à venir de Angèle .* à Lille \(Zénith\)\./);
  assert.match(f.src, /concerts/);
  assert.equal(p.run('__asks.length'), 1);
  // Dans le code : le début d'émission et le jeu passent bien « sans concerts ».
  const src = (f2) => fs.readFileSync(path.join(DIR, f2), 'utf8');
  assert.match(src('mdj-moteur.js'), /factsFor\(t, \{ concerts: false \}\)/);
  assert.match(src('mdj-annonces.js'), /factsFor\(t2, \{ concerts: false \}\)/);
  assert.match(src('mdj-annonces.js'), /factsFor\(t, \{ concerts: plan\.angle\.id !== 'jeu' && t === next \}\)/);
});
