const express = require('express');
const app = express();

const {
    handlePSQL400s,
    handleCustomErrors,
} = require('./newsControllers/errorHandlingControllers');


const { getTopics, getArticleById} = require('./newsControllers/newsControllers')

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.use((req, res, next) => {
    res.status(404).send({ msg: 'Path Not Found'});
});

app.use(handlePSQL400s);
app.use(handleCustomErrors);

module.exports = app
