<div align="center">
 <h1>Movie Search PGvector</h1>
 <h2>A semantic movie search engine<h2>
</div>

## :books: About the project:

This is a simple node.js project created to learn a little about semantic search, using a Euclidean distance 
strategy.

## :hammer_and_wrench: The technologies:

- Node.js;
- TensorFlow;
- PostgresSQL;
- PGvector;


## :play_or_pause_button: Running the project:

1. Clone said repository by running the following command in the git bash terminal:
```sh
   git clone https://github.com/IriedsonSouto/movie-search-pgvector.git
```

2. In the terminal, run the following command to download the dependencies:
```sh
   npm install
```

3. Configure a dotenv file in the root folder with your Postgres settings, as per example.env
Or if you want to use Docker, run the following command:
```sh
   docker-compose up
```

4. In your database, execute the commands below:
```sh
   CREATE EXTENSION vector;
```
```sh
   CREATE TABLE movie_plots (
    title VARCHAR,
    director VARCHAR,
    "cast" VARCHAR,
    genre VARCHAR,
    plot TEXT,
    "year" SMALLINT,
    wiki VARCHAR,
    embedding vector(512)
);
```
5. To finish, access the src folder and run the command below to feed the database:
```sh
   node encoder.js
```
And to perform a search, use the following command:
```sh
   node recommender.js
```

## :pushpin: ATTENTION:

You can change the search input in the recommender file.

In the encoder file, you can choose the number of films that will be saved in the bank and the number of files per batch.
