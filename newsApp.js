const express = require('express');
const app = express();

const {
    handle500Statuses,
    handlePSQL400s,
    handleCustomErrors,
} = require('./newsControllers/errorHandlingControllers');

app.use(express.json());

const { getTopics } = require('./newsControllers/newsControllers')

app.get('/api/topics', getTopics);


app.use(handlePSQL400s);
app.use(handleCustomErrors);
app.use(handle500Statuses);


module.exports = app
