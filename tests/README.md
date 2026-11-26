# Tests de Mood DJ

Lancer tous les tests (Node 20 ou plus, aucune installation nécessaire) :

```
node --test tests/*.test.js
```

- `background.test.js` : consignes envoyées à l'IA (partie en cache, taille, puissance), lignes cachées jamais lues, réglages par modèle Claude, garde-fou de dépenses, choix des animateurs.
- `core.test.js` : rapprochement avec YouTube Music (version studio préférée), liste noire, choix des titres.
- `templates.test.js` : phrases toutes faites en anglais.

Aucun test n'appelle vraiment une API : l'IA et le réseau sont simulés. Les tests tournent aussi sur GitHub à chaque envoi (onglet Actions, « Tests »).
