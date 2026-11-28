'use strict';
// 2.39 : les fiches des anecdotes. Noms d'artistes (plus coupés à la virgule ou au « & »), bon article pour le
// morceau (la chanson, pas l'album ni un homonyme), version d'origine dans MusicBrainz, ordre des fiches,
// anecdote notée « déjà racontée » quand elle passe à l'antenne, et plus d'anecdote sans fiche.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadPanel, loadBackground } = require('./helpers');

const json = (data) => ({ ok: true, status: 200, json: async () => data });
// Faux Wikipédia : pages = { fr: { 'Titre': { intro, full, to (redirection) } }, en: {…} }, search = { fr: [titres], en: [titres] }.
function fakeWiki(pages, search, log) {
  return async (url) => {
    const u = new URL(url);
    const lang = u.hostname.split('.')[0];
    const q = u.searchParams;
    if (log) log.push(lang + ' ' + (q.get('list') === 'search' ? 'recherche « ' + q.get('srsearch') + ' »' : (q.get('exintro') ? 'débuts ' : 'article ') + q.get('titles')));
    if (q.get('list') === 'search') return json({ query: { search: ((search || {})[lang] || []).map((title) => ({ title })) } });
    const out = {};
    let id = 1;
    for (const asked of String(q.get('titles') || '').split('|')) {
      let title = asked;
      let pg = (pages[lang] || {})[title];
      if (pg && pg.to) { title = pg.to; pg = (pages[lang] || {})[title]; }
      if (!pg) out['-' + id++] = { title: asked, missing: '' };
      else out[String(100 + id++)] = { title, extract: q.get('exintro') ? pg.intro : (pg.full || pg.intro) };
    }
    return json({ query: { pages: out } });
  };
}

test('noms d’artistes : le nom entier d’un groupe, l’artiste principal d’une collaboration, la même règle des deux côtés', () => {
  const bg = loadBackground();
  const p = loadPanel();
  const one = (a) => bg.run('firstArtistName')(a);
  const all = (a) => [...bg.run('artistNames')(a)];
  // De vrais noms de groupes : jamais coupés.
  for (const a of ['Earth, Wind & Fire', 'Simon & Garfunkel', 'Kool & the Gang', 'Brooks & Dunn', 'Tyler, the Creator', 'Crosby, Stills, Nash & Young', 'Emerson, Lake & Palmer',
    'Bob Marley & The Wailers', 'Nick Cave & The Bad Seeds', 'Bill Haley & His Comets', 'Mumford & Sons', 'Iron & Wine', 'Sly & the Family Stone', 'AC/DC', 'Toto']) {
    assert.equal(one(a), a, a);
  }
  assert.deepEqual(all('Earth, Wind & Fire'), ['Earth, Wind & Fire'], 'pas de repli sur « Earth », qui est un autre groupe');
  assert.deepEqual(all('Simon & Garfunkel'), ['Simon & Garfunkel']);
  // De vraies collaborations : l'artiste principal, avec le nom entier essayé d'abord là où deux essais sont possibles.
  assert.equal(one('Lady Gaga & Bradley Cooper'), 'Lady Gaga');
  assert.equal(one('Ella Fitzgerald & Louis Armstrong'), 'Ella Fitzgerald');
  assert.equal(one('Hans Zimmer & James Newton Howard'), 'Hans Zimmer');
  assert.deepEqual(all('Lady Gaga & Bradley Cooper'), ['Lady Gaga & Bradley Cooper', 'Lady Gaga']);
  assert.deepEqual(all('Bob Marley & The Wailers'), ['Bob Marley & The Wailers', 'Bob Marley']);
  assert.equal(one('Daft Punk feat. Pharrell Williams'), 'Daft Punk');
  assert.equal(one('  '), '');
  // « & », « and », « et » se valent ; « The » de tête ignoré.
  const norm = bg.run('normArtist');
  assert.equal(norm('Earth, Wind & Fire'), norm('Earth, Wind and Fire'));
  assert.equal(norm('Simon & Garfunkel'), norm('Simon et Garfunkel'));
  assert.equal(norm('The Dead South'), norm('Dead South'));
  assert.notEqual(norm('Earth'), norm('Earth, Wind & Fire'));
  // Le texte parle-t-il de l'artiste : par mots entiers.
  const has = bg.run('hasArtist');
  assert.equal(has('Yesterday is a song by the Beatles.', ['Yes']), false);
  assert.equal(has('A fair deal was a hit for Somebody.', ['Air']), false);
  assert.equal(has('Owner of a Lonely Heart est une chanson de Yes, sortie en 1983.', ['Yes']), true);
  assert.equal(has('September est une chanson du groupe Earth, Wind and Fire.', ['Earth, Wind & Fire']), true);
  // Tous les noms du catalogue qui étaient coupés : la règle du panneau et celle du service donnent le même nom.
  const cut = [...p.run("[...new Set(CATALOG.map((t) => t.artist))].filter((a) => /,| & | feat\\.? | x /i.test(a))")];
  assert.ok(cut.length >= 70, cut.length + ' noms');
  for (const a of cut.concat(['Lady Gaga & Bradley Cooper', 'A, B', 'Daft Punk feat. Pharrell Williams', 'Luke Combs'])) assert.equal(p.run('mainArtist')(a), one(a), a);
  // La clé de cache ne confond plus « Earth, Wind & Fire » et « Earth ».
  assert.notEqual(p.run("artistK('Earth, Wind & Fire')"), p.run("artistK('Earth')"));
  // Avant la 2.39, aucun de ces noms n'était cherché en entier. Les autres sont des collaborations (ou des duos au
  // nom en deux parties), pour lesquels Wikipédia et MusicBrainz essaient quand même le nom entier d'abord.
  const whole = cut.filter((a) => one(a) === a).length;
  assert.ok(whole >= 45, whole + ' noms entiers sur ' + cut.length);
  for (const a of cut) assert.equal(all(a)[0], a, 'le nom entier est toujours le premier essayé');
});

