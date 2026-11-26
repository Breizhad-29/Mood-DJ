// Mood DJ — panneau et moteur DJ (monde isolé de l’extension) : onglets : gérer les styles, En cours, la grille, Historique, Son.
// Les fichiers mdj-*.js puis content.js sont chargés dans l’ordre du manifest et partagent la même portée :
// une fonction d’un fichier peut appeler celle d’un autre, mais le code exécuté au chargement ne doit
// utiliser que ce qui est défini dans les fichiers précédents (vérifié par tests/split.test.js).
'use strict';

// ------------------------------------------------------- gérer les styles
// Retirer ou remettre les styles de base ; ajouter un style : l'IA (Claude ou Gemini, selon ton
// réglage) propose ses sous-styles et une centaine de vrais titres classés, gardés dans ce navigateur.
let stylesView = null; // { add, name, details, count, busy, draft, error, confirmDel, busyId }
const trackKeyOfLine = (l) => { const p = String(l).split('|'); return C.keyOf(p[0] || '', p[1] || ''); };
function uniqueStyleId(label) {
  const base = 'u-' + (C.slugId(label) || 'style');
  let id = base;
  for (let i = 2; C.STYLES.some((s) => s.id === id) || C.BUILTIN_IDS.includes(id) || customStyles.some((s) => s.id === id); i++) id = base + '-' + i;
  return id;
}
function draftLines(id, tracks) {
  return tracks.map((t) => [t.artist, t.title, id, t.sub || '', t.energy || 3, t.year || 0, t.flags || ''].join('|'));
}
async function generateStyle() {
  const v = stylesView;
  const name = (v.name || '').trim();
  if (!name) { v.error = 'Donne un nom au style.'; render(); return; }
  if (C.STYLES.some((s) => s.label.toLowerCase() === name.toLowerCase())) { v.error = 'Ce style existe déjà.'; render(); return; }
  v.busy = true; v.error = ''; v.draft = null; v.busyAt = Date.now(); render();
  // Le bouton montre depuis combien de temps l'IA cherche (ça peut prendre une minute ou deux).
  const tick = setInterval(() => { if (v.busy && tab === 'reglages') render(); }, 1000);
  try {
    const r = await claude('newstyle', { name, details: (v.details || '').trim(), count: Number(v.count) || 100 });
    if (!r || !r.tracks || r.tracks.length < 10) throw new Error("L'IA n'a trouvé que " + ((r && r.tracks && r.tracks.length) || 0) + ' titres : précise le style et réessaie.');
    v.draft = r;
  } catch (e) {
    v.error = e.message;
  } finally {
    v.busy = false;
    clearInterval(tick);
    render();
  }
}
function acceptDraft() {
  const v = stylesView;
  const r = v.draft;
  const id = uniqueStyleId(r.name);
  customStyles.push({ id, label: r.name, subs: r.subs, kit: r.kit, live: r.live, details: (v.details || '').trim(), tracks: draftLines(id, r.tracks), at: Date.now() });
  store({ customStyles });
  applyStyleSet();
  dlog('session', 'style ajouté', { id, nom: r.name, titres: r.tracks.length, sous_styles: r.subs.map((s) => s[0]).join(', '), famille: r.kit });
  stylesView = { add: false, justAdded: id };
  toast('Style « ' + r.name + ' » ajouté : ' + r.tracks.length + ' titres.', { label: 'Le choisir', fn: () => { sel.style = id; sel.sub = 'all'; stylesView = null; selChanged(); } }, 9000);
  render();
}
async function completeStyle(cs) {
  stylesView.busyId = cs.id; render();
  try {
    const r = await claude('newstyle', { name: cs.label, details: cs.details || '', count: 60, subs: cs.subs, avoid: (cs.tracks || []).map((l) => { const p = l.split('|'); return p[0] + ' – ' + p[1]; }) });
    const have = new Set((cs.tracks || []).map(trackKeyOfLine));
    for (const s of r.subs || []) if (!cs.subs.some((x) => x[0] === s[0]) && cs.subs.length < 8) cs.subs.push(s);
    const fresh = (r.tracks || []).filter((t) => !have.has(C.keyOf(t.artist, t.title)));
    cs.tracks = (cs.tracks || []).concat(draftLines(cs.id, fresh));
    store({ customStyles });
    applyStyleSet();
    toast('« ' + cs.label + ' » : ' + fresh.length + ' titres de plus (' + cs.tracks.length + ' en tout).', null, 6000);
  } catch (e) {
    toast(cs.label + ' : ' + e.message, null, 8000);
  } finally {
    if (stylesView) stylesView.busyId = '';
    render();
  }
}
function toggleBuiltinStyle(id, on) {
  const hidden = new Set(settings.hiddenStyles || []);
  if (on) hidden.delete(id); else hidden.add(id);
  settings.hiddenStyles = [...hidden];
  saveSettings();
  applyStyleSet();
  sel.sub = C.cleanSubs(sel);
  saveSel();
  render();
}
const countByStyle = () => { const m = {}; for (const t of CATALOG) m[t.style] = (m[t.style] || 0) + 1; return m; };

