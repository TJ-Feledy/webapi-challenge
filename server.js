const express = require('express')

const projectRouter = require('./data/projects/projectRouter.js')
const actionRouter = require('./data/actions/actionRouter.js')

const server = express()

server.use(express.json())

server.use('/api/projects', projectRouter, actionRouter)

server.get('/', (req, res) => {
  res.send(`<h2>This is the webapi sprint challenge!</h2><h3>Project endpoints: api/projects, api/projects/:id</h3><h3>Action endpoints: api/projects/:id/actions, api/projects/actions/:id</h3>`)
})

module.exports = server