test('ce qu’est un article, d’après sa première phrase', () => {
  const bg = loadBackground();
  const kind = bg.run('wikiKind');
  assert.equal(kind('Born to Run est une chanson de Bruce Springsteen, extraite de l’album du même nom.'), 'chanson');
  assert.equal(kind('Born to Run est le troisième album de Bruce Springsteen, sorti en 1975.'), 'album');
  assert.equal(kind('"Thriller" is a song by American singer Michael Jackson, from his album Thriller.'), 'chanson');
  assert.equal(kind('Thriller is the sixth studio album by the American singer Michael Jackson.'), 'album');
  assert.equal(kind('Purple Rain est un film musical américain réalisé par Albert Magnoli.'), 'autre');
  assert.equal(kind('Yes est un groupe britannique de rock progressif formé à Londres en 1968.'), '');
});

test('fiche du morceau : la chanson plutôt que l’album du même nom, et l’album seulement s’il n’y a rien d’autre, dit comme tel', async () => {
  const album = { intro: 'Born to Run est le troisième album de Bruce Springsteen, sorti en 1975.', full: 'Born to Run est le troisième album de Bruce Springsteen, sorti en 1975.\n\n== Historique ==\nL’album est enregistré en quatorze mois, de 1974 à 1975, au Record Plant de New York.' };
  const song = { intro: 'Born to Run est une chanson de Bruce Springsteen, parue en 1975 sur l’album du même nom.', full: 'Born to Run est une chanson de Bruce Springsteen, parue en 1975 sur l’album du même nom.\n\n== Genèse ==\nSpringsteen écrit le texte début 1974 dans une maison de Long Branch, et passe six mois sur ce seul titre.' };
  const log = [];
  const bg = loadBackground({ fetch: fakeWiki({ fr: { 'Born to Run': album, 'Born to Run (chanson)': song } }, { fr: ['Born to Run', 'Born to Run Tour'] }, log) });
  const r = await bg.run('songFacts')({ title: 'Born to Run', artist: 'Bruce Springsteen' });
  assert.equal(r.page, 'Born to Run (chanson)');
  assert.equal(r.kind, 'chanson');
  assert.match(r.text, /six mois sur ce seul titre/);
  assert.equal(log.filter((x) => /^fr article /.test(x)).length, 1, 'un seul article lu en entier : ' + log.join(' | '));
  // Pas d'article sur la chanson : celui de l'album, étiqueté.
  const bg2 = loadBackground({ fetch: fakeWiki({ fr: { 'Born to Run': album } }, { fr: ['Born to Run'] }) });
  const r2 = await bg2.run('songFacts')({ title: 'Born to Run (Remastered 2015)', artist: 'Bruce Springsteen' });
  assert.equal(r2.kind, 'album');
  assert.match(r2.text, /quatorze mois/);
  // Un film du même nom n'est jamais pris pour la fiche du morceau.
  const film = { intro: 'Purple Rain est un film musical américain réalisé par Albert Magnoli, avec Prince, sorti en 1984.' };
  const bg3 = loadBackground({ fetch: fakeWiki({ fr: { 'Purple Rain': film } }, { fr: ['Purple Rain'] }) });
  assert.equal((await bg3.run('songFacts')({ title: 'Purple Rain', artist: 'Prince' })).text, '');
});

