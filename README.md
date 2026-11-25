# Mood DJ pour YouTube Music

Extension Chrome qui transforme YouTube Music en radio personnelle : ambiances, courbe d'énergie, fondus enchaînés, égaliseur, et animateurs à la voix de synthèse (annonces, interludes, invités, jeux, dédicaces).

## Installation

1. Télécharge ce dépôt (bouton **Code › Download ZIP**) et décompresse-le.
2. Dans Chrome, ouvre `chrome://extensions` et active le **Mode développeur** (en haut à droite).
3. Clique sur **Charger l'extension non empaquetée** et choisis le dossier **`mood-dj`**.
4. Ouvre [YouTube Music](https://music.youtube.com) : le panneau Mood DJ apparaît.

Après une mise à jour des fichiers : recharge l'extension dans `chrome://extensions`, puis fais F5 sur YouTube Music.

## Clés API (facultatives)

Sans clé, Mood DJ fonctionne avec son catalogue intégré, des phrases toutes faites et la voix de l'ordinateur. Les clés se saisissent dans la page sécurisée de l'extension (Réglages › Clés API) :

- **Claude** (Anthropic) ou **Gemini** (Google) : les textes des animateurs, les sélections décrites en toutes lettres, l'ajout de styles.
- **Gemini** : les voix des animateurs, en solo ou en duo.
- **Last.fm, Discogs, Setlist.fm, Ticketmaster** : des anecdotes et des dates de concerts en plus.

Les clés restent dans le navigateur et ne sont envoyées qu'à leur service.

## Documentation

- [`mood-dj/LISEZMOI.txt`](mood-dj/LISEZMOI.txt) : toutes les fonctions, version par version.
- [`mood-dj/legal.html`](mood-dj/legal.html) : mentions légales, confidentialité, sources et crédits.

## Licence

© 2026 Breizhad. Tous droits réservés. Usage privé : la copie, la modification ou la diffusion ne sont pas autorisées sans l'accord de l'éditeur.

Projet indépendant, sans lien avec YouTube, Google ou Anthropic.
