const express = require('express')
const app = express()

const { getTopics } = require('./newsControllers/newsControllers')

app.get('/api/topics', getTopics);


module.exports = app