test('fiche du morceau : un homonyme n’est plus pris parce que les lettres du nom de l’artiste traînent dans le texte', async () => {
  // « Catch » de Brett Young. L'article trouvé est une autre chanson : son texte contient « yes » dans « yesterday » et
  // parle d'un autre Young. Avant : pris. Maintenant : refusé, le nom entier de l'artiste n'y est pas.
  const other = { intro: 'Catch est une chanson du groupe The Cure, parue en 1987.', full: 'Catch est une chanson du groupe The Cure, parue en 1987. Neil Young la cite parmi ses préférées. Yesterday, le groupe…' };
  const bg = loadBackground({ fetch: fakeWiki({ fr: { 'Catch (chanson)': other }, en: {} }, { fr: ['Catch (chanson)'], en: [] }) });
  assert.equal((await bg.run('songFacts')({ title: 'Catch', artist: 'Brett Young' })).text, '');
  // Artiste au nom très court : il doit être cité dès le début de l'article.
  const far = { intro: 'Sexy Boy est une chanson parue en 1998.', full: 'Sexy Boy est une chanson parue en 1998. ' + 'Elle a beaucoup tourné à la radio. '.repeat(40) + 'Le groupe Air la joue encore sur scène.' };
  const near = { intro: 'Sexy Boy est une chanson du groupe Air, parue en 1998 sur l’album Moon Safari, et son premier grand succès.' };
  const bg2 = loadBackground({ fetch: fakeWiki({ fr: { 'Sexy Boy': far }, en: {} }, { fr: ['Sexy Boy'], en: [] }) });
  assert.equal((await bg2.run('songFacts')({ title: 'Sexy Boy', artist: 'Air' })).text, '');
  const bg3 = loadBackground({ fetch: fakeWiki({ fr: { 'Sexy Boy': near } }, { fr: ['Sexy Boy'] }) });
  assert.equal((await bg3.run('songFacts')({ title: 'Sexy Boy', artist: 'Air' })).page, 'Sexy Boy');
  // Nom de groupe avec « & » : reconnu sous sa forme « and ».
  const sept = { intro: 'September est une chanson du groupe américain Earth, Wind and Fire, sortie en 1978.' };
  const bg4 = loadBackground({ fetch: fakeWiki({ fr: { 'September (chanson)': sept } }, { fr: ['September (chanson)', 'September'] }) });
  assert.equal((await bg4.run('songFacts')({ title: 'September', artist: 'Earth, Wind & Fire' })).page, 'September (chanson)');
});

