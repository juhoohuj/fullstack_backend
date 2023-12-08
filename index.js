require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan('tiny'), morgan(':body'))





  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
      res.json(persons)
    })
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)
  
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
  }
  app.use(errorHandler)

  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
      response.json(person) 
    })
    .catch(error => next(error))
  })



  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })
  
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log('Request Body:', body);
    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({ error: 'name or number missing' })
    }
    
    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const id = request.params.id
  
    const person = {
      name: body.name,
      number: body.number,
    }

    Person.findByIdAndUpdate(id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))

  })

  app.get('/info', (req, res) => {
     Person.find({}).then(persons => {
      res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
    })
  })

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })