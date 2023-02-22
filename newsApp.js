const express = require('express');
const app = express();

const { getTopics, getArticles} = require('./newsControllers/newsControllers')

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.use((req, res, next) => {
    res.status(404).send({ msg: 'Path not found. Sorry.'});
});

module.exports = app