function tabStyles() {
  const v = stylesView;
  const body = h('div', { class: 'body' });
  const counts = countByStyle();
  // Ajouter un style.
  const addCard = h('div', { class: 'card' },
    h('h2', { class: 'label white' }, 'Ajouter un style'),
    h('div', { class: 'muted' }, "Donne un nom (et, si tu veux, des précisions) : l'IA propose les sous-styles et une centaine de vrais titres classés par énergie et par époque. Ils restent dans ce navigateur, et tu peux en demander d'autres ensuite."),
    h('label', { class: 'label', for: 'mdj-newstyle' }, 'Nom du style'),
    h('input', { class: 'input', id: 'mdj-newstyle', type: 'text', maxlength: '40', value: v.name || '', placeholder: 'ex. Bossa nova, Shoegaze, Musique des Balkans…', disabled: v.busy, oninput: (e) => { v.name = e.target.value; } }),
    h('label', { class: 'label', for: 'mdj-newstyle-d' }, 'Précisions (facultatif)'),
    h('input', { class: 'input', id: 'mdj-newstyle-d', type: 'text', maxlength: '200', value: v.details || '', placeholder: 'ex. plutôt festif, années 70 à aujourd’hui, avec du fest-noz', disabled: v.busy, oninput: (e) => { v.details = e.target.value; } }),
    h('div', { class: 'label' }, 'Nombre de titres'),
    seg([['60', '60'], ['100', '100'], ['120', '120']], String(v.count || 100), (id) => { v.count = Number(id); render(); }, 'Nombre de titres'),
    !hasKey ? h('div', { class: 'muted' }, 'Il faut une clé Claude ou Gemini (Réglages › Clés API).') : null,
    h('div', { class: 'btns' }, h('button', { class: 'btn primary small', type: 'button', disabled: v.busy || !hasKey, onclick: generateStyle }, v.busy ? "L'IA cherche… " + Math.round((Date.now() - (v.busyAt || Date.now())) / 1000) + ' s' : "Créer avec l'IA")),
    v.busy ? h('div', { class: 'muted' }, 'Ça peut prendre une ou deux minutes : l’IA cherche de vrais titres, puis chacun est vérifié.') : null,
    v.error ? h('div', { class: 'muted', role: 'alert' }, v.error) : null,
    v.draft ? h('div', { class: 'card pendingamb' },
      h('div', { class: 'label white' }, '« ' + v.draft.name + ' » : ' + v.draft.tracks.length + ' titres'),
      h('div', { class: 'muted' }, 'Sous-styles : ' + (v.draft.subs.length ? v.draft.subs.map((s) => s[1] + ' (' + v.draft.tracks.filter((t) => t.sub === s[0]).length + ')').join(', ') : 'aucun') +
        ' · habillage sonore : ' + (KIT_NAMES[v.draft.kit] || 'pop') + '.'),
      h('div', { class: 'muted' }, 'Par exemple : ' + v.draft.tracks.slice(0, 5).map((t) => t.artist + ' – ' + t.title).join(' · ') + '…'),
      h('div', { class: 'btns' },
        h('button', { class: 'btn primary small', type: 'button', onclick: acceptDraft }, 'Ajouter ce style'),
        h('button', { class: 'btn small', type: 'button', onclick: generateStyle }, 'Recommencer'),
        h('button', { class: 'btn small', type: 'button', onclick: () => { v.draft = null; render(); } }, 'Annuler'))) : null);
  // Styles ajoutés.
  const mine = h('div', { class: 'card' },
    h('h2', { class: 'label white' }, 'Mes styles ajoutés'),
    customStyles.length ? null : h('div', { class: 'muted' }, 'Aucun pour le moment.'),
    customStyles.map((cs) => h('div', { class: 'section', style: { gap: '4px' } },
      h('div', { class: 'row' }, h('span', { class: 'label white' }, cs.label), pill((cs.tracks || []).length + ' titres')),
      h('div', { class: 'muted' }, (cs.subs || []).map((s) => s[1]).join(', ') || 'Sans sous-style'),
      h('div', { class: 'btns' },
        h('button', { class: 'btn small', type: 'button', disabled: !hasKey || !!v.busyId, onclick: () => completeStyle(cs) }, v.busyId === cs.id ? 'Recherche…' : '+ 60 titres'),
        h('button', { class: 'btn small', type: 'button', onclick: () => { sel.style = cs.id; sel.sub = 'all'; stylesView = null; selChanged(); } }, 'Le choisir'),
        h('button', {
          class: 'btn small', type: 'button',
          onclick: () => {
            if (v.confirmDel !== cs.id) { v.confirmDel = cs.id; render(); return; }
            customStyles = customStyles.filter((x) => x.id !== cs.id);
            store({ customStyles });
            applyStyleSet();
            sel.sub = C.cleanSubs(sel); saveSel();
            v.confirmDel = '';
            toast('Style « ' + cs.label + ' » supprimé.', null, 4000);
            render();
          }
        }, v.confirmDel === cs.id ? 'Confirmer la suppression' : 'Supprimer')))));
  // Styles de base.
  const hidden = new Set(settings.hiddenStyles || []);
  const base = h('div', { class: 'card' },
    h('h2', { class: 'label white' }, 'Styles de base'),
    h('div', { class: 'muted' }, 'Un style retiré disparaît des choix, et ses titres ne passent plus, même avec « Tous les styles ». Tu peux le remettre quand tu veux.'),
    C.BUILTIN_IDS.filter((id) => id !== 'all').map((id) => {
      const on = !hidden.has(id);
      const lab = (C.BUILTIN_LABELS[id] || id);
      return switchRow(lab, on ? (counts[id] || 0) + ' titres au catalogue' : 'Retiré', on, (x) => toggleBuiltinStyle(id, x));
    }));
  append(body, isFull() ? cols(addCard, [mine, base]) : [addCard, mine, base]);
  const foot = h('div', { class: 'foot' },
    h('div', { class: 'btns' }, h('button', { class: 'btn', type: 'button', onclick: () => { stylesView = null; render(); } }, "Retour à l'ambiance")));
  return [body, foot];
}

