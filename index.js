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

  app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person) 
    })
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = Person.findByIdAndRemove(id).then(result => {
      response.status(204).end()
    })
  
  })
  
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
    
    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
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