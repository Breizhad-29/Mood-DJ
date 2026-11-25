// Mood DJ — logique pure (sans DOM) : listes, catalogue, courbe d'énergie,
// choix des titres et rapprochement avec les résultats de YouTube Music.
/* exported MDJ_CORE */
var MDJ_CORE = (function () {
  'use strict';

  // live : recherche des playlists de nouveautés de YouTube Music (époque « Actuel »)
  const STYLES = [
    { id: 'all', label: 'Tous les styles', subs: [], live: 'nouveautés' },
    { id: 'rock', label: 'Rock', subs: [['soft', 'Soft'], ['classic', 'Classic'], ['hard', 'Hard'], ['sudiste', 'Sudiste'], ['inde', 'Indé'], ['punk', 'Punk'], ['grunge', 'Grunge / alternatif'], ['prog', 'Prog / psyché']], live: 'nouveautés rock' },
    { id: 'poprock', label: 'Pop rock', subs: [['8090', 'Années 80-90'], ['2000', 'Années 2000-2010'], ['actuel', 'Actuel'], ['fr', 'Français']], live: 'nouveautés pop rock' },
    { id: 'country', label: 'Country', subs: [['balade', 'Balade'], ['dance', 'Dance / line dance'], ['moderne', 'Moderne'], ['outlaw', 'Outlaw / americana']], live: 'country hotlist' },
    { id: 'pop', label: 'Pop', subs: [['actuelle', 'Actuelle'], ['8090', 'Années 80-90'], ['synth', 'Synth-pop'], ['indie', 'Indie pop']], live: 'nouveautés pop' },
    { id: 'electro', label: 'Électro', subs: [['house', 'House'], ['techno', 'Techno'], ['synthwave', 'Synthwave'], ['dance', 'Dance 90-2000'], ['dnb', 'Drum & bass'], ['trance', 'Trance'], ['ambient', 'Ambient']], live: 'nouveautés électro' },
    { id: 'rap', label: 'Rap', subs: [['fr', 'Français'], ['us', 'US']], live: { fr: 'nouveautés rap français', us: 'new rap', _: 'nouveautés rap' } },
    { id: 'hiphop', label: 'Hip-hop', subs: [['fr', 'Français'], ['us', 'US']], live: { fr: 'nouveautés hip-hop français', us: 'new hip hop', _: 'nouveautés hip-hop' } },
    { id: 'metal', label: 'Métal', subs: [['heavy', 'Heavy'], ['moderne', 'Moderne'], ['symphonique', 'Symphonique']], live: 'nouveautés metal' },
    { id: 'blues', label: 'Blues / folk', subs: [['blues', 'Blues'], ['folk', 'Folk']], live: { blues: 'nouveautés blues', _: 'nouveautés folk' } },
    { id: 'soul', label: 'Soul / funk / disco', subs: [['soul', 'Soul / R&B'], ['funk', 'Funk'], ['disco', 'Disco']], live: 'nouveautés r&b soul' },
    { id: 'reggae', label: 'Reggae', subs: [['roots', 'Roots'], ['dancehall', 'Dancehall'], ['fr', 'Reggae français']], live: 'nouveautés reggae' },
    { id: 'jazz', label: 'Jazz', subs: [['swing', 'Swing / big band'], ['cool', 'Cool / modal'], ['vocal', 'Vocal'], ['moderne', 'Moderne / fusion'], ['manouche', 'Manouche']], live: 'nouveautés jazz' },
    { id: 'latino', label: 'Latino', subs: [['tropical', 'Salsa / tropical'], ['reggaeton', 'Reggaeton'], ['pop', 'Pop latine'], ['flamenco', 'Flamenco / rumba']], live: 'nouveautés latino' },
    { id: 'classique', label: 'Classique', subs: [['baroque', 'Baroque'], ['romantique', 'Classique et romantique'], ['moderne', 'Moderne / néo-classique'], ['lyrique', 'Opéra et chœurs']], live: 'nouveautés musique classique' },
    { id: 'bo', label: 'Films et jeux vidéo', subs: [['films', 'Films'], ['series', 'Séries'], ['jeux', 'Jeux vidéo'], ['epique', 'Épique']], live: 'nouvelles bandes originales' },
    { id: 'lofi', label: 'Lo-fi / chill', subs: [['lofi', 'Lo-fi hip-hop'], ['downtempo', 'Downtempo / trip-hop'], ['chillelectro', 'Chill électro']], live: 'lofi' },
    { id: 'asie', label: 'Pop asiatique', subs: [['kpop', 'K-pop'], ['jpop', 'J-pop'], ['anime', 'Anime'], ['citypop', 'City pop']], live: { kpop: 'nouveautés k-pop', jpop: 'nouveautés j-pop', anime: 'anime hits', citypop: 'city pop', _: 'nouveautés k-pop' } },
    { id: 'monde', label: 'Musiques du monde', subs: [['afro', 'Afro'], ['orient', 'Raï / oriental'], ['bresil', 'Brésil'], ['inde', 'Inde / Bollywood'], ['zouk', 'Zouk / Antilles']], live: { afro: 'afrobeats hits', orient: 'raï', bresil: 'brazil hits', inde: 'bollywood hits', zouk: 'zouk', _: 'afrobeats hits' } }
  ];

  // pattern : écart d'énergie le long de la sélection (8 points, du début à la fin)
  // span : durée de la courbe en mode continu (minutes) ; loop : la courbe recommence
  const MOMENTS = [
    { id: 'reveil', label: 'Réveil', energy: 2, pattern: [-1.5, -1.2, -0.8, -0.4, 0, 0.4, 0.8, 1], desc: 'démarre doux puis monte', span: 30, loop: false },
    { id: 'matinee', label: 'Matinée tranquille', energy: 2, pattern: [-0.4, -0.2, 0, 0, 0.2, 0.2, 0, 0], desc: 'reste douce', span: 60, loop: true },
    { id: 'concentration', label: 'Concentration', energy: 2, pattern: [0, 0.1, 0, -0.1, 0, 0.1, 0, -0.1], desc: 'stable, peu de paroles', span: 60, loop: true },
    { id: 'travail', label: 'Travail', energy: 3, pattern: [-0.4, -0.1, 0.1, 0, 0.3, 0.1, 0.2, 0], desc: 'régulière et entraînante, sans à-coups', span: 90, loop: true },
    { id: 'menage', label: 'Ménage', energy: 4, pattern: [-0.3, 0.1, 0, 0.3, 0.1, 0.3, 0, 0.2], desc: 'entraînante et régulière', span: 60, loop: true },
    { id: 'route', label: 'Route', energy: 3, pattern: [0, 0.5, 0, 0.7, 0.2, 0.8, 0.1, 0.5], desc: 'roule avec des relances', span: 60, loop: true },
    { id: 'sport', label: 'Sport', energy: 5, pattern: [-1, -0.4, 0, 0, -0.2, 0, 0, -0.8], desc: 'monte vite et reste haute', span: 45, loop: true },
    { id: 'repas', label: 'Repas', energy: 2, pattern: [0, 0, 0.2, 0, 0.2, 0, 0, 0], desc: 'discrète et régulière', span: 60, loop: true },
    { id: 'apero', label: 'Apéro', energy: 3, pattern: [-0.6, -0.4, -0.1, 0.1, 0.3, 0.5, 0.6, 0.7], desc: 'conviviale, monte doucement', span: 90, loop: false },
    { id: 'soiree', label: 'Soirée', energy: 4, pattern: [-1.5, -0.8, 0, 0.6, 1, 1, 0.3, -0.8], desc: 'monte, culmine, redescend', span: 180, loop: false },
    { id: 'fete', label: 'Fête', energy: 5, pattern: [-1, -0.5, 0, 0.2, 0.4, 0.4, 0.2, 0], desc: 'démarre vite, reste festive et dansante', span: 120, loop: true },
    { id: 'balade', label: 'Balade / marche', energy: 3, pattern: [-0.4, -0.2, -0.3, -0.1, -0.3, -0.2, -0.3, -0.2], desc: 'un rythme de pas tranquille', span: 60, loop: true },
    { id: 'detente', label: 'Détente', energy: 1, pattern: [0.6, 0.4, 0.5, 0.3, 0.4, 0.2, 0.2, 0], desc: 'très posée', span: 60, loop: true },
    { id: 'meditation', label: 'Méditation', energy: 1, pattern: [0, 0, 0, 0, 0, 0, 0, 0], desc: 'très calme, sans paroles', span: 30, loop: true },
    { id: 'coucher', label: 'Coucher', energy: 2, pattern: [0.6, 0.4, 0.1, -0.2, -0.5, -0.8, -1, -1], desc: "ralentit jusqu'à l'arrêt", span: 45, loop: false }
  ];

  // Humeurs : les quatre premières sont notées titre par titre (lettre), les autres se déduisent
  // de l'énergie, du style et des autres notes du titre.
  const MOODS = [['joyeux', 'Joyeux', 'j'], ['romantique', 'Romantique', 'r'], ['melancolique', 'Mélancolique', 'm'], ['nostalgique', 'Nostalgique', 'n'],
    ['dansant', 'Dansant', 'd'], ['motivant', 'Motivant', ''], ['rageur', 'Rageur', ''], ['planant', 'Planant', ''], ['sensuel', 'Sensuel', ''], ['epique', 'Épique', ''],
    ['estival', 'Ensoleillé / estival', ''], ['reconfortant', 'Réconfortant', ''], ['sombre', 'Sombre / mystérieux', ''], ['decale', 'Décalé', '']];
  const SUNNY_SUBS = new Set(['tropical', 'reggaeton', 'bresil', 'zouk', 'dancehall', 'disco', 'roots', 'afro', 'citypop', 'yeye']);
  const DARK_SUBS = new Set(['grunge', 'prog', 'ambient', 'downtempo', 'symphonique', 'heavy']);
  const QUIRKY_SUBS = new Set(['yeye', 'disco', 'dance', '8090', 'punk', 'anime', 'synth', 'indie']);
  const LOUD = new Set(['rock', 'metal', 'rap', 'hiphop', 'electro', 'poprock']);
  const DREAMY = new Set(['lofi', 'classique', 'bo', 'jazz', 'electro', 'monde', 'asie', 'blues']);
  const SMOOTH = new Set(['soul', 'latino', 'jazz', 'rap', 'hiphop', 'reggae', 'pop', 'monde']);
  // true : colle à l'humeur ; false : n'y colle pas ; null : on ne sait pas (titre non classé).
  function moodFits(t, moodId) {
    const m = MOODS.find((x) => x[0] === moodId);
    if (!m) return null;
    const f = t.flags || '';
    if (m[2]) return f ? f.includes(m[2]) : null;
    if (!t.style) return null;
    const e = t.energy || 3;
    switch (moodId) {
      case 'motivant': return e >= 4 && !f.includes('m') && (/[jd]/.test(f) || LOUD.has(t.style));
      case 'rageur': return e >= 4 && LOUD.has(t.style) && !/[jr]/.test(f) && t.sub !== 'soft';
      case 'planant': return e <= 2 && (DREAMY.has(t.style) || f.includes('i'));
      case 'sensuel': return e <= 3 && (f.includes('r') || (SMOOTH.has(t.style) && (t.sub === 'soul' || t.sub === 'reggaeton' || t.sub === 'tropical' || t.sub === 'vocal')));
      case 'epique': return e >= 3 && (t.sub === 'epique' || t.sub === 'symphonique' || t.sub === 'lyrique' || (t.style === 'bo' && e >= 4));
      // Les quatre suivantes se déduisent aussi : soleil, chaleur, ombre, fantaisie.
      case 'estival': {
        const sunny = SUNNY_SUBS.has(t.sub) || t.style === 'latino' || t.style === 'reggae';
        if (!f && !sunny) return null;
        return e >= 3 && !f.includes('m') && (sunny || (f.includes('j') && f.includes('d')));
      }
      case 'reconfortant':
        if (!f) return null;
        return e <= 3 && !f.includes('m') && /[rnj]/.test(f) && !(LOUD.has(t.style) && e >= 3 && t.sub !== 'soft');
      case 'sombre': {
        const dark = DARK_SUBS.has(t.sub) || t.style === 'metal';
        if (!f && !dark) return null;
        // Mélancolique ne veut pas dire sombre : il faut aussi un genre qui s'y prête.
        const darkish = t.style === 'metal' || t.style === 'bo' || t.style === 'electro' || t.style === 'classique' || t.sub === 'inde' || t.sub === 'hard';
        return !/[jr]/.test(f) && (dark || (f.includes('m') && darkish));
      }
      case 'decale':
        if (!f) return null;
        return f.includes('j') && (QUIRKY_SUBS.has(t.sub) || t.style === 'asie');
      default: return null;
    }
  }
  const ERAS = [['all', 'Toutes'], ['avant50', 'Avant 1950'], ['50', 'Années 50'], ['60', 'Années 60'], ['70', 'Années 70'], ['80', 'Années 80'], ['90', 'Années 90'], ['2000', 'Années 2000'], ['2010', 'Années 2010'], ['2020', 'Années 2020'], ['actuel', 'Actuel']];
  const SOURCES = [['all', 'Toutes'], ['likes', "Mes J'aime"], ['discover', 'Découverte'], ['similar', 'Similaires']];
  const VOICE_GENDERS = [['auto', 'Automatique'], ['homme', 'Homme'], ['femme', 'Femme']];
  const ENERGY_LABELS = ['Très calme', 'Calme', 'Équilibré', 'Énergique', 'À fond'];
  const DURATIONS = [['30', '30 min'], ['60', '1 h'], ['90', '1 h 30'], ['120', '2 h'], ['180', '3 h'], ['until', "Jusqu'à une heure"]];
  const CYCLES = [['auto', 'Auto'], ['15', '15 min'], ['30', '30 min'], ['60', '1 h'], ['120', '2 h'], ['180', '3 h']];
  const TIMERS = [['off', 'Désactivée'], ['15', '15 min'], ['30', '30 min'], ['60', '1 h'], ['end', 'Fin du titre']];
  const MODELS = [['claude-sonnet-5-5', 'Claude Sonnet 5.5 · recommandé'], ['claude-haiku-5-5', 'Claude Haiku 5.5 · le plus économique']];
  const FREQS = [['third', 'Un titre sur trois'], ['every', 'À chaque titre'], ['change', "Seulement quand l'ambiance change"]];

  const PRESETS = {
    rock: [2, 0, 2], 'rock/hard': [4, -1, 3], 'rock/soft': [1, 0, 1], 'rock/sudiste': [2, 1, 2],
    metal: [4, -2, 3], country: [1, 1, 1], 'country/dance': [2, 0, 2], pop: [2, 0, 2],
    electro: [5, -1, 2], rap: [5, 0, 1], hiphop: [4, 0, 1], blues: [1, 1, 0], soul: [2, 1, 1], reggae: [4, 0, 0],
    jazz: [0, 1, 1], latino: [3, 0, 2], classique: [0, 0, 1],
    bo: [2, 0, 1], lofi: [2, -1, -2], poprock: [2, 0, 2], 'metal/symphonique': [3, -1, 3], asie: [2, 0, 2],
    'rock/punk': [3, 0, 3], 'rock/grunge': [3, 0, 2], 'rock/prog': [1, 1, 2], 'electro/dnb': [5, -1, 2], 'electro/trance': [4, -1, 3],
    'electro/ambient': [1, 0, 0], 'pop/synth': [3, 0, 2], 'pop/indie': [1, 0, 2], 'jazz/manouche': [0, 1, 2],
    'monde/zouk': [3, 0, 1],
    'asie/citypop': [1, 1, 1], monde: [3, 0, 1], 'blues/folk': [0, 1, 1], 'soul/disco': [3, 0, 2],
    'reggae/dancehall': [5, 0, 1], 'latino/reggaeton': [5, 0, 1]
  };

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const styleById = (id) => STYLES.find((s) => s.id === id) || STYLES[1] || STYLES[0];

  // ------------------------------------------------ styles retirés et styles ajoutés
  // La liste des styles se règle : ceux de base peuvent être retirés, et des styles créés par l'IA
  // (avec leurs sous-styles et leurs titres) ajoutés. STYLES est modifié sur place : tout le code qui
  // le lit voit la nouvelle liste.
  const BUILTIN_STYLES = STYLES.slice();
  const BUILTIN_IDS = BUILTIN_STYLES.map((s) => s.id);
  const BUILTIN_LABELS = Object.fromEntries(BUILTIN_STYLES.map((s) => [s.id, s.label]));
  const KIT_IDS = ['pop', 'rock', 'electro', 'hiphop', 'chill', 'jazz', 'funk', 'reggae', 'tropical', 'celtique', 'orchestre', 'acoustique'];
  function slugId(label) {
    return String(label || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24);
  }
  function setStyleSet(hidden, custom) {
    const off = new Set((hidden || []).filter((id) => id !== 'all'));
    const list = BUILTIN_STYLES.filter((s) => !off.has(s.id));
    for (const c of custom || []) {
      if (!c || !c.id || !c.label || list.some((s) => s.id === c.id)) continue;
      const subs = (Array.isArray(c.subs) ? c.subs : []).filter((x) => Array.isArray(x) && x[0] && x[1]).slice(0, 8);
      list.push({ id: c.id, label: String(c.label).slice(0, 40), subs, live: c.live || c.label, custom: true });
      KIT_OF_STYLE[c.id] = KIT_IDS.includes(c.kit) ? c.kit : 'pop';
    }
    STYLES.length = 0;
    for (const s of list) STYLES.push(s);
    return STYLES;
  }

  // ------------------------------------------------ plusieurs styles à la fois
  // sel.style : « rock » ou « rock,pop » (« all » = tous). sel.sub : « all », un sous-style seul
  // (ancien format, pour un style unique) ou des paires « style/sous-style » : « rock/hard,pop/8090 ».
  // Un style sans sous-style choisi est pris en entier.
  const splitList = (v) => (!v || v === 'all' ? [] : String(v).split(',').map((x) => x.trim()).filter((x) => x && x !== 'all'));
  const styleList = (style) => splitList(style).filter((x) => STYLES.some((s) => s.id === x));
  function subPairs(sel) {
    const styles = styleList(sel && sel.style);
    const out = [];
    for (const e of splitList(sel && sel.sub)) {
      const i = e.indexOf('/');
      const pair = i > 0 ? [e.slice(0, i), e.slice(i + 1)] : styles.length === 1 ? [styles[0], e] : null;
      if (pair && styles.includes(pair[0]) && !out.some((p) => p[0] === pair[0] && p[1] === pair[1])) out.push(pair);
    }
    return out;
  }
  const styleFits = (t, sel) => { const l = styleList(sel && sel.style); return !l.length || l.includes(t.style); };
  function subFits(t, sel) {
    const mine = subPairs(sel).filter((p) => p[0] === t.style);
    return !mine.length || mine.some((p) => p[1] === t.sub);
  }
  const hasSubs = (sel) => subPairs(sel).length > 0;
  const mainStyle = (sel) => styleList(sel && sel.style)[0] || 'all';
  const subsOf = (sel, styleId) => subPairs(sel).filter((p) => p[0] === styleId).map((p) => p[1]);
  // Seul style choisi (sinon '') et son seul sous-style (sinon '') : pour étiqueter un titre trouvé.
  const onlyStyle = (sel) => { const l = styleList(sel && sel.style); return l.length === 1 ? l[0] : ''; };
  const onlySub = (sel) => { const st = onlyStyle(sel); const l = st ? subsOf(sel, st) : []; return l.length === 1 ? l[0] : ''; };
  function toggleStyle(style, id) {
    if (id === 'all') return 'all';
    const cur = styleList(style);
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : cur.concat(id);
    const order = STYLES.map((s) => s.id);
    next.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    return next.length ? next.join(',') : 'all';
  }
  // Sous-styles gardés pour les styles encore choisis, au format « style/sous-style ».
  const subString = (pairs) => (pairs.length ? pairs.map((p) => p[0] + '/' + p[1]).join(',') : 'all');
  const cleanSubs = (sel) => subString(subPairs(sel));
  function toggleSub(sel, styleId, subId) {
    const others = subPairs(sel).filter((p) => p[0] !== styleId);
    if (subId === 'all') return subString(others);
    const mine = subsOf(sel, styleId);
    const nextMine = mine.includes(subId) ? mine.filter((x) => x !== subId) : mine.concat(subId);
    const order = styleById(styleId).subs.map((x) => x[0]);
    nextMine.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    return subString(others.concat(nextMine.map((x) => [styleId, x])));
  }
  const joinFr = (l) => (l.length <= 1 ? l.join('') : l.slice(0, -1).join(', ') + ' et ' + l[l.length - 1]);
  // « Rock soft et hard », « Rock (soft, hard) et pop », « Tous styles ».
  function styleText(sel) {
    const l = styleList(sel && sel.style);
    if (!l.length) return 'Tous styles';
    const parts = l.map((id, i) => {
      const st = styleById(id);
      const subs = subsOf(sel, id).map((x) => ((st.subs.find((y) => y[0] === x) || [])[1] || x).toLowerCase());
      const name = i ? st.label.toLowerCase() : st.label;
      if (!subs.length) return name;
      return l.length > 1 ? name + ' (' + subs.join(', ') + ')' : name + ' ' + joinFr(subs);
    });
    return parts.length > 1 ? parts.slice(0, -1).join(', ') + ' et ' + parts[parts.length - 1] : parts[0];
  }

  // Durée de la courbe d'énergie en mode continu (minutes).
  function cycleMinutes(sel) {
    const c = sel && sel.cycle;
    return c && c !== 'auto' ? Number(c) || momentById(sel.moment).span : momentById(sel && sel.moment).span;
  }

  function liveQuery(sel) {
    return liveQueries(sel)[0].query;
  }
  // Une recherche de nouveautés par style choisi (et par sous-style quand il a sa propre recherche).
  function liveQueries(sel) {
    const l = styleList(sel && sel.style);
    const out = [];
    for (const id of l.length ? l : ['all']) {
      const st = id === 'all' ? STYLES[0] : styleById(id);
      const subs = subsOf(sel, id);
      if (typeof st.live === 'string') { out.push({ query: st.live, style: id === 'all' ? '' : id, sub: subs.length === 1 ? subs[0] : '' }); continue; }
      const own = subs.filter((x) => st.live[x]);
      if (own.length) for (const x of own) out.push({ query: st.live[x], style: id, sub: x });
      else out.push({ query: st.live._, style: id, sub: '' });
    }
    return out;
  }
  const momentById = (id) => MOMENTS.find((m) => m.id === id) || MOMENTS[3];

  // ------------------------------------------------------------ textes
  const STOP = new Set(['the', 'and', 'et', 'le', 'la', 'les', 'de', 'des', 'du', 'of', 'feat', 'ft', 'with']);

  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\(.*?\)|\[.*?\]/g, ' ')
      .replace(/\s(feat|ft)\.?\s.*$/, ' ')
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9 ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokens(s) {
    return norm(s).split(' ').filter((w) => w && (w.length > 1 || /\d/.test(w)) && !STOP.has(w));
  }

  function keyOf(artist, title) {
    return norm(artist) + '|' + norm(title);
  }

  function artistKey(artist) {
    return norm(artist);
  }

  // ---------------------------------------------------------- catalogue
  function parseCatalog(raw) {
    const out = [];
    for (const line of String(raw || '').split('\n')) {
      const l = line.trim();
      if (!l || l.startsWith('#')) continue;
      const p = l.split('|');
      if (p.length < 7) continue;
      out.push({
        artist: p[0].trim(),
        title: p[1].trim(),
        style: p[2].trim(),
        sub: p[3].trim(),
        energy: clamp(Number(p[4]) || 3, 1, 5),
        year: Number(p[5]) || 0,
        flags: p[6].trim(),
        key: keyOf(p[0], p[1])
      });
    }
    return out;
  }

  // L'époque peut regrouper plusieurs décennies : « 80,90 ». « all » et « actuel » restent seuls.
  function eraList(era) {
    if (!era || era === 'all') return [];
    return String(era).split(',').map((x) => x.trim()).filter((x) => x && x !== 'all');
  }
  function eraMatch(year, era, nowYear) {
    const list = eraList(era);
    if (!list.length) return true;
    if (!year) return false;
    return list.some((e) => {
      if (e === 'actuel') return year >= (nowYear || new Date().getFullYear()) - 1;
      if (e === 'avant50') return year < 1950;
      const d = Number(e);
      const start = d >= 2000 ? d : 1900 + d;
      return year >= start && year <= start + 9;
    });
  }
  // Clic sur une époque : « Toutes » et « Actuel » remplacent tout ; une décennie s'ajoute ou se retire.
  function toggleEra(era, id) {
    if (id === 'all' || id === 'actuel') return id;
    const cur = eraList(era).filter((x) => x !== 'actuel');
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : cur.concat(id);
    const order = ERAS.map((x) => x[0]);
    next.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    return next.length ? next.join(',') : 'all';
  }
  // « Années 80 et 90 », « Années 60, 70 et 2000 »…
  function eraText(era) {
    const list = eraList(era);
    if (!list.length) return '';
    if (list.length === 1) return (ERAS.find((x) => x[0] === list[0]) || [])[1] || '';
    const dec = list.filter((x) => x !== 'avant50');
    const decText = dec.length ? 'années ' + dec.slice(0, -1).join(', ') + (dec.length > 1 ? ' et ' : '') + dec[dec.length - 1] : '';
    const txt = list.includes('avant50') ? 'avant 1950' + (decText ? ' et ' + decText : '') : decText;
    return txt.charAt(0).toUpperCase() + txt.slice(1);
  }

  // Niveaux de repli : du plus précis au plus large.
  function catalogLevels(catalog, sel) {
    const base = catalog.filter((t) => styleFits(t, sel));
    const bySub = hasSubs(sel) ? base.filter((t) => subFits(t, sel)) : base;
    const era = (t) => eraMatch(t.year, sel.era);
    const levels = [];
    const push = (l) => { if (l.length && !levels.some((x) => x.length === l.length && x.every((t, i) => t === l[i]))) levels.push(l); };
    push(bySub.filter(era));
    push(bySub);
    push(base.filter(era));
    push(base);
    return levels;
  }

  // Même logique pour une liste déjà trouvée sur YouTube Music (J'aime, nouveautés).
  function poolLevels(pool, sel) {
    const st = pool.filter((t) => styleFits(t, sel));
    const sub = hasSubs(sel) ? st.filter((t) => subFits(t, sel)) : st;
    const era = (t) => eraMatch(t.year, sel.era);
    const levels = [];
    for (const l of [sub.filter(era), sub, st.filter(era), st, pool]) {
      if (l.length && !levels.some((x) => x.length === l.length)) levels.push(l);
    }
    return levels;
  }

  // ------------------------------------------------------ courbe d'énergie
  // Courbe personnalisée : sel.curve, 8 écarts d'énergie (comme les motifs des moments), sinon celle du moment.
  // La courbe personnalisée peut avoir 8, 16 ou 24 points (de 2 à 48 acceptés).
  const CURVE_POINTS = 8;
  const CURVE_CHOICES = [8, 16, 24];
  const hasCustomCurve = (sel) => !!(sel && Array.isArray(sel.curve) && sel.curve.length >= 2 && sel.curve.length <= 48 && sel.curve.every((x) => Number.isFinite(Number(x))));
  const curvePattern = (sel) => (hasCustomCurve(sel) ? sel.curve.map(Number) : momentById(sel && sel.moment).pattern);
  // Rééchantillonne une courbe (motif d'écarts) sur n points, sans changer sa forme.
  function resampleCurve(pattern, n) {
    const out = [];
    for (let i = 0; i < n; i++) out.push(Math.round(curveDelta(null, i / (n - 1), pattern) * 100) / 100);
    return out;
  }
  function curveDelta(momentId, p, pattern) {
    const pat = pattern || momentById(momentId).pattern;
    const x = clamp(p, 0, 1) * (pat.length - 1);
    const i = Math.floor(x);
    const f = x - i;
    const a = pat[Math.min(i, pat.length - 1)];
    const b = pat[Math.min(i + 1, pat.length - 1)];
    return a + (b - a) * f;
  }

  function targetEnergy(sel, p) {
    return clamp((Number(sel.energy) || 3) + curveDelta(sel.moment, p, curvePattern(sel)), 1, 5);
  }

  // Chemin SVG de la courbe, dans une boîte width x height (y = 70 pour 1, 10 pour 5 quand height = 80).
  function curvePath(sel, width, height) {
    const w = width || 340;
    const hgt = height || 80;
    const pts = [];
    // Autant de points que la courbe personnalisée (8 au moins) : le tracé passe par chaque poignée.
    const n = Math.max(8, curvePattern(sel).length);
    for (let i = 0; i < n; i++) {
      const e = targetEnergy(sel, i / (n - 1));
      pts.push({ x: 10 + i * ((w - 20) / (n - 1)), y: (hgt - 10) - (e - 1) * ((hgt - 20) / 4) });
    }
    let d = 'M ' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const mx = ((a.x + b.x) / 2).toFixed(1);
      d += ' C ' + mx + ' ' + a.y.toFixed(1) + ' ' + mx + ' ' + b.y.toFixed(1) + ' ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
    }
    return d;
  }

  function curveY(sel, p, height) {
    const hgt = height || 80;
    return (hgt - 10) - (targetEnergy(sel, p) - 1) * ((hgt - 20) / 4);
  }

  // ------------------------------------------------------- choix des titres
  // ctx : { target, used:Set, failed:Set, artistDist:{artiste: titres d'écart}, lastArtists:[], skips:{}, recent:Set, sel, rnd }
  function scoreTrack(t, ctx) {
    const sel = ctx.sel || {};
    let s = Math.abs(t.energy - ctx.target) * 2;
    const flags = t.flags || '';
    if (sel.mood && moodFits(t, sel.mood) === false) s += 1.2;
    const mo = sel.moment;
    if (mo === 'concentration' && flags && !flags.includes('i')) s += 0.8;
    // Méditation : très calme, sans paroles si possible.
    if (mo === 'meditation') { if (flags && !flags.includes('i')) s += 1.5; if (t.energy >= 3) s += 2; }
    // Ménage : ça doit donner envie de bouger. Apéro : convivial. Balade : pas de titre qui explose.
    if (mo === 'menage') { if (flags.includes('m')) s += 0.6; if (/[dj]/.test(flags)) s -= 0.3; }
    if (mo === 'apero') { if (flags.includes('m')) s += 0.4; if (/[jd]/.test(flags)) s -= 0.2; }
    if (mo === 'balade' && t.energy >= 5) s += 1;
    if ((mo === 'soiree' || mo === 'sport') && t.energy >= 4 && flags && !flags.includes('d')) s += 0.3;
    if (mo === 'fete') {
      if (flags && !flags.includes('d')) s += 0.6;
      if (flags.includes('m')) s += 1;
      if (flags.includes('j')) s -= 0.3;
    }
    if (mo === 'reveil' && flags.includes('j')) s -= 0.3;
    // Travail : on garde le moral et le rythme, ni coup de mou ni titre qui explose.
    if (mo === 'travail') {
      if (flags.includes('m')) s += 0.6;
      if (flags.includes('j')) s -= 0.2;
      if (t.energy >= 5) s += 0.8;
    }
    if ((mo === 'coucher' || mo === 'detente') && t.energy >= 4) s += 2;
    const ak = artistKey(t.artist);
    // Même artiste passé il y a peu : pénalité forte dans les 3 derniers titres, puis dégressive jusqu'à 10.
    if (ctx.artistDist) {
      const d = ctx.artistDist[ak];
      if (d) s += d <= 3 ? 6 : d <= 6 ? 3 : 1.2;
    } else if (ctx.lastArtists && ctx.lastArtists.includes(ak)) s += 2.5;
    const sk = (ctx.skips && ctx.skips[ak]) || 0;
    s += Math.min(3, sk * 0.8);
    if (ctx.recent && ctx.recent.has(t.key)) s += 2.5;
    if (typeof t.fit === 'number') s += (3 - t.fit) * 0.8;
    s += (ctx.rnd ? ctx.rnd() : Math.random()) * 0.9;
    return s;
  }

  // Liste noire : un artiste banni ne passe plus, même en featuring (« X feat. Y », « X & Y »).
  function isBanned(banned, artist) {
    if (!banned || !banned.size || !artist) return false;
    // « The Black Eyed Peas » et « Black Eyed Peas » sont le même artiste.
    const bare = (k) => k.replace(/^(the|les|le|la) /, '');
    const hit = (a) => { const k = artistKey(a); if (banned.has(k)) return true; const b = bare(k); for (const x of banned) if (bare(x) === b) return true; return false; };
    if (hit(artist)) return true;
    return String(artist).split(/,| & | et | feat\.? | ft\.? | x | with /i).some((a) => a.trim() && hit(a));
  }

  function pickTrack(levels, ctx) {
    for (const pool of levels) {
      let best = null;
      let bestScore = Infinity;
      for (const t of pool) {
        if (ctx.used && ctx.used.has(t.key)) continue;
        if (ctx.banned && isBanned(ctx.banned, t.artist)) continue;
        if (ctx.failed && ctx.failed.has(t.key)) continue;
        if (ctx.capped && ctx.capped.has(artistKey(t.artist))) continue;
        if (ctx.excluded && (ctx.excluded.has(t.key) || (t.videoId && ctx.excluded.has(t.videoId)))) continue;
        const sc = scoreTrack(t, ctx);
        if (sc < bestScore) { bestScore = sc; best = t; }
      }
      if (best) return best;
    }
    return null;
  }

  // ----------------------------------------- rapprochement YouTube Music
  const PENALTY = ['live', 'karaoke', 'cover', 'remix', 'sped', 'slowed', 'reverb', '8d', 'nightcore', 'tribute', 'medley', 'vivo', 'directo', 'concert', 'instrumental', 'lyrics'];

  function typeBonus(item) {
    if (item.type === 'MUSIC_VIDEO_TYPE_ATV') return 0.15;
    if (item.type === 'MUSIC_VIDEO_TYPE_OMV') return 0.05;
    if (item.type === 'MUSIC_VIDEO_TYPE_UGC') return -0.2;
    return 0;
  }

  function matchScore(want, item, lenientArtist) {
    const wt = tokens(want.title);
    const it = tokens(item.title);
    if (!wt.length) return -1;
    const artistOnly = (item.artists || []).join(' ') || item.subtitle || '';
    const artistText = artistOnly + ' ' + item.title;
    const wa = tokens(want.artist);
    const at = tokens(artistText);
    const aCov = wa.length ? wa.filter((x) => at.includes(x)).length / wa.length : 0;
    if (!it.length) {
      // Titre écrit dans un autre alphabet (japonais, coréen…) : on se fie à l'artiste.
      return wa.length && aCov >= 0.99 ? 0.7 + typeBonus(item) : -1;
    }
    const artistUnknown = tokens(artistOnly).length === 0;
    const inter = wt.filter((x) => it.includes(x)).length;
    const titleCov = inter / wt.length;
    const extra = (it.length - it.filter((x) => wt.includes(x)).length) / it.length;
    if (titleCov < 0.6) return -1;
    if (aCov < 0.5 && !lenientArtist && !(artistUnknown && titleCov >= 0.8)) return -1;
    let s = titleCov - extra * 0.25 + aCov * 0.8;
    const rawTitle = norm(item.title + ' ' + (item.subtitle || ''));
    const wantTitle = norm(want.title);
    let pen = 0;
    for (const w of PENALTY) {
      const re = new RegExp('(^| )' + w + '( |$)');
      if (re.test(rawTitle) && !re.test(wantTitle)) pen += 0.6;
    }
    s -= Math.min(1.2, pen);
    s += typeBonus(item);
    if (item.duration && item.duration < 60) s -= 1;
    if (item.duration > 900 && !lenientArtist) s -= 0.5;
    return s;
  }

  function bestMatch(want, items, lenientArtist) {
    let best = null;
    let bestScore = 0.6;
    for (const it of items || []) {
      const sc = matchScore(want, it, lenientArtist);
      if (sc > bestScore) { bestScore = sc; best = it; }
    }
    return best;
  }

  // ------------------------------------------------------------- son
  function autoEq(sel) {
    // Plusieurs styles : la moyenne de leurs réglages (arrondie).
    const l = styleList(sel && sel.style);
    const presets = l.map((id) => { const subs = subsOf(sel, id); return PRESETS[id + '/' + (subs.length === 1 ? subs[0] : '')] || PRESETS[id] || [0, 0, 0]; });
    const avg = (i) => (presets.length ? Math.round(presets.reduce((a, p) => a + p[i], 0) / presets.length) : 0);
    const eq = { bass: avg(0), mid: avg(1), treble: avg(2) };
    const mo = sel && sel.moment;
    if (mo === 'coucher' || mo === 'detente' || mo === 'concentration' || mo === 'meditation') eq.treble -= 1.5;
    if (mo === 'travail') eq.treble -= 0.5;
    if (mo === 'sport' || mo === 'soiree' || mo === 'fete' || mo === 'menage') eq.bass += 1;
    eq.bass = clamp(eq.bass, -12, 12); eq.mid = clamp(eq.mid, -12, 12); eq.treble = clamp(eq.treble, -12, 12);
    return eq;
  }

  function autoFade(sel, userFade) {
    const mo = sel && sel.moment;
    const subs = sel ? subPairs(sel).map((p) => p[1]) : [];
    const only = (x) => subs.length > 0 && subs.every((y) => y === x);
    if (mo === 'sport' || mo === 'soiree' || mo === 'fete' || only('dance')) return Math.min(userFade, 3);
    if (mo === 'coucher' || mo === 'detente' || mo === 'meditation' || only('balade') || only('ambient')) return Math.max(userFade, 8);
    return userFade;
  }

  function describeAuto(sel) {
    if (!sel) return 'Réglage selon l\'ambiance';
    const eq = autoEq(sel);
    const parts = [];
    if (eq.bass >= 3) parts.push('basses poussées');
    else if (eq.bass > 0) parts.push('basses un peu poussées');
    if (eq.treble >= 2) parts.push('aigus brillants');
    else if (eq.treble < 0) parts.push('aigus adoucis');
    const fade = autoFade(sel, 6);
    if (fade < 6) parts.push('fondus courts');
    if (fade > 6) parts.push('fondus longs');
    const name = momentById(sel.moment).label.toLowerCase() + ' et ' + styleText(sel).toLowerCase();
    return 'Réglage actuel : ' + name + (parts.length ? ', ' + parts.join(', ') : ', son neutre');
  }

  // ---------------------------------------------------------- formats
  function fmtTime(sec) {
    sec = Math.max(0, Math.round(Number(sec) || 0));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m + ':' + String(s).padStart(2, '0');
  }

  function fmtDuration(min) {
    min = Math.max(0, Math.round(Number(min) || 0));
    const h = Math.floor(min / 60);
    const r = min % 60;
    if (h === 0) return r + ' min';
    return r === 0 ? h + ' h' : h + ' h ' + String(r).padStart(2, '0');
  }

  function minutesUntil(hhmm, now) {
    const d = now || new Date();
    const parts = String(hhmm || '').split(':');
    const target = (Number(parts[0]) || 0) * 60 + (Number(parts[1]) || 0);
    let diff = target - (d.getHours() * 60 + d.getMinutes());
    if (diff <= 0) diff += 1440;
    return diff;
  }

  // Habillage sonore (jingles et fond des interludes) selon l'ambiance : une famille de sons par
  // style, plus douce la nuit, en mineur pour les humeurs sombres, plus rapide quand l'énergie monte.
  const KIT_OF_STYLE = {
    rock: 'rock', poprock: 'rock', metal: 'rock', electro: 'electro', rap: 'hiphop', hiphop: 'hiphop',
    jazz: 'jazz', blues: 'jazz', soul: 'funk', reggae: 'reggae', latino: 'tropical', monde: 'tropical',
    classique: 'orchestre', bo: 'orchestre', lofi: 'chill', country: 'acoustique',
    pop: 'pop', asie: 'pop'
  };
  const KIT_OF_SUB = {
    synth: 'electro', synthwave: 'electro', ambient: 'chill', downtempo: 'chill', chillelectro: 'chill', folk: 'acoustique',
    disco: 'funk', dancehall: 'reggae', 'jazz/manouche': 'acoustique',
    'latino/flamenco': 'acoustique', 'reggae/fr': 'reggae', 'monde/zouk': 'tropical', 'bo/epique': 'orchestre'
  };
  const CALM_MOMENTS = new Set(['coucher', 'meditation', 'nuit']);
  const MINOR_MOODS = new Set(['melancolique', 'sombre', 'nostalgique', 'rageur', 'epique']);
  function soundKit(sel) {
    const style = mainStyle(sel);
    const subs = style === 'all' ? [] : subsOf(sel, style);
    const sub = subs.length === 1 ? subs[0] : '';
    let kit = KIT_OF_SUB[style + '/' + sub] || KIT_OF_SUB[sub] || KIT_OF_STYLE[style] || 'pop';
    const moment = (sel && sel.moment) || '';
    const energy = clamp(Number(sel && sel.energy) || 3, 1, 5);
    // La nuit, au coucher, en méditation : tout passe en version feutrée.
    if (CALM_MOMENTS.has(moment) || ((sel && sel.mood) === 'planant' && kit !== 'orchestre')) kit = kit === 'orchestre' || kit === 'jazz' ? kit : 'chill';
    return { kit, energy: CALM_MOMENTS.has(moment) ? Math.min(energy, 2) : energy, minor: MINOR_MOODS.has(sel && sel.mood) || sub === 'heavy' || sub === 'grunge' };
  }

  return {
    soundKit, setStyleSet, slugId, BUILTIN_IDS, BUILTIN_LABELS, KIT_IDS,
    STYLES, MOMENTS, MOODS, ERAS, SOURCES, VOICE_GENDERS, ENERGY_LABELS, DURATIONS, CYCLES, TIMERS, MODELS, FREQS,
    clamp, styleById, momentById, moodFits, cycleMinutes, liveQuery, liveQueries, isBanned,
    styleList, subPairs, styleFits, subFits, hasSubs, mainStyle, subsOf, onlyStyle, onlySub, toggleStyle, toggleSub, cleanSubs, styleText, norm, tokens, keyOf, artistKey,
    parseCatalog, eraMatch, eraList, toggleEra, eraText, catalogLevels, poolLevels,
    curveDelta, targetEnergy, curvePath, curveY, CURVE_POINTS, CURVE_CHOICES, hasCustomCurve, curvePattern, resampleCurve,
    scoreTrack, pickTrack, matchScore, bestMatch,
    autoEq, autoFade, describeAuto,
    fmtTime, fmtDuration, minutesUntil
  };
})();

if (typeof module !== 'undefined') module.exports = MDJ_CORE;