function tabAmbiance() {
  if (stylesView) return tabStyles();
  const body = h('div', { class: 'body' });
  const srcSec = (h('div', { class: 'section' },
    h('h2', { class: 'label' }, 'Source des titres'),
    seg(C.SOURCES, sel.source || 'all', (id) => { sel.source = id; sel.seed = null; selChanged(); }, 'Source des titres'),
    h('div', { class: 'muted' }, sourceNote()),
    sel.source === 'similar' && sel.seed && sel.seed.artist ? h('div', { class: 'row seedrow' },
      h('span', { class: 'label white' }, 'Dans l’esprit de ' + sel.seed.artist + (sel.seed.title ? ' – ' + sel.seed.title : '')),
      h('button', { class: 'x', type: 'button', 'aria-label': 'Ne plus partir de ce titre', title: 'Revenir aux artistes de départ habituels', onclick: () => { sel.seed = null; selChanged(); } }, icon('x', 16))) : null,
    sel.source === 'likes' ? h('div', { class: 'label' }, 'Mélanger avec des titres similaires') : null,
    sel.source === 'likes' ? seg([['off', "Que mes J'aime"], ['1', '1 pour 1'], ['2', '1 pour 2'], ['3', '1 pour 3']], sel.likesMix || 'off', (id) => { sel.likesMix = id; saveSel(); render(); liveUpdate(); }, "Mélange avec des titres similaires") : null,
    sel.source === 'likes' && sel.likesMix && sel.likesMix !== 'off' ? h('div', { class: 'muted' },
      "Un titre de tes J'aime, puis " + (sel.likesMix === '1' ? 'un titre' : sel.likesMix === '2' ? 'deux titres' : 'trois titres') +
      " d'artistes proches de ceux que tu aimes (leurs « Vous aimerez peut-être aussi » sur YouTube Music), et ainsi de suite. Repère « découverte » dans À suivre.") : null,
    sel.source === 'similar' ? h('div', { class: 'label' }, 'Exploration') : null,
    sel.source === 'similar' ? seg([['proche', 'Artistes proches'], ['loin', 'Plus loin']], settings.similarDepth === 'loin' ? 'loin' : 'proche', (id) => { settings.similarDepth = id; saveSettings(); render(); }, 'Exploration des artistes similaires') : null,
    sel.source === 'similar' ? h('div', { class: 'muted' }, settings.similarDepth === 'loin'
      ? 'Plus loin : les similaires des similaires, pour sortir des sentiers battus.'
      : 'Artistes proches : les similaires directs des artistes de départ.') : null));
  const input = h('input', {
    class: 'input', id: 'mdj-prompt', type: 'text', placeholder: 'ex. rock pour rouler la nuit sous la pluie', value: sel.prompt,
    oninput: (e) => { sel.prompt = e.target.value; saveSel(); updateSummary(); },
    onkeydown: (e) => { if (e.key === 'Enter') { e.preventDefault(); input.blur(); startFromUi(false); } }
  });
  const modelName = (C.MODELS.find((m) => m[0] === settings.model) || C.MODELS[0])[1].split(' · ')[0];
  const promptSec = (h('div', { class: 'section' },
    h('label', { class: 'label white', for: 'mdj-prompt' }, 'Décris ton ambiance'),
    h('div', { class: 'row' }, input,
      h('button', {
        class: 'sq', type: 'button', 'aria-label': 'Demander à Claude', title: 'Demander à Claude',
        onclick: () => { if (!sel.prompt.trim()) { input.focus(); return; } startFromUi(false); }
      }, icon('sparkle', 20))),
    h('div', { class: 'muted' }, hasKey ? 'Envoyé à ' + (settings.textEngine === 'gemini' && hasGemini || !hasClaude ? 'Gemini' : modelName) : 'Ajoute une clé Claude ou Gemini dans Réglages pour utiliser ce champ.')));
  const divider = h('div', { class: 'divider' }, 'ou compose-la');

  // Styles et sous-styles : on peut en allumer plusieurs. Un style sans sous-style choisi est pris en entier.
  const styles = C.styleList(sel.style);
  const multiChips = (options, isOn, onPick) => h('div', { class: 'chips' }, options.map((o) => h('button', {
    type: 'button', class: 'chip' + (isOn(o[0]) ? ' on' : ''), 'aria-pressed': String(isOn(o[0])), onclick: () => onPick(o[0])
  }, o[1])));
  const styleSec = section('Style', [
    multiChips(C.STYLES.map((x) => [x.id, x.label]), (id) => (id === 'all' ? !styles.length : styles.includes(id)), (id) => {
      sel.style = C.toggleStyle(sel.style, id);
      sel.sub = C.cleanSubs(sel);
      selChanged();
    }),
    styles.length > 1 ? h('div', { class: 'muted' }, styles.length + ' styles mélangés. Touche un style pour le retirer, « Tous les styles » pour tout effacer.') : null,
    h('div', { class: 'btns' },
      h('button', { class: 'btn small', type: 'button', onclick: () => { stylesView = { add: true }; render(); } }, '+ Ajouter un style'),
      h('button', { class: 'btn small', type: 'button', onclick: () => { stylesView = { add: false }; render(); } }, 'Gérer les styles'))]);
  const subSec = styles.filter((id) => C.styleById(id).subs.length).map((id) => {
    const st = C.styleById(id);
    const mine = C.subsOf(sel, id);
    return section('Sous-style · ' + st.label, multiChips([['all', 'Tous']].concat(st.subs),
      (x) => (x === 'all' ? !mine.length : mine.includes(x)),
      (x) => { sel.sub = C.toggleSub(sel, id, x); selChanged(); }));
  });
  const momentSec = (section('Moment', chips(C.MOMENTS.map((m) => [m.id, m.label]), sel.moment, (id) => {
    sel.moment = id;
    sel.energy = C.momentById(id).energy;
    // Un nouveau moment apporte sa propre courbe : la courbe personnalisée est remplacée.
    if (C.hasCustomCurve(sel)) toast("Courbe d'énergie du moment « " + C.momentById(id).label + ' » reprise à la place de ta courbe personnalisée.', null, 4000);
    sel.curve = null;
    selChanged();
  })));

  R.energyVal = h('span', { class: 'label white' }, energyText());
  const range = h('input', {
    type: 'range', id: 'mdj-energy', min: '1', max: '5', step: '1', value: String(sel.energy),
    oninput: (e) => { sel.energy = Number(e.target.value); R.energyVal.textContent = tr(energyText()); updateCurve(); },
    onchange: () => { saveSel(); liveUpdate(); }
  });
  const energySec = (h('div', { class: 'section' },
    h('div', { class: 'row' }, h('label', { class: 'label', for: 'mdj-energy' }, 'Énergie'), R.energyVal),
    range,
    h('div', { class: 'scale' }, h('span', null, 'Très calme'), h('span', null, 'À fond'))));
  const curve = curveCard(sel, null);

  const moodSec = (section(['Humeur ', h('span', { class: 'light' }, '(facultatif)')],
    chips(C.MOODS.map((m) => [m[0], m[1]]), sel.mood, (id) => { sel.mood = sel.mood === id ? null : id; selChanged(); })));
  const eraSec = (section(['Époque ', h('span', { class: 'light' }, '(facultatif)')],
    [eraChips(),
      C.eraList(sel.era).length > 1 ? h('div', { class: 'muted' }, C.eraText(sel.era) + ' mélangées. Touche une décennie pour la retirer, « Toutes » pour tout effacer.') : null,
      sel.era === 'actuel' ? h('div', { class: 'muted' }, sel.source === 'likes'
        ? "Actuel : tes J'aime sortis ces 12 derniers mois (date estimée)."
        : "Actuel : titres tirés des playlists de nouveautés de YouTube Music pour ce style.") : null]));

  const modeSec = (h('div', { class: 'section' },
    h('h2', { class: 'label' }, 'Mode de lecture'),
    seg([['continu', 'En continu'], ['fixe', 'Sélection fixe']], sel.mode, (id) => { sel.mode = id; saveSel(); render(); }, 'Mode de lecture'),
    h('div', { class: 'muted' }, sel.mode === 'fixe'
      ? "Toute la sélection est préparée d'un coup, et la courbe d'énergie s'étale sur la durée choisie."
      : "Garde quelques titres d'avance et s'adapte si tu changes d'ambiance en cours de route.")));
  const timing = [];
  // La durée du cycle se règle juste sous la courbe d'énergie qu'elle étire ou resserre.
  const cycleSec = sel.mode === 'continu'
    ? section('Durée du cycle', [
      cycleChips(sel, (id) => { sel.cycle = id; selChanged(); }),
      h('div', { class: 'muted' }, cycleNote(sel))])
    : null;
  if (sel.mode === 'fixe') {
    timing.push(section('Durée', [chips(C.DURATIONS, sel.duration, (id) => { sel.duration = id; saveSel(); render(); }),
      h('div', { class: 'muted' }, sel.duration === 'until'
        ? "Heure visée : le titre en cours à cette heure-là est joué jusqu'au bout, puis la sélection s'arrête."
        : 'Durée visée : la sélection peut finir quelques minutes avant ou après, sans jamais couper le dernier titre.')]));
    if (sel.duration === 'until') {
      timing.push(h('div', { class: 'row start' },
        h('label', { class: 'label', for: 'mdj-until' }, 'Fin à'),
        h('input', {
          class: 'input', id: 'mdj-until', type: 'time', value: sel.until, style: { flex: '0 0 130px' },
          onchange: (e) => { sel.until = e.target.value || '18:30'; saveSel(); updateSummary(); if (R.curveEnd) R.curveEnd.textContent = tr(curveEndText(null)); }
        })));
    }
  }
  const radioRow = switchRow('Mode radio', 'Une voix annonce les titres', settings.radio, (v) => { settings.radio = v; saveSettings(); });
  if (isFull()) {
    // Trois colonnes dans l'ordre où l'on compose : d'où viennent les titres, quelle musique, quel rythme.
    // Au centre, cinq colonnes côte à côte, de gauche à droite : style → sous-style → moment → humeur → époque.
    const pcol = (kids) => h('div', { class: 'pcol' }, kids);
    const subCol = subSec.length ? subSec : section('Sous-style', h('div', { class: 'muted' },
      styles.length ? 'Pas de sous-style pour ce choix.' : 'Choisis un ou plusieurs styles à gauche pour voir leurs sous-styles.'));
    const picker = h('div', { class: 'picker' }, pcol(styleSec), pcol(subCol), pcol(momentSec), pcol(moodSec), pcol(eraSec));
    append(body, h('div', { class: 'ambgrid' },
      h('div', { class: 'col aleft' }, colTitle('Point de départ'), promptSec, card(ambianceSection()), srcSec),
      h('div', { class: 'col amid' }, colTitle('Compose ton ambiance'), picker),
      h('div', { class: 'col aright' }, colTitle('Énergie et durée'), energySec, curve, cycleSec, modeSec, timing, card(radioRow))));
  } else {
    append(body, [promptSec, ambianceSection(), srcSec, divider, styleSec, subSec, momentSec, energySec, curve, cycleSec, moodSec, eraSec, modeSec, timing, radioRow]);
  }

  const foot = h('div', { class: 'foot' });
  const bar = pendingAmbBar();
  if (bar) foot.appendChild(bar);
  R.summary = h('div', { class: 'muted' }, summaryText());
  foot.appendChild(R.summary);
  if (session && (session.status === 'playing' || session.status === 'preparing' || session.status === 'suspended')) {
    foot.appendChild(h('div', { class: 'muted' }, bar ? 'Ou lance une nouvelle sélection avec ces réglages : elle remplace celle en cours.'
      : 'Une émission est en cours : tes changements ici attendront que tu cliques sur « Mettre à jour l’ambiance ». Lancer une nouvelle sélection remplace celle en cours.'));
  }
  if (sel.mode === 'fixe') {
    foot.appendChild(h('div', { class: 'btns' },
      h('button', { class: 'btn primary grow', type: 'button', disabled: starting, onclick: () => startFromUi(false) }, 'Créer la sélection'),
      h('button', { class: 'btn', type: 'button', disabled: starting, onclick: () => startFromUi(true) }, 'Enregistrer en playlist')));
  } else {
    foot.appendChild(h('div', { class: 'btns' },
      h('button', { class: 'btn primary grow', type: 'button', disabled: starting, onclick: () => startFromUi(false) }, 'Lancer en continu')));
  }
  return [body, foot];
}

