const { request, response } = require('express')
const express = require('express')
const morgan = require ('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

morgan.token('added',(req) => JSON.stringify(req.body))

app.use(morgan(' :added :method :url :status :res[content-length] - :response-time ms'))


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


  app.get('/info', (request, response) =>{
 
    
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p> 
       Lappeenranta ${new Date().toUTCString()}`
    )
  })
  app.get('/api/persons',(request, response) => {
    response.json(persons)
  })

  app.get('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    console.log({id})
    const person = persons.find(person => person.id === id)
    response.json(person)
  })

  app.delete('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  })

  app.post('/api/persons', (request, response) =>{
    const person = request.body

    const ids = persons.map(person => person.id)
    const maxId = Math.floor(Math.random(ids) * 1000)

    const newPerson = {
      id: maxId + 1,
      name: person.name, 
      number: person.number
    }
    if (!newPerson.name || !newPerson.number){
      return response.status(400).json({error:'name or number is not submitted'})
    }

    if(persons.find((person)=>person.name===newPerson.name)){
      return response.status(400).json({error: 'name already exists'})
    }



    persons = persons.concat(newPerson)

    response.json(newPerson)  

   
    

  })

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)