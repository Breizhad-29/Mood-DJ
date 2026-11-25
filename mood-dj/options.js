// Mood DJ — page des clés API (page de l'extension, hors de YouTube Music).
'use strict';

const KEYS = [
  { name: 'apiKey', title: 'Claude (Anthropic)', test: 'test', site: 'console.anthropic.com',
    use: 'Écrit les annonces, compose les sélections décrites en toutes lettres et classe tes titres.',
    help: 'Clé à créer dans la console Anthropic, rubrique API Keys.' },
  { name: 'geminiKey', title: 'Gemini (Google) · clé gratuite', site: 'aistudio.google.com',
    use: 'Les voix Gemini des animateurs, et le duo à deux voix. Peut aussi écrire les textes à la place de Claude (Réglages › Clés API › « Qui écrit les textes ? »). Utilisée en premier.',
    help: 'Sur aistudio.google.com, bouton « Get API key », dans un projet sans facturation.' },
  { name: 'geminiKey2', title: 'Gemini (Google) · clé payante, en relais', site: 'aistudio.google.com',
    use: 'Prend le relais seulement quand la clé gratuite atteint sa limite. Chaque voix passée par elle est facturée par Google.',
    help: 'Une clé d’un projet Google Cloud lié à un compte de facturation. Fixe une alerte de budget dans la console Google Cloud.' },
  { name: 'lastfmKey', title: 'Last.fm · clé gratuite', test: 'lastfm', site: 'last.fm/api/account/create',
    use: "Audience et tags des titres, bio des artistes, artistes proches pour « Mix de ce titre ».",
    help: 'Colle la « API key », pas le « Shared secret ».' },
  { name: 'discogsToken', title: 'Discogs · jeton gratuit', test: 'discogs', site: 'discogs.com › Paramètres › Développeurs',
    use: "Édition d'origine (label, pays, format), styles précis, crédits détaillés.",
    help: 'Clique sur « Générer un nouveau jeton » et colle-le ici.' },
  { name: 'setlistfmKey', title: 'Setlist.fm · clé gratuite', test: 'setlistfm', site: 'setlist.fm/settings/api',
    use: "Dernier concert de l'artiste et place du morceau sur scène.",
    help: 'Usage non commercial. La clé arrive en général tout de suite.' },
  { name: 'ticketmasterKey', title: 'Ticketmaster · clé gratuite', test: 'ticketmaster', site: 'developer.ticketmaster.com › My Apps',
    use: "Un court flash concert quand l'artiste qui passe a des dates prévues.",
    help: 'Copie la « Consumer Key ».' }
];

const el = (tag, attrs, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of kids.flat()) if (c !== null && c !== undefined) e.append(c.nodeType ? c : String(c));
  return e;
};

function ask(action, payload) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: 'mdj-claude', action, payload: payload || {} }, (res) => {
      const err = chrome.runtime.lastError;
      if (err) return reject(new Error(err.message));
      if (!res || !res.ok) return reject(new Error((res && res.error) || 'pas de réponse'));
      resolve(res.data);
    });
  });
}

async function render() {
  const have = await chrome.storage.local.get(KEYS.map((k) => k.name));
  const box = document.getElementById('keys');
  box.textContent = '';
  for (const k of KEYS) {
    const has = !!have[k.name];
    const msg = el('p', { class: 'msg', role: 'status', 'aria-live': 'polite' });
    const inp = el('input', {
      type: 'password', id: 'in-' + k.name, autocomplete: 'off', spellcheck: 'false', maxlength: '400',
      placeholder: has ? 'Clé enregistrée (masquée) : colle une nouvelle clé pour la remplacer' : 'Colle la clé ici'
    });
    const save = async () => {
      const v = inp.value.trim();
      if (!v) { inp.focus(); return; }
      if (/\s/.test(v)) { msg.textContent = 'Cette clé contient un espace ou un retour à la ligne : vérifie le collage.'; return; }
      await chrome.storage.local.set({ [k.name]: v });
      inp.value = '';
      await render();
      const m = document.querySelector('#card-' + k.name + ' .msg');
      if (m) m.textContent = 'Clé enregistrée.';
    };
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') save(); });
    const card = el('section', { class: 'card', id: 'card-' + k.name },
      el('div', { class: 'row' },
        el('h2', null, el('label', { for: 'in-' + k.name }, k.title)),
        el('span', { class: has ? 'pill on' : 'pill' }, has ? 'Clé enregistrée' : 'Aucune clé')),
      el('p', { class: 'muted' }, k.use),
      el('div', { class: 'row' }, inp, el('button', { type: 'button', class: 'btn primary', onclick: save }, 'Enregistrer')),
      el('div', { class: 'row btns' },
        k.test ? el('button', {
          type: 'button', class: 'btn', disabled: !has,
          onclick: async () => {
            msg.textContent = 'Test en cours…';
            try {
              const r = k.test === 'test' ? await ask('test') : await ask('testsource', { which: k.test });
              msg.textContent = k.test === 'test' ? 'Connexion à Claude réussie' + (r && r.model ? ' (' + r.model + ')' : '') + '.'
                : (r && r.ok ? 'Connexion réussie.' : 'Le service ne répond pas comme prévu.');
            } catch (e) { msg.textContent = e.message; }
          }
        }, 'Tester') : null,
        has ? el('button', {
          type: 'button', class: 'btn',
          onclick: async () => {
            if (!confirm('Supprimer la clé « ' + k.title + ' » de Mood DJ ? (Elle reste valable sur le site du service tant que tu ne la révoques pas.)')) return;
            await chrome.storage.local.remove(k.name);
            await render();
          }
        }, 'Supprimer la clé') : null),
      el('p', { class: 'muted' }, 'Où la créer : ' + k.site + '. ' + k.help),
      msg);
    box.append(card);
  }
  const focus = decodeURIComponent(location.hash.slice(1));
  const target = focus && document.getElementById('in-' + focus);
  if (target && !render.focused) { render.focused = true; target.scrollIntoView({ block: 'center' }); target.focus(); }
}

render();