// ------------------------------------------------------ onglet En cours
function statusLabel(s) {
  if (s.status === 'preparing') return 'Préparation';
  if (s.status === 'suspended') return 'En pause';
  if (s.status === 'ended') return 'Terminé';
  return ps.paused ? 'En pause' : 'En lecture';
}

function liveNote() {
  const s = session;
  if (!s) return '';
  if (s.status !== 'playing') return s.note || '';
  if (ps.ad) return 'Publicité en cours : Mood DJ reprend juste après.';
  if (s.note) return s.note;
  const parts = [];
  const cur = s.current;
  if (cur && ps.videoId === cur.videoId) {
    const d = ps.duration || cur.duration || 0;
    const rem = d - (ps.time || 0);
    const fade = effectiveFade();
    if (d && rem > 0 && rem < 120) parts.push(fade > 0 ? 'Fondu dans ' + C.fmtTime(Math.max(0, rem - fade)) : 'Titre suivant dans ' + C.fmtTime(rem));
  }
  if (s.timer.endAt) parts.push('Arrêt dans ' + C.fmtDuration(Math.ceil((s.timer.endAt - Date.now()) / 60000)));
  else if (s.timer.kind === 'end') parts.push('Arrêt à la fin du titre');
  if (s.mode === 'fixe' && s.endAt) parts.push('Fin prévue à ' + new Date(s.endAt).toLocaleTimeString(uiLocale(), { hour: '2-digit', minute: '2-digit' }));
  return parts.join(' · ');
}

