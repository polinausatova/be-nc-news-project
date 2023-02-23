const express = require('express');
const app = express();

const {
    handlePSQL400s,
    handleCustomErrors,
} = require('./newsControllers/errorHandlingControllers');

const { getTopics, getComments} = require('./newsControllers/newsControllers')

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id/comments', getComments);

app.use((req, res, next) => {
    res.status(404).send({ msg: "Path Not Found"});
});

app.use(handlePSQL400s);
app.use(handleCustomErrors);

app.use((error, req, res, next) => {
    console.log(error);
});

module.exports = app
