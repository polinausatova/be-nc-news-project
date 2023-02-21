const express = require('express');
const app = express();

const { getTopics} = require('./newsControllers/newsControllers')

//Ticket 3. GET /api/topics
app.get('/api/topics', getTopics);

app.use((req, res, next) => {
    res.status(404).send({ msg: 'Path not found. Sorry.'});
});

module.exports = app