function tabEnCours() {
  const s = session;
  const body = h('div', { class: 'body' });
  if (!s) {
    body.appendChild(h('div', { class: 'empty' },
      h('div', { class: 'label white' }, 'Aucune sélection en cours'),
      h('div', { class: 'muted' }, 'Choisis une ambiance et lance une sélection.'),
      h('button', { class: 'btn', type: 'button', onclick: () => setTab('ambiance') }, "Aller à l'onglet Ambiance")));
    return [body];
  }
  const full = isFull();
  const colA = [];
  const colB = [];
  const colC = [];
  colA.push(h('div', { class: 'section' },
    h('div', { class: 'muted' }, 'Ambiance'),
    h('div', { class: 'big' }, s.label),
    h('div', { class: 'pills' },
      pill({ claude: 'Proposé par Claude', likes: "Mes J'aime", live: 'Nouveautés YouTube Music', similar: 'Artistes similaires' }[s.source] || 'Catalogue intégré'),
      s.discover ? pill('Découverte') : null,
      s.sel.prompt && s.sel.prompt.trim() ? null : pill(styleText(s.sel)),
      pill(C.momentById(s.sel.moment).label),
      pill('Énergie ' + s.sel.energy),
      s.sel.mood ? pill(moodLabel(s.sel.mood)) : null,
      pill(s.mode === 'fixe' ? 'Sélection fixe · ' + C.fmtDuration(s.targetSec / 60) : 'En continu'))));
  // Nouvelle ambiance en attente derrière les titres déjà prévus : on peut l'avancer.
  const ch = s.ambianceChange;
  if (ch && !ch.done && s.status === 'playing') {
    const waiting = s.queue.filter((t) => ch.locked.includes(t.key)).length;
    colA.push(h('div', { class: 'card' },
      h('div', { class: 'muted' }, 'Nouvelle ambiance prévue : « ' + ch.to + ' »' + (waiting ? ', après ' + (waiting === 1 ? 'le titre déjà prévu' : 'les ' + waiting + ' titres déjà prévus') : ', dès le prochain titre') + '.'),
      h('div', { class: 'btns' },
        waiting && !ch.now ? h('button', { class: 'btn small', type: 'button', onclick: changeAmbianceNow }, 'Changer maintenant') : null,
        canUndoAmb(s) ? h('button', { class: 'btn small', type: 'button', title: 'Revenir à l’ambiance d’avant, tant que la nouvelle n’a pas commencé', onclick: undoAmbiance }, 'Annuler') : null)));
  }
  // Réglages modifiés dans l'onglet Ambiance, pas encore appliqués.
  if (pendingAmb(s)) {
    colA.push(h('div', { class: 'card' },
      h('div', { class: 'muted' }, 'Des changements d’ambiance attendent ta validation dans l’onglet Ambiance.'),
      h('div', { class: 'btns' }, h('button', { class: 'btn small', type: 'button', onclick: () => setTab('ambiance') }, 'Voir'))));
  }
  const curveEl = curveCard(s.sel, s);
  let cycleEl = null;
  if (s.mode === 'continu' && (s.status === 'playing' || s.status === 'suspended')) {
    cycleEl = (section('Durée du cycle', [
      cycleChips(s.sel, (id) => {
        sel.cycle = id;
        saveSel();
        s.sel.cycle = id;
        if (!(s.timer.endAt && s.sel.moment === 'coucher')) setSpan(s, C.cycleMinutes(s.sel));
        for (const t of s.queue.splice(lockedCount(s))) s.usedKeys.delete(t.key);
        ensureQueue();
        render();
      }),
      h('div', { class: 'muted' }, cycleNote(s.sel))]));
  }
  // En pleine page, le titre en cours passe en tête ; la courbe vient après.
  if (!full) colA.push(curveEl, cycleEl);

  const cur = s.current;
  R.nowBar = h('div');
  R.nowTime = h('div', { class: 'scale' }, h('span', null, ''), h('span', null, ''));
  R.statusLine = h('div', { class: 'accent' }, statusLabel(s));
  colA.push(h('div', { class: 'now' },
    h('div', { class: 'art' }, cur && cur.videoId ? h('img', { src: 'https://i.ytimg.com/vi/' + cur.videoId + '/hqdefault.jpg', alt: '' }) : icon('vinyl', 28)),
    h('div', { class: 'qtext' },
      R.statusLine,
      h('div', { class: 'qt', style: { fontSize: '16px' } }, cur ? cur.title : (s.status === 'preparing' ? 'Préparation…' : '—')),
      h('div', { class: 'qa', style: { fontSize: '13px' } }, cur ? cur.artist : ''),
      h('div', { class: 'bar' }, R.nowBar),
      R.nowTime)));
  R.note = h('div', { class: 'stat' }, icon('mic', 16), h('span', null, ''));
  colA.push(R.note);

  if (s.status === 'playing') {
    colA.push(h('div', { class: 'btns' },
      h('button', { class: 'btn grow', type: 'button', onclick: skip }, 'Passer'),
      h('button', { class: 'btn grow', type: 'button', onclick: () => Promise.resolve(ctl.toggle()).then(() => setTimeout(render, 300)) }, ps.paused ? 'Lecture' : 'Pause'),
      h('button', { class: 'btn grow', type: 'button', onclick: () => endSession('stop', 0) }, 'Arrêter')));
    if (cur && cur.artist && !cur.guest) colA.push(h('div', { class: 'btns' }, h('button', {
      class: 'btn small', type: 'button', title: 'Liste noire : plus aucun titre de cet artiste ne passera', onclick: () => banArtist(cur.artist)
    }, 'Ne plus passer ' + cur.artist.split(/,| & | feat\.? /i)[0])));
  } else if (s.status === 'suspended') {
    colA.push(h('div', { class: 'btns' },
      h('button', { class: 'btn primary grow', type: 'button', onclick: resume }, 'Reprendre'),
      h('button', { class: 'btn grow', type: 'button', onclick: () => { s.status = 'ended'; render(); } }, 'Terminer')));
  }
  // En pleine page : la courbe à gauche, la durée du cycle à sa droite et la minuterie dessous (tout
  // tient à l'écran). La minuterie est ajoutée plus bas, dans le même bloc.
  const curveSide = full ? h('div', { class: 'cpr' }, cycleEl) : null;
  // Pleine page : ce bloc s'étend sous « En ce moment » et « À suivre », jusqu'aux dédicaces.
  const curveBlock = full ? h('div', { class: 'curvepair' }, h('div', { class: 'cpl' }, curveEl), curveSide) : null;

  const shown = full ? 10 : 8;
  const upcoming = s.queue.slice(0, shown);
  const list = h('div', { class: 'section' }, h('h2', { class: 'label' }, 'À suivre' + (s.queue.length > shown ? ' (' + s.queue.length + ' titres)' : '')));
  if (!upcoming.length) {
    list.appendChild(h('div', { class: 'muted' }, s.filling ? 'Recherche des titres…' : (s.status === 'ended' ? 'Sélection terminée.' : 'Rien pour le moment.')));
  }
  const lockN = lockedCount(s);
  upcoming.forEach((t, i) => {
    list.appendChild(h('div', { class: 'qitem' },
      h('div', { class: 'qtext' }, h('span', { class: 'qt' }, t.title),
        h('span', { class: 'qa' }, t.artist, i < lockN && s.status !== 'ended' ? h('span', { class: 'qlock', title: programmeOn() ? 'Verrouillé : ce titre est annoncé au programme, il ne changera pas' : 'Verrouillé : ce titre ne changera pas, son annonce est déjà prête' }, ' · verrouillé') : null,
          changeFor(s, t) && (i === 0 || !changeFor(s, s.queue[i - 1])) ? h('span', { class: 'qlock', title: "L'animateur annoncera la nouvelle ambiance sur ce titre" }, ' · nouvelle ambiance') : null,
          s.mix && t.simFrom ? h('span', { class: 'qlock', title: 'Découverte : artiste proche de ' + t.simFrom }, ' · découverte') : null,
          t.dedic && !t.dedic.done ? h('span', { class: 'qlock', title: (t.dedic.to ? 'Pour ' + t.dedic.to : '') }, t.request ? ' · demande' : ' · dédicace') : null,
          t.pick ? h('span', { class: 'qlock', title: t.pick.why || '' }, ' · choix de ' + t.pick.name) : null)),
      energyBars(t.energy),
      s.status === 'ended' ? null : h('button', {
        class: 'x', type: 'button', 'aria-label': 'Retirer ' + t.title,
        onclick: () => { const r = s.queue.splice(i, 1)[0]; if (r) s.failedKeys.add(r.key); ensureQueue(); render(); }
      }, icon('x', 16))));
  });
  colB.push(list);

  if (s.status === 'playing' || s.status === 'suspended') {
    const notes = {
      off: 'La musique continue jusqu’à la fin de la sélection.',
      end: 'La lecture s’arrête à la fin du titre en cours.'
    };
    colC.push(dedicCard(s));
    const timerEl = h('div', { class: 'section' },
      h('h2', { class: 'label' }, 'Minuterie'),
      chips(C.TIMERS, s.timer.kind, setTimer),
      h('div', { class: 'muted' }, notes[s.timer.kind] || 'Le volume baisse doucement sur la dernière minute, puis la lecture s’arrête.'));
    if (full) curveSide.appendChild(timerEl); else colC.push(timerEl);
  }
  if (full) {
    const grid = cols([colTitle('En ce moment')].concat(colA), [colTitle('À suivre')].concat(colB), colC.length ? [colTitle('Dédicaces')].concat(colC) : null);
    if (curveBlock) { grid.classList.add('withcurve'); grid.appendChild(h('div', { class: 'curverow' }, curveBlock)); }
    append(body, grid);
  }
  else append(body, [colA, colB, colC]);

  const foot = h('div', { class: 'foot' });
  const btns = h('div', { class: 'btns' });
  if (s.status === 'playing' || s.status === 'suspended') {
    if (s.mode === 'fixe') {
      btns.appendChild(h('button', {
        class: 'btn grow', type: 'button',
        onclick: () => { s.targetSec += 1800; if (s.endAt) s.endAt += 1800000; s.ending = false; s.finishing = false; ensureQueue(); toast('Sélection prolongée de 30 minutes.'); render(); }
      }, 'Prolonger de 30 min'));
    } else {
      btns.appendChild(h('button', {
        class: 'btn grow', type: 'button',
        onclick: () => { const n = lockedCount(s); for (const t of s.queue.splice(n)) s.usedKeys.delete(t.key); ensureQueue(); toast('Suite regénérée (' + (n === 1 ? 'le prochain titre reste verrouillé' : 'les ' + n + ' prochains titres restent verrouillés') + ').'); render(); }
      }, 'Regénérer la suite'));
    }
  } else if (s.status === 'ended') {
    btns.appendChild(h('button', { class: 'btn grow', type: 'button', onclick: () => setTab('ambiance') }, 'Nouvelle sélection'));
  }
  btns.appendChild(h('button', { class: 'btn', type: 'button', onclick: () => savePlaylist(s) }, 'Enregistrer en playlist'));
  foot.appendChild(btns);
  return [body, foot];
}

function updateLive() {
  updateMini();
  const s = session;
  if (!s || !R.note) return;
  const span = R.note.lastChild;
  if (span) span.textContent = tr(liveNote());
  if (R.statusLine) R.statusLine.textContent = tr(statusLabel(s));
  const cur = s.current;
  if (cur && ps.videoId === cur.videoId && R.nowBar) {
    const d = ps.duration || cur.duration || 0;
    const t = ps.time || 0;
    R.nowBar.style.width = (d ? Math.min(100, (t / d) * 100) : 0).toFixed(1) + '%';
    if (R.nowTime) {
      R.nowTime.firstChild.textContent = C.fmtTime(t);
      R.nowTime.lastChild.textContent = d ? '-' + C.fmtTime(d - t) : '';
    }
  }
  if (R.markerLine) {
    const p = posFromSec(s, contentTime(s));
    const x = (10 + p * 320).toFixed(1);
    R.markerLine.setAttribute('x1', x);
    R.markerLine.setAttribute('x2', x);
  }
}

