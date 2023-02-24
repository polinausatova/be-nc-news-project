const express = require('express');
const app = express();

const {
    handle400s,
    handle404s,
} = require('./newsControllers/errorHandlingControllers');


const { getTopics, getArticles, getArticleById, patchArticleById} = require('./newsControllers/newsControllers')

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.patch('/api/articles/:article_id', patchArticleById);


app.use((req, res, next) => {
    res.status(404).send({ msg: 'Path Not Found'});
});

app.use(handle400s);
app.use(handle404s);

app.use((error, req, res, next) => {
    console.log(error);
});

module.exports = app