test('article de l’artiste : « Earth, Wind & Fire » n’est plus raconté avec l’article du groupe « Earth »', async () => {
  const ewf = { intro: 'Earth, Wind and Fire est un groupe américain de funk, formé à Chicago en 1969 par Maurice White.', full: 'Earth, Wind and Fire est un groupe américain de funk, formé à Chicago en 1969 par Maurice White.\n\n== Histoire ==\nMaurice White, ancien batteur de studio chez Chess Records, fonde le groupe et lui donne le nom des trois éléments de son signe astrologique. Le groupe connaît le succès dans les années 1970.' };
  const earth = { intro: 'Earth est un groupe de drone doom américain, originaire d’Olympia.', full: 'Earth est un groupe de drone doom américain, originaire d’Olympia.\n\n== Histoire ==\nLe groupe est formé en 1989 par Dylan Carlson, et il enregistre plusieurs albums de drone, très lents et très lourds, qui influencent toute une scène dans les années 1990.' };
  const pages = { fr: { 'Earth, Wind and Fire': ewf, 'Earth, Wind & Fire': { to: 'Earth, Wind and Fire' }, 'Earth (groupe)': earth, Earth: { intro: 'Earth peut désigner : la Terre, en anglais ; Earth, un groupe.' } } };
  const bg = loadBackground({ fetch: fakeWiki(pages, { fr: ['Earth (groupe)', 'Earth, Wind and Fire'] }) });
  const r = await bg.run('wikiArtist')({ artist: 'Earth, Wind & Fire' });
  assert.equal(r.page, 'Earth, Wind and Fire');
  assert.match(r.text, /Maurice White/);
  // Le groupe Earth, lui, garde le sien.
  assert.equal((await bg.run('wikiArtist')({ artist: 'Earth' })).page, 'Earth (groupe)');
  // Une vraie collaboration : pas d'article au nom des deux, on prend l'artiste principal.
  const gaga = { intro: 'Lady Gaga est une chanteuse américaine, née en 1986 à New York.', full: 'Lady Gaga est une chanteuse américaine, née en 1986 à New York.\n\n== Carrière ==\nElle débute dans les clubs du Lower East Side avant de signer son premier contrat, et sort son premier album en 2008. Elle devient en quelques mois l’une des artistes les plus écoutées au monde.' };
  const bg2 = loadBackground({ fetch: fakeWiki({ fr: { 'Lady Gaga': gaga }, en: {} }, { fr: ['Lady Gaga'], en: [] }) });
  assert.equal((await bg2.run('wikiArtist')({ artist: 'Lady Gaga & Bradley Cooper' })).page, 'Lady Gaga');
});

test('MusicBrainz : la première sortie est celle de la version d’origine, pas d’un concert ni d’un pirate', async () => {
  const rec = (id, date, n, dis, who) => ({ id, score: 100, title: 'Born to Run', 'first-release-date': date, disambiguation: dis || '', releases: Array(n || 1).fill({}), 'artist-credit': [{ name: who || 'Bruce Springsteen' }] });
  // official : les 100 premiers enregistrements « officiels » ; older : ceux que la vérification « plus ancien ? » trouve ; any : sans filtre.
  const run = async (official, older, any) => {
    const urls = [];
    const bg = loadBackground({ fetch: async (url) => {
      const u = decodeURIComponent(String(url).replace('https://musicbrainz.org/ws/2/', ''));
      urls.push(u);
      if (/^recording\?/.test(u)) return json({ recordings: /firstreleasedate:/.test(u) ? older.filter((r) => Number(r['first-release-date'].slice(0, 4)) <= Number((u.match(/TO (\d{4})\]/) || [])[1])) : /status:official/.test(u) ? official : any });
      const id = (u.match(/^recording\/([a-z0-9]+)/) || [])[1];
      const hit = official.concat(older, any).find((r) => r.id === id);
      return json({ 'first-release-date': hit ? hit['first-release-date'] : '', relations: [] });
    } });
    bg.setTimeout = (f) => setImmediate(f);
    const r = await bg.run('mbRecording')({ title: 'Born to Run', artist: 'Bruce Springsteen' });
    return { r, urls };
  };
  // L'original est dans la liste : c'est l'enregistrement le plus réédité, ses détails et sa date sont pris.
  const a = await run([rec('edit', '1976', 2, '3:10 edited version'), rec('studio', '1975-08-25', 436), rec('live85', '1986-11-10', 40, 'live'), rec('autre', '1960', 900, '', 'Someone Else')], [], [rec('pirate', '1974', 1)]);
  assert.match(a.urls[0], /^recording\?limit=100&query=recording:"Born to Run" AND artist:"Bruce Springsteen" AND status:official&/);
  assert.match(a.urls[1], /AND status:official AND firstreleasedate:\[1900 TO 1974\]/, 'on vérifie qu’il n’existe pas plus ancien');
  assert.match(a.urls[2], /^recording\/studio\?/, 'les détails sont lus sur la version d’origine : ' + a.urls[2]);
  assert.equal(a.urls.filter((u) => /^recording\?/.test(u)).length, 2, 'les pirates ne sont jamais demandés');
  assert.match(a.r.text, /Première sortie : 1975-08-25\./);
  // L'original n'est pas dans les 100 premiers résultats (seulement des rééditions et des concerts officiels) :
  // la vérification le retrouve.
  const b = await run([rec('edit', '1976', 2, '3:10 edited version'), rec('live85', '1986-11-10', 40, 'live')], [rec('studio', '1975-08-25', 436)], []);
  assert.match(b.urls[1], /firstreleasedate:\[1900 TO 1975\]/);
  assert.match(b.urls[2], /firstreleasedate:\[1900 TO 1974\]/);
  assert.match(b.urls[3], /^recording\/studio\?/);
  assert.match(b.r.text, /Première sortie : 1975-08-25\./);
  // L'enregistrement le plus réédité est plus tardif que la toute première sortie (un single paru avant l'album) :
  // l'année juste, sans le jour.
  const c = await run([rec('single', '1979-11', 3), rec('album', '1980-07-25', 127)], [], []);
  assert.match(c.urls[2], /^recording\/album\?/);
  assert.match(c.r.text, /Première sortie : 1979\./);
  // Rien d'officiel : on se contente de ce qui existe.
  const d = await run([], [], [rec('live81', '1981-05-08', 1, 'live'), rec('plain', '1979', 2)]);
  assert.match(d.urls[d.urls.length - 1], /^recording\/plain\?/);
  assert.match(d.r.text, /Première sortie : 1979\./);
});

