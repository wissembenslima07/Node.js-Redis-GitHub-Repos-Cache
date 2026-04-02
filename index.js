require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const redis = require('redis');

const PORT = process.env.PORT || 3000;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient({
    url: `redis://localhost:${REDIS_PORT}`
});

// Gestion des erreurs Redis
client.on('error', (err) => console.log('Redis Client Error', err));

// Connexion à Redis
(async () => {
    await client.connect();
    console.log('Connected to Redis');
})();

const app = express();

// Set response
function setResponse(username, repos) {
    return `<h2>${username} has ${repos} Github repos</h2>`;
}

// Get repos
async function getRepos(req, res) {
    try {
        console.log('Fetching data...');
        console.time('fetching data');

        const { username } = req.params;

        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
        const repos = data.public_repos;

        // Sauvegarde dans Redis pour 1 heure
        await client.set(username, repos.toString(), {
            EX: 3600
        });

        console.timeEnd('fetching data');
        res.send(setResponse(username, repos));

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

// Middleware de Cache
async function cache(req, res, next) {
    try {
        const { username } = req.params;

        // Cherche dans Redis
        const data = await client.get(username);

        // Cache Hit
        if (data !== null) {
            console.log(`✅ Cache hit pour ${username}`);
            res.send(setResponse(username, data));
            return;   // Important : on arrête ici
        }

        // Cache Miss
        console.log(`❌ Cache miss pour ${username}`);
        next();   // On passe à getRepos

    } catch (err) {
        console.error('Erreur dans le middleware cache:', err);
        next();   // En cas d'erreur, on continue quand même
    }
}

// Route
app.get('/repos/:username', cache, getRepos);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});