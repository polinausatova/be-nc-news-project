const express = require('express');
const app = express();

const {
    handle400s,
    handle404s,
} = require('./newsControllers/errorHandlingControllers');


const { getTopics, getArticles, postComment} = require('./newsControllers/newsControllers')

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.use(express.json());

app.post('/api/articles/:article_id/comments', postComment);

app.use((req, res, next) => {
    res.status(404).send({ msg: 'Path Not Found'});
});

app.use(handle404s);
app.use(handle400s);

app.use((error, req, res, next) => {
    console.log(error);
});

module.exports = app
