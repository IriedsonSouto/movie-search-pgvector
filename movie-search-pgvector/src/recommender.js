require('dotenv').config({ path: '../../.env' });
require('@tensorflow/tfjs-node');

const fs = require("fs");
const use = require('@tensorflow-models/universal-sentence-encoder');
const pg = require('pg');

const client = new pg.Client(config = {
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE
});


use.load().then(async model => {
    const embeddings = await model.embed("soccer flamengo");
    const embeddingArray = embeddings.arraySync()[0];

    await client.connect();

    try {
        const pgResponse = await client.query(`SELECT * FROM movie_plots ORDER BY embedding <-> '${JSON.stringify(embeddingArray)}' LIMIT 5;`);
        console.log(pgResponse.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end()
    }
});