const express = require('express');
const app = express();

const {
//check error code for single quotation marks in json and add relevant erron handling
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
