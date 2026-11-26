# Tests de Mood DJ

Lancer tous les tests (Node 20 ou plus, aucune installation nécessaire) :

```
node --test tests/*.test.js
```

- `background.test.js` : consignes envoyées à l'IA (partie en cache, taille, puissance), lignes cachées jamais lues, réglages par modèle Claude, garde-fou de dépenses, choix des animateurs.
- `api.test.js` : réponses structurées (Claude et Gemini), nouvel essai si Claude est surchargé, consommation du jour, choix des animateurs (énergie visée, choix zappés).
- `core.test.js` : rapprochement avec YouTube Music (version studio préférée), liste noire, choix des titres.
- `templates.test.js` : phrases toutes faites en anglais.
- `split.test.js` : les fichiers du panneau (mdj-*.js, content.js) se chargent dans l'ordre du manifest sans erreur.

Aucun test n'appelle vraiment une API : l'IA et le réseau sont simulés. Les tests tournent aussi sur GitHub à chaque envoi (onglet Actions, « Tests »).