// Carte « Dédicace ou demande » de l'onglet En cours. Le brouillon survit aux rafraîchissements.
const dedDraft = { to: '', msg: '', ask: '', from: '' };
let dedSending = false;
function dedicCard(s) {
  const field = (k, id, label, ph, max) => h('div', { class: 'section', style: { gap: '4px' } },
    h('label', { class: 'label', for: id }, label),
    h('input', { class: 'input', id, type: 'text', maxlength: String(max), placeholder: ph, value: dedDraft[k], oninput: (e) => { dedDraft[k] = e.target.value; } }));
  const pending = s.queue.filter((t) => t.dedic && !t.dedic.done).length;
  return h('div', { class: 'card' },
    h('h2', { class: 'label white' }, 'Dédicace ou demande'),
    h('div', { class: 'muted' }, 'Les animateurs la lisent juste avant le prochain titre. Avec un titre demandé, il passe juste après celui en cours.'),
    field('to', 'mdj-ded-to', 'Pour', 'ex. Marie, qui fête ses 30 ans', 60),
    field('msg', 'mdj-ded-msg', 'Message (facultatif)', 'ex. Bon anniversaire, on pense fort à toi !', 280),
    field('ask', 'mdj-ded-ask', 'Titre demandé (facultatif)', "ex. Tri Martolod d'Alan Stivell", 120),
    field('from', 'mdj-ded-from', 'De la part de', (settings.listenerName || '').trim() || 'ton prénom', 40),
    h('div', { class: 'btns' }, h('button', {
      class: 'btn primary grow', type: 'button', disabled: dedSending || !settings.radio,
      onclick: async () => {
        dedSending = true; render();
        const ok = await sendDedication({ to: dedDraft.to, msg: dedDraft.msg, ask: dedDraft.ask, from: dedDraft.from || settings.listenerName || '' }).catch((e) => { toast(e.message); return false; });
        dedSending = false;
        if (ok) { dedDraft.to = ''; dedDraft.msg = ''; dedDraft.ask = ''; }
        render();
      }
    }, dedSending ? 'Recherche…' : "Envoyer à l'antenne")),
    !settings.radio ? h('div', { class: 'muted warn' }, 'Active le mode radio pour que les animateurs la lisent.') : null,
    pending ? h('div', { class: 'muted' }, pending + (pending > 1 ? ' dédicaces en attente.' : ' dédicace en attente.')) : null);
}

// ----------------------------------------------- Réglages : la grille
const gridDraft = { id: '', name: '', days: [], time: '20:00', minutes: 60, amb: '', wake: false };
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
function resetGridDraft() { Object.assign(gridDraft, { id: '', name: '', days: [], time: '20:00', minutes: 60, amb: '', wake: false }); }
function saveGridEntry() {
  const name = gridDraft.name.trim().slice(0, 50);
  if (!name) { toast("Donne un nom à l'émission."); return; }
  if (!gridDraft.days.length) { toast('Choisis au moins un jour.'); return; }
  if (!/^\d{1,2}:\d{2}$/.test(gridDraft.time)) { toast("Choisis l'heure de début."); return; }
  const list = (settings.schedule || []).slice();
  const prev = list.find((x) => x.id === gridDraft.id);
  const e = {
    id: gridDraft.id || uid(), name, days: gridDraft.days.slice().sort(), time: gridDraft.time, minutes: Number(gridDraft.minutes) || 0,
    amb: gridDraft.amb, sel: gridDraft.amb ? null : (prev && !prev.amb && prev.sel ? prev.sel : clone(ambSnap(sel))), wake: !!gridDraft.wake, on: prev ? prev.on !== false : true
  };
  const i = list.findIndex((x) => x.id === e.id);
  if (i >= 0) list[i] = e; else list.push(e);
  settings.schedule = list;
  saveSettings();
  toast('Émission « ' + name + ' » ' + (i >= 0 ? 'modifiée.' : 'ajoutée à la grille.'), null, 4000);
  resetGridDraft();
  render();
}
function gridCard() {
  const list = (settings.schedule || []).slice().sort((a, b) => a.time.localeCompare(b.time));
  const nx = nextScheduled();
  const daysText = (d) => (d.length === 7 ? 'tous les jours' : d.length === 5 && [1, 2, 3, 4, 5].every((x) => d.includes(x)) ? 'en semaine'
    : d.length === 2 && d.includes(0) && d.includes(6) ? 'le week-end' : DAY_ORDER.filter((x) => d.includes(x)).map((x) => DAY_NAMES[x]).join(' '));
  const rows = list.map((e) => h('div', { class: 'qitem' },
    h('div', { class: 'qtext' },
      h('span', { class: 'qt' }, (e.wake ? '⏰ ' : '') + e.name),
      h('span', { class: 'qa' }, daysText(e.days) + ' à ' + e.time.replace(':', ' h ') + ' · ' + (e.minutes ? C.fmtDuration(e.minutes) : 'en continu') +
        ' · ' + (e.amb ? 'ambiance « ' + e.amb + ' »' : (e.sel ? styleText(e.sel) : 'réglages actuels')) + (e.on === false ? ' · en pause' : ''))),
    h('button', { class: 'x', type: 'button', title: e.on === false ? 'Réactiver' : 'Mettre en pause', 'aria-label': (e.on === false ? 'Réactiver ' : 'Mettre en pause ') + e.name,
      onclick: () => { e.on = e.on === false; saveSettings(); render(); } }, icon(e.on === false ? 'play' : 'pause', 14)),
    h('button', { class: 'x', type: 'button', title: 'Modifier', 'aria-label': 'Modifier ' + e.name,
      onclick: () => { Object.assign(gridDraft, { id: e.id, name: e.name, days: e.days.slice(), time: e.time, minutes: e.minutes || 0, amb: e.amb || '', wake: !!e.wake }); render(); } }, icon('sparkle', 14)),
    h('button', { class: 'x', type: 'button', title: 'Lancer maintenant', 'aria-label': 'Lancer ' + e.name + ' maintenant', onclick: () => startScheduled(e) }, icon('next', 14)),
    h('button', { class: 'x', type: 'button', title: 'Supprimer', 'aria-label': 'Supprimer ' + e.name,
      onclick: () => {
        settings.schedule = (settings.schedule || []).filter((x) => x.id !== e.id); saveSettings(); render();
        toast('« ' + e.name + ' » retirée de la grille.', { label: 'Annuler', fn: () => { settings.schedule = (settings.schedule || []).concat([e]); saveSettings(); render(); } }, 6000);
      } }, icon('x', 14))));
  const nameIn = h('input', { class: 'input', id: 'mdj-grid-name', type: 'text', maxlength: '50', placeholder: 'ex. Rock du jeudi soir', value: gridDraft.name, oninput: (ev) => { gridDraft.name = ev.target.value; } });
  const timeIn = h('input', { class: 'input', id: 'mdj-grid-time', type: 'time', value: gridDraft.time, style: { flex: '0 0 130px' }, onchange: (ev) => { gridDraft.time = ev.target.value || '20:00'; } });
  return h('div', { class: 'card' },
    h('h2', { class: 'label white' }, "Grille des émissions"),
    h('div', { class: 'muted' }, nx ? 'Prochaine émission : « ' + nx.e.name + ' », ' + whenText(nx.at) + '.' : 'Programme des émissions à heure fixe, ou un réveil en musique.'),
    rows.length ? h('div', { class: 'histlist' }, rows) : null,
    h('div', { class: 'subhead' }, h('span', null, gridDraft.id ? "Modifier l'émission" : 'Nouvelle émission')),
    h('div', { class: 'section', style: { gap: '4px' } }, h('label', { class: 'label', for: 'mdj-grid-name' }, 'Nom'), nameIn),
    h('div', { class: 'label' }, 'Jours'),
    h('div', { class: 'chips' }, DAY_ORDER.map((d) => h('button', {
      type: 'button', class: 'chip' + (gridDraft.days.includes(d) ? ' on' : ''), 'aria-pressed': String(gridDraft.days.includes(d)),
      onclick: () => { gridDraft.days = gridDraft.days.includes(d) ? gridDraft.days.filter((x) => x !== d) : gridDraft.days.concat(d); render(); }
    }, DAY_NAMES[d]))),
    h('div', { class: 'row start' }, h('label', { class: 'label', for: 'mdj-grid-time' }, 'Début'), timeIn),
    h('label', { class: 'label', for: 'mdj-grid-dur' }, 'Durée'),
    h('select', { class: 'select', id: 'mdj-grid-dur', onchange: (ev) => { gridDraft.minutes = Number(ev.target.value); } },
      [[0, 'En continu (jusqu\'à ce que tu arrêtes)'], [30, '30 min'], [45, '45 min'], [60, '1 h'], [90, '1 h 30'], [120, '2 h'], [180, '3 h'], [240, '4 h']]
        .map((o) => h('option', { value: String(o[0]), selected: Number(gridDraft.minutes) === o[0] }, o[1]))),
    h('label', { class: 'label', for: 'mdj-grid-amb' }, 'Ambiance'),
    h('select', { class: 'select', id: 'mdj-grid-amb', onchange: (ev) => { gridDraft.amb = ev.target.value; } },
      h('option', { value: '', selected: !gridDraft.amb }, gridDraft.id ? 'Celle enregistrée avec cette émission' : "Les réglages actuels de l'onglet Ambiance"),
      savedAmb.map((a) => h('option', { value: a.name, selected: gridDraft.amb === a.name }, 'Mes ambiances : ' + a.name))),
    switchRow('Réveil en douceur', "Ouvre YouTube Music si besoin, volume qui monte doucement sur trois minutes, animateurs du matin", gridDraft.wake, (v) => { gridDraft.wake = v; }),
    h('div', { class: 'btns' },
      h('button', { class: 'btn primary grow', type: 'button', onclick: saveGridEntry }, gridDraft.id ? 'Enregistrer' : 'Ajouter à la grille'),
      gridDraft.id ? h('button', { class: 'btn', type: 'button', onclick: () => { resetGridDraft(); render(); } }, 'Annuler') : null),
    h('div', { class: 'muted' }, "Chrome doit être ouvert et l'ordinateur allumé (pas en veille) à l'heure prévue. Si aucun onglet YouTube Music n'est ouvert, Mood DJ en ouvre un. Selon les réglages de Chrome, la musique peut attendre un clic sur la page pour démarrer."));
}

