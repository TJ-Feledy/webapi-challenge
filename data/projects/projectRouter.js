const express = require('express')

const Projects = require('../helpers/projectModel.js')

const router = express.Router()

router.post('/', validateProject, (req, res) => {
  Projects.insert(req.body)
    .then(project => {
      res.status(200).json(project)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ errorMessage: 'Error adding project' })
    })
})

router.get('/', (req, res) => {
  Projects.get()
    .then(projects => {
      res.status(200).json(projects)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ errorMessage: 'Error getting projects' })
    })
})

router.get('/:id', validateProjectId, (req, res) => {
  res.status(200).json(req.project)
})

router.get('/:id/actions', validateProjectId, (req, res) => {  
  Projects.getProjectActions(req.project.id)
    .then(actions => {
      res.status(200).json(actions)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ errorMessage: 'Error getting project actions' })
    })
})

router.delete('/:id', validateProjectId, (req, res) => {
  const {id} = req.params

  Projects.remove(id)
    .then(project => {
      if (project === 0) {
        res.status(404).json({ message: 'Project ID is invalid.' })
      }else {
        res.status(200).json(project)
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ errorMessage: 'Could not remove the project.' })
    })
})

router.put('/:id', validateProjectId, validateProject, (req, res) => {
  Projects.update(req.params.id, req.body)
    .then(project => {
      res.status(200).json(project)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ errorMessage: 'Could not update the project.' })
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

function validateProject(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: 'missing project data' })
  }
  else if (!req.body.name || req.body.name.split('').length === 0 || req.body.description.split('').length === 0) {
    res.status(400).json({ message: 'missing required name and/or description' })
  } else {
    next()
  }
}


module.exports = router