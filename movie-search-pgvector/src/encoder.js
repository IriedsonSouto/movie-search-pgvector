require('dotenv').config({ path: '../../.env' });
require('@tensorflow/tfjs-node');

const fs = require("fs");
const use = require('@tensorflow-models/universal-sentence-encoder');
const moviePlots = require("./util/movie-plots.json").slice(0);
const pgp = require('pg-promise')({
    capSQL: true 
});

const client = pgp(config = {
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE
});

const storeInPG = (moviePlots) => {
    const columns = new pgp.helpers.ColumnSet(['title', 'director', 'plot', 'year', 'wiki', 'cast', 'genre', 'embedding'], {table: 'movie_plots'});

    const values = [];
    for (let i = 0; i < moviePlots.length; i++) {
        values.push({
            title: moviePlots[i]['Title'],
            director: moviePlots[i]['Director'],
            plot: moviePlots[i]['Plot'],
            year: moviePlots[i]['Release Year'],
            cast: moviePlots[i]['Cast'],
            genre: moviePlots[i]['Genre'],
            wiki: moviePlots[i]['Wiki Page'],
            embedding: `[${moviePlots[i]['embedding']}]`
        })
    }

    const query = pgp.helpers.insert(values, columns);

    client.none(query).then(res => console.log("Successfully inserted"));
}

use.load().then(async model => {
    const batchSize = 1000;
    for (let start = 0; start < moviePlots.length; start += batchSize) {
        const end = Math.min(start + batchSize, moviePlots.length);

        console.log(`Processing starting from ${start} with the step ${batchSize} of total amount ${moviePlots.length}.`);

        const plotDescriptions = moviePlots.slice(start, end).map(moviePlot => moviePlot.Plot);
        const embeddings = await model.embed(plotDescriptions);
        for (let i = start; i < end; i++) {
            moviePlots[i]['embedding'] = embeddings.arraySync()[i - start];
        }
    }

    storeInPG(moviePlots)
});