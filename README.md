# Mood DJ pour YouTube Music

🇫🇷 Français · [🇬🇧 English](README.en.md)

Extension Chrome qui transforme YouTube Music en radio personnelle : ambiances, courbe d'énergie, fondus enchaînés, égaliseur, et animateurs à la voix de synthèse (annonces, interludes, invités, jeux, dédicaces).

## Installation

1. Télécharge ce dépôt (bouton **Code › Download ZIP**) et décompresse-le.
2. Dans Chrome, ouvre `chrome://extensions` et active le **Mode développeur** (en haut à droite).
3. Clique sur **Charger l'extension non empaquetée** et choisis le dossier **`mood-dj`**.
4. Ouvre [YouTube Music](https://music.youtube.com) : le panneau Mood DJ apparaît.

Après une mise à jour des fichiers : recharge l'extension dans `chrome://extensions`, puis fais F5 sur YouTube Music.

## Clés API (vivement conseillées)

> **Pour profiter pleinement de Mood DJ, les clés API sont vivement conseillées.** C'est avec elles que la radio prend vie : des animateurs qui écrivent de vraies annonces sur chaque titre, des voix naturelles en solo ou en duo, des anecdotes et des dates de concerts. Une clé Gemini gratuite suffit déjà à tout débloquer.

Sans clé, Mood DJ fonctionne quand même, mais en version réduite : catalogue intégré, phrases toutes faites et voix de l'ordinateur.

Les clés se saisissent dans la page sécurisée de l'extension (Réglages › Clés API) :

- **Claude** (Anthropic) ou **Gemini** (Google) : les textes des animateurs, les sélections décrites en toutes lettres, l'ajout de styles.
- **Gemini** : les voix des animateurs, en solo ou en duo. Clé gratuite sur [aistudio.google.com](https://aistudio.google.com) (bouton « Get API key »). Seule, la clé gratuite permet d'essayer chaque jour : elle a une limite, qui se recharge toutes les 24 heures. Avec une clé payante en plus, les deux se relaient pour une écoute prolongée : la gratuite passe toujours en premier, la payante prend le relais sans rien interrompre.
- **Last.fm, Discogs, Setlist.fm** : des anecdotes en plus. Les prochaines dates de concert viennent d'une recherche Google faite par Gemini (réglage « Prochains concerts », sans autre clé).

Avec une clé Claude ou Gemini, chaque animateur a sa personnalité et se souvient de ce qu'il raconte d'une émission à l'autre. Le réglage **Puissance de l'IA** (Économe, Normale ou Pleine puissance) et un plafond d'appels par heure permettent de choisir entre des animateurs plus vivants et une consommation plus faible.

Les clés restent dans le navigateur et ne sont envoyées qu'à leur service.

## Documentation

- [`mood-dj/LISEZMOI.txt`](mood-dj/LISEZMOI.txt) : toutes les fonctions, version par version.
- [`mood-dj/legal.html`](mood-dj/legal.html) : mentions légales, confidentialité, sources et crédits.
- En anglais : [`mood-dj/GUIDE-EN.md`](mood-dj/GUIDE-EN.md) (guide par fonction) et [`mood-dj/legal.en.html`](mood-dj/legal.en.html) (mentions légales).

À chaque envoi sur GitHub, des contrôles automatiques (onglet **Actions**) vérifient que la traduction anglaise suit (textes de l'interface, mentions légales, guide) et font tourner les tests. À la main : `node tools/check-i18n.js` et `node --test tests/*.test.js`.

## Licence

© 2026 Breizhad. Tous droits réservés. Usage privé : la copie, la modification ou la diffusion ne sont pas autorisées sans l'accord de l'éditeur.

Projet indépendant, sans lien avec YouTube, Google ou Anthropic.
