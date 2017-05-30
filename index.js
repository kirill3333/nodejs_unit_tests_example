const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

// Configs
// I really use 'dotenv' package to set config based on environment.
// removed and defaults put in place for brevity
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// Database
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/todosapi')

//Middleware
app.set('port', 3003)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Routers
const todosRouter = require('./todo/routes')
app.use('/todos', todosRouter)

app.listen(app.get('port'), function () {
  console.log('App now running on http://localhost:' + app.get('port'))
});

module.exports = app