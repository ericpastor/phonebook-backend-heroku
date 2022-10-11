require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()
app.use(express.static('build'))

app.use(cors())

app.use(express.json())

morgan.token('added', (req) => JSON.stringify(req.body))

app.use(morgan(' :added :method :url :status :res[content-length] - :response-time ms'))

app.get('/info', (request, response, next) => {
  Person.find({}).then(persons => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p> 
       Lappeenranta ${new Date().toUTCString()}`
    )
  })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }
    }
    )
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // const ids = persons.map(person => person.id)
  // const maxId = Math.floor(Math.random(ids) * 1000)

  if (!body.name) {
    return response.status(400).json({ error: 'name is not submitted' })
  }
  if (!body.number) {
    return response.status(400).json({ error: 'number is not submitted' })
  }
  const person = new Person({
    //  id: maxId + 1,
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
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
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
