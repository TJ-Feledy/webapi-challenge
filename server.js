const express = require('express')

const projectRouter = require('./data/projects/projectRouter.js')

const server = express()

server.use(express.json())

server.use('/api/projects', projectRouter)

server.get('/', (req, res) => {
  res.send(`<h2>This is the webapi sprint challenge!</h2>`)
})

module.exports = server