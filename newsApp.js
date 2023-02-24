const express = require('express');
const app = express();

const {
handle400s,
handle404s
} = require('./newsControllers/errorHandlingControllers');

const { 
    getTopics, 
    getArticles, 
    getArticleById, 
    getComments, 
    postComment, 
    patchArticleById,
    getUsers
} = require('./newsControllers/newsControllers')

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);
//10. GET /api/articles (queries)
//FEATURE REQUEST
// The end point should also accept the following queries:
// topic, which filters the articles by the topic value specified in the query. If the query is omitted the endpoint should respond with all articles.
// sort_by, which sorts the articles by any valid column (defaults to date)
// order, which can be set to asc or desc for ascending or descending (defaults to descending)

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/:article_id/comments', getComments);

app.post('/api/articles/:article_id/comments', postComment);

app.patch('/api/articles/:article_id', patchArticleById);

app.get('/api/users', getUsers);

app.use((req, res, next) => {
    res.status(404).send({ msg: 'Path Not Found'});
});

app.use(handle404s);
app.use(handle400s);

app.use((error, req, res, next) => {
    console.log(error);
});

module.exports = app
