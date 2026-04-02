# Redis Caching API (Node.js)

Petite API Express qui récupère le nombre de repositories publics GitHub d’un utilisateur et met en cache le résultat dans Redis pour accélérer les requêtes suivantes.

## Fonctionnalités

- Endpoint HTTP: `GET /repos/:username`
- Récupération des données via l’API GitHub
- Mise en cache Redis avec expiration (`TTL`) de 1 heure
- Affichage simple du résultat en HTML
- Logs de `cache hit` / `cache miss`

## Stack technique

- Node.js
- Express
- Redis (client `redis` v5)
- node-fetch
- nodemon (développement)

## Prérequis

- Node.js 18+
- Redis installé et démarré en local (port par défaut: `6379`)

## Installation

```bash
npm install
```

## Lancer le projet

Mode développement (avec reload automatique):

```bash
npm run dev
```

Mode standard:

```bash
npm start
```

Par défaut, le serveur démarre sur le port `5000`.

## Variables d’environnement

- `PORT`: port HTTP de l’application (défaut: `5000`)
- `REDIS_PORT`: port Redis (défaut: `6379`)

Exemple (PowerShell):

```powershell
$env:PORT=5000
$env:REDIS_PORT=6379
npm start
```

## Utilisation

Requête type:

```bash
curl http://localhost:5000/repos/octocat
```

Réponse (HTML):

```html
<h2>octocat has 8 Github repos</h2>
```

## Comportement du cache

- Première requête pour un `username`: `Cache Miss` puis appel GitHub
- Requêtes suivantes pendant 1 heure: `Cache Hit` (réponse depuis Redis)

## Scripts npm

- `npm start`: lance `node index.js`
- `npm run dev`: lance `nodemon index.js`

## Structure du projet

```text
.
├─ index.js
├─ package.json
└─ README.md
```

## Améliorations possibles

- Ajouter une gestion des erreurs GitHub plus détaillée (utilisateur introuvable, rate limit)
- Ajouter des tests API
- Dockeriser l’application avec Redis