test('ordre des fiches : celle du morceau passe avant l’article de l’artiste ; l’article d’un album est dit comme tel', async () => {
  const p = loadPanel();
  p.run("var __song = { text: 'HISTOIRE DE LA CHANSON', lang: 'fr', kind: 'chanson' };" +
    "claude = async (action) => (action === 'wiki' ? __song : action === 'wikiartist' ? { text: 'ARTICLE DE L’ARTISTE '.repeat(120), lang: 'fr' } : action === 'mbartist' ? { text: 'Groupe formé en 1969.' } : {});" +
    "artistByName = async () => null; wikiCache = {};");
  const f = await p.run("factsFor({ title: 'September', artist: 'Earth, Wind & Fire', key: 'k1' })");
  const iSong = f.text.indexOf('HISTOIRE DE LA CHANSON');
  const iArtist = f.text.indexOf('ARTICLE DE L’ARTISTE');
  assert.ok(iSong > 0 && iArtist > iSong, 'morceau à ' + iSong + ', artiste à ' + iArtist);
  assert.ok(f.text.indexOf('Groupe formé en 1969.') < iSong, 'les faits courts d’abord');
  assert.match(f.text, /Fiche du morceau « September »/);
  // Avec la limite des consignes (8 500 signes), la fiche du morceau est toujours entière.
  assert.ok(f.text.slice(0, 8500).includes('HISTOIRE DE LA CHANSON'));
  // Article de l'album, faute de mieux.
  p.run("__song = { text: 'HISTOIRE DE L’ALBUM', lang: 'fr', kind: 'album' }; wikiCache = {};");
  const g = await p.run("factsFor({ title: 'Born to Run', artist: 'Bruce Springsteen', key: 'k2' })");
  assert.match(g.text, /Article sur l'album du même nom « Born to Run » \(Wikipédia ; c'est l'album, pas la chanson/);
  assert.match(g.src, /album/);
  // Fiches gardées avant la 2.39 : refaites une fois.
  p.run("var __n = 0; claude = async (action) => { if (action === 'wiki') __n++; return {}; }; wikiCache = {}; wikiCache[C.keyOf('Toto', 'Africa')] = { at: Date.now(), text: 'vieille fiche', lang: 'fr' };");
  await p.run("songFacts({ title: 'Africa', artist: 'Toto' })");
  await p.run("songFacts({ title: 'Africa', artist: 'Toto' })");
  assert.equal(p.run('__n'), 1, 'refaite une fois, puis gardée');
});

test('anecdote : notée « déjà racontée » quand elle passe à l’antenne, et jamais d’anecdote sans fiche', async () => {
  const p = loadPanel();
  p.run("var __pay = null; claude = async (action, payload) => { if (action === 'announce') { __pay = payload; return 'A: Ce titre a été écrit en une nuit.\\nB: Une nuit ?'; } return {}; };" +
    "var __fiche = 'Le titre a été écrit en une nuit, en 1997.'; factsFor = async () => ({ text: __fiche, src: 'wiki' }); genreFacts = async () => null; weatherLine = async () => '';" +
    "speak = async () => {}; call = async () => ({ ok: true }); callSafe = async () => ({ ok: true }); toldCache = {};" +
    "Object.assign(settings, { radio: true, programme: true, claudeAnnounce: true, radioFreq: 'every', rhythm: 'regulier', guestFreq: 'off', hostPicks: 'off', chat: 'off', voiceEngine: 'systeme', hostName: 'Alex' }); hasKey = true;" +
    // Le type d'anecdote est fixé (l'histoire du titre suivant) : c'est la suite qu'on vérifie ici.
    "var __plan = planAnnouncement; planAnnouncement = function () { var pl = __plan.apply(null, arguments); pl.angle = ANGLES_SOLO.find((a) => a.id === 'anecdote'); return pl; };" +
    "var __t = (k) => ({ key: k, title: 'Titre ' + k, artist: 'Artiste ' + k, energy: 3 });" +
    "var __mk = () => ({ id: 's1', sel: clone(DEFAULT_SEL), queue: ['b', 'c', 'd'].map(__t), played: [], lastLines: [], startedAt: Date.now(), transitions: 3, programme: { keys: ['a', 'b', 'c'], at: 0 } });");
  // Chronique (anecdote) sur le deuxième titre du programme.
  p.run("var __s = __mk();");
  const ann = await p.run("prepareAnnouncement(__s, 'interlude', __t('a'), __s.queue[0], Date.now() + 6e4, { voice: 'later' })");
  assert.match(p.run('__pay.facts'), /écrit en une nuit/);
  assert.equal(p.run("toldFor(['s:' + C.keyOf('Artiste b', 'Titre b')]).length"), 0, 'préparée, pas encore dite');
  await p.run('sayIt')(ann);
  assert.equal(p.run("toldFor(['s:' + C.keyOf('Artiste b', 'Titre b')]).length"), 1, 'dite : retenue');
  // Aucune fiche, ni sur le titre, ni sur le style : pas d'anecdote, une conversation qui n'en a pas besoin.
  p.run("__pay = null; __fiche = ''; __s = __mk();");
  const ann2 = await p.run("prepareAnnouncement(__s, 'interlude', __t('a'), __s.queue[0], Date.now() + 6e4, { voice: 'later' })");
  const pay = JSON.parse(JSON.stringify(p.run('__pay')));
  assert.equal(pay.facts, '');
  assert.equal(pay.role, null, 'plus une chronique');
  assert.equal(pay.chatMode, true);
  assert.ok(pay.pivot);
  assert.doesNotMatch(pay.angle, /histoire vraie|d'après les fiches|anecdote/i);
  assert.equal(ann2.told, null);
  assert.equal(ann2.rubrique, '');
});

test('consignes : l’IA n’entend pas la musique, et sans fiche elle n’affirme rien', async () => {
  const bg = loadBackground();
  await bg.run("writeAnnouncement({ kind: 'talkover', host: 'Alex', next: 'X de Y', facts: 'AUCUNE FICHE' })");
  const b = bg.__calls[0].body;
  assert.match(b.system[0].text, /Tu n'entends pas la musique : ne décris jamais le son d'un morceau/);
  assert.match(b.messages[0].content, /ne raconte pas d'anecdote et n'affirme aucun fait sur le morceau ou l'artiste/);
  assert.doesNotMatch(b.messages[0].content, /fait de culture générale vrai et connu/);
});