// --------------------------------------------------- onglet Historique
const histOpen = new Set();
function fmtShowDate(at, end) {
  const d = new Date(at);
  const day = d.toLocaleDateString(uiLocale(), { weekday: 'short', day: 'numeric', month: 'short' });
  const hm = (x) => new Date(x).toLocaleTimeString(uiLocale(), { hour: '2-digit', minute: '2-digit' });
  const min = Math.max(1, Math.round((end - at) / 60000));
  return day + ' · ' + hm(at) + ' → ' + hm(end) + ' (' + C.fmtDuration(min) + ')';
}
function showCard(e) {
  const open = histOpen.has(e.id);
  const live = session && session.id === e.id && session.status !== 'ended';
  const kept = e.tracks.filter((x) => !x.sk);
  const pills = h('div', { class: 'pills' },
    pill(e.tracks.length + ' titre' + (e.tracks.length > 1 ? 's' : '')),
    e.tracks.length - kept.length ? pill((e.tracks.length - kept.length) + ' passé' + (e.tracks.length - kept.length > 1 ? 's' : '')) : null,
    e.moment ? pill(e.moment) : null,
    (e.guests || []).length ? pill('Invité' + (e.guests.length > 1 ? 's' : '') + ' : ' + e.guests.map((g) => g.name).join(', ')) : null,
    (e.dedics || []).length ? pill(e.dedics.length + ' dédicace' + (e.dedics.length > 1 ? 's' : '')) : null,
    e.score && (e.score.A || e.score.B) ? pill('Score ' + (e.host || 'A') + ' ' + (e.score.A || 0) + ' – ' + (e.score.B || 0) + ' ' + (e.cohost || 'B')) : null,
    live ? pill('En cours') : null);
  const list = !open ? null : h('div', { class: 'histlist' }, e.tracks.slice().reverse().map((x, i) => h('div', { class: 'qitem' },
    h('div', { class: 'qtext' }, h('span', { class: 'qt' }, x.t), h('span', { class: 'qa' }, x.a,
      x.sk ? h('span', { class: 'qlock' }, ' · passé') : null, x.g ? h('span', { class: 'qlock' }, ' · choisi dans YouTube Music') : null)),
    x.v ? h('button', {
      class: 'x', type: 'button', 'aria-label': 'Écouter ' + x.t, title: djActive() ? 'Ouvrir dans un nouvel onglet (une sélection est en cours)' : 'Écouter ce titre',
      onclick: () => { if (djActive()) { window.open('https://music.youtube.com/watch?v=' + encodeURIComponent(x.v), '_blank'); return; } autoplayGuardOn = false; callSafe('play', x.v, {}); }
    }, icon('play', 14)) : null,
    bannedSet().has(C.artistKey(x.a)) ? null : h('button', {
      class: 'x', type: 'button', 'aria-label': 'Ne plus passer ' + x.a, title: 'Ne plus jamais passer ' + x.a, onclick: () => banArtist(x.a)
    }, icon('ban', 14)))));
  return h('div', { class: 'card' },
    h('div', { class: 'row' },
      h('div', { class: 'grow' }, h('div', { class: 'muted' }, fmtShowDate(e.at, e.end)), h('div', { class: 'label white' }, e.label || e.styles || 'Émission')),
      h('button', { class: 'iconbtn', type: 'button', 'aria-expanded': String(open), 'aria-label': open ? 'Replier' : 'Voir les titres',
        title: open ? 'Replier' : 'Voir les titres', onclick: () => { if (open) histOpen.delete(e.id); else histOpen.add(e.id); render(); } }, icon(open ? 'shrink' : 'expand', 18))),
    pills,
    list,
    h('div', { class: 'btns' },
      e.sel ? h('button', {
        class: 'btn small', type: 'button', title: 'Recharger les réglages de cette émission dans l\'onglet Ambiance',
        onclick: () => { sel = Object.assign(clone(sel), clone(e.sel)); saveSel(); setTab('ambiance'); toast('Ambiance de cette émission chargée.', { label: 'Lancer', fn: () => startFromUi(false) }, 6000); }
      }, 'Reprendre cette ambiance') : null,
      h('button', { class: 'btn small', type: 'button', onclick: () => playlistFromTracks('Mood DJ · ' + (e.label || 'émission') + ' · ' + new Date(e.at).toLocaleDateString(uiLocale(), { day: '2-digit', month: '2-digit' }), kept.map((x) => x.v)) }, 'Enregistrer en playlist'),
      live ? null : h('button', {
        class: 'btn small', type: 'button',
        onclick: () => {
          const i = showHistory.findIndex((x) => x.id === e.id);
          if (i < 0) return;
          const [gone] = showHistory.splice(i, 1);
          saveHistory(); render();
          toast('Émission retirée de l\'historique.', { label: 'Annuler', fn: () => { showHistory.splice(i, 0, gone); saveHistory(); render(); } }, 6000);
        }
      }, 'Supprimer')));
}
function tabHistorique() {
  const body = h('div', { class: 'body' });
  if (!showHistory.length) {
    body.appendChild(h('div', { class: 'empty' },
      h('div', { class: 'label white' }, 'Aucune émission pour le moment'),
      h('div', { class: 'muted' }, 'Chaque émission est notée ici au fil de l\'eau : les titres joués, les invités et le score des jeux. Tu pourras la reprendre ou la garder en playlist.'),
      h('button', { class: 'btn', type: 'button', onclick: () => setTab('ambiance') }, "Aller à l'onglet Ambiance")));
    return [body];
  }
  const total = showHistory.reduce((n, e) => n + e.tracks.length, 0);
  const head = h('div', { class: 'muted' }, showHistory.length + ' émission' + (showHistory.length > 1 ? 's' : '') + ', ' + total + ' titres. Les ' + HISTORY_MAX + ' dernières sont gardées.');
  const cards = showHistory.map(showCard);
  if (isFull()) append(body, [head, h('div', { class: 'cols n2' }, h('div', { class: 'col' }, cards.filter((_, i) => i % 2 === 0)), h('div', { class: 'col' }, cards.filter((_, i) => i % 2 === 1)))]);
  else append(body, [head, cards]);
  const foot = h('div', { class: 'foot' },
    h('button', {
      class: 'btn', type: 'button',
      onclick: () => {
        const old = showHistory;
        showHistory = session && session.status !== 'ended' ? showHistory.filter((x) => x.id === session.id) : [];
        saveHistory(); render();
        toast('Historique effacé.', { label: 'Annuler', fn: () => { showHistory = old; saveHistory(); render(); } }, 8000);
      }
    }, "Effacer l'historique"));
  return [body, foot];
}

