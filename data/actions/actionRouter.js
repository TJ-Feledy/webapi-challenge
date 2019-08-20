const express = require('express')

const Actions = require('../helpers/actionModel.js')
const Projects = require('../helpers/projectModel.js')

const router = express.Router()

router.post('/:id/actions', validateProjectId, validateAction, (req, res) => {
  const actionBody = { ...req.body, project_id: req.project.id }

  Actions.insert(actionBody)
    .then(action => {
      res.status(200).json(action)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ errorMessage: 'Error adding Action' })
    })
})

router.get('/actions/:id', validateActionId, (req, res) => {
  res.status(200).json(req.action)
})

router.delete('/actions/:id', validateActionId, (req, res) => {
  const { id } = req.params

  Actions.remove(id)
    .then(action => {
      if (action === 0) {
        res.status(404).json({ message: 'Action ID is invalid.' })
      } else {
        res.status(200).json(action)
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ errorMessage: 'Could not remove the Action.' })
    })
})

router.put('/actions/:id', validateActionId, validateAction, (req, res) => {
  Actions.update(req.params.id, req.body)
    .then(action => {
      res.status(200).json(action)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ errorMessage: 'Could not update the Action.' })
    })
})

// -------Custom Middleware------

function validateProjectId(req, res, next) {
  const id = req.params.id

  Projects.get(id)
    .then(project => {
      if (project) {
        req.project = project
        next()
      } else {
        res.status(400).json({ message: 'invalid project id' })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ errorMessage: 'Error finding project' })
    })
};

function validateActionId(req, res, next) {
  const id = req.params.id

  Actions.get(id)
    .then(action => {
      if (action) {
        req.action = action
        next()
      } else {
        res.status(400).json({ message: 'invalid Action id' })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ errorMessage: 'Error finding Action' })
    })
};

function validateAction(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: 'missing Action data' })
  }
  else if (req.body.description.split('').length === 0) {
    res.status(400).json({ message: 'missing required project_id and/or description' })
  } else {
    next()
  }
}


module.exports = router