// ---------------------------------------------------------- onglet Son
function tabSon() {
  const body = h('div', { class: 'body' });
  const fadeVal = h('span', { class: 'label white' }, settings.fade ? settings.fade + ' s' : 'Aucun');
  const fadeNote = h('div', { class: 'muted' }, fadeNoteText());
  const fadeCard = (h('div', { class: 'card' },
    h('div', { class: 'row' }, h('label', { class: 'label white', for: 'mdj-fade' }, 'Fondu entre les titres'), fadeVal),
    h('input', {
      type: 'range', id: 'mdj-fade', min: '0', max: '12', step: '1', value: String(settings.fade),
      oninput: (e) => { settings.fade = Number(e.target.value); fadeVal.textContent = settings.fade ? settings.fade + ' s' : tr('Aucun'); fadeNote.textContent = tr(fadeNoteText()); },
      onchange: saveSettings
    }),
    h('div', { class: 'scale' }, h('span', null, 'Coupure sèche'), h('span', null, '12 s')),
    fadeNote,
    switchRow('Fondu enchaîné réel',
      settings.crossfade !== false
        ? "Les deux titres se chevauchent, comme un DJ (fondu de 3 s ou plus, pas avant un interlude). Une petite fenêtre YouTube montre la fin du titre pendant ses 30 dernières secondes. Si un titre ne s'y prête pas, fondu habituel."
        : "Le titre descend, puis le suivant monte.",
      settings.crossfade !== false, (v) => { settings.crossfade = v; saveSettings(); if (!v) callSafe('xfadeDrop', 'réglage coupé'); render(); })));

  const eq = effectiveEq();
  const db = (v) => (v > 0 ? '+' : '') + v + ' dB';
  const autoRow = switchRow("Adapter à l'ambiance", settings.autoSound ? C.describeAuto(soundSel()) : 'Réglage manuel', settings.autoSound, (v) => {
    if (!v) settings.eq = clone(C.autoEq(soundSel()));
    settings.autoSound = v;
    saveSettings();
    applySound();
    render();
  });
  const bands = [['bass', 'Basses'], ['mid', 'Médiums'], ['treble', 'Aigus']].map(([k, label]) => {
    const val = h('span', { class: 'label white', style: { fontSize: '13px' } }, db(eq[k]));
    return h('div', { class: 'section', style: { gap: '4px' } },
      h('div', { class: 'row' }, h('label', { class: 'label', for: 'mdj-eq-' + k }, label), val),
      h('input', {
        type: 'range', id: 'mdj-eq-' + k, min: '-12', max: '12', step: '1', value: String(eq[k]),
        oninput: (e) => {
          if (settings.autoSound) {
            settings.eq = clone(C.autoEq(soundSel()));
            settings.autoSound = false;
            autoRow._switch.setAttribute('aria-pressed', 'false');
            if (autoRow._desc) autoRow._desc.textContent = tr('Réglage manuel');
          }
          settings.eq[k] = Number(e.target.value);
          val.textContent = db(settings.eq[k]);
          callSafe('setEq', settings.eq);
        },
        onchange: saveSettings
      }));
  });
  const eqCard = (h('div', { class: 'card' },
    h('h2', { class: 'label white' }, 'Égaliseur'),
    bands,
    switchRow('Boost voiture', 'Plus de basses et de présence à volume moyen', settings.boost, (v) => { settings.boost = v; saveSettings(); applySound(); }),
    autoRow,
    ps.audio ? null : h('div', { class: 'muted' }, "L'égaliseur s'active au lancement d'une sélection.")));

  const tempoVal = h('span', { class: 'label white' }, settings.tempo + ' %');
  const tempoCard = (h('div', { class: 'card' },
    h('div', { class: 'row' }, h('label', { class: 'label white', for: 'mdj-tempo' }, 'Tempo'), tempoVal),
    h('input', {
      type: 'range', id: 'mdj-tempo', min: '90', max: '110', step: '1', value: String(settings.tempo),
      oninput: (e) => { settings.tempo = Number(e.target.value); tempoVal.textContent = settings.tempo + ' %'; callSafe('setRate', effectiveRate()); },
      onchange: saveSettings
    }),
    h('div', { class: 'scale' }, h('span', null, '90 %'), h('span', null, '110 %')),
    h('div', { class: 'muted' }, 'La hauteur des voix reste naturelle. Le tempo ne s’applique que pendant une sélection Mood DJ.')));

  const silenceCard = (h('div', { class: 'card' },
    switchRow('Sauter les silences', 'En début et en fin de titre', settings.skipSilence, (v) => { settings.skipSilence = v; saveSettings(); })));
  if (isFull()) append(body, cols([colTitle('Enchaînements'), fadeCard, silenceCard, tempoCard], [colTitle('Couleur du son'), eqCard]));
  else append(body, [fadeCard, eqCard, tempoCard, silenceCard]);

  const foot = h('div', { class: 'foot' },
    h('button', {
      class: 'btn', type: 'button',
      onclick: () => {
        Object.assign(settings, { fade: 6, eq: { bass: 0, mid: 0, treble: 0 }, boost: false, autoSound: true, tempo: 100, skipSilence: true });
        saveSettings(); applySound(); callSafe('setRate', effectiveRate()); render();
      }
    }, 'Réinitialiser le son'));
  return [body, foot];
}

function fadeNoteText() {
  if (!settings.autoSound) return 'Durée appliquée telle quelle.';
  const f = effectiveFade();
  return f === Number(settings.fade) ? 'Adapté à l’ambiance : ' + (f ? f + ' s' : 'aucun') + ' en ce moment.' : 'Adapté à l’ambiance : ' + f + ' s en ce moment.';
}
