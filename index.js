const express = require('express')
const app = express()
var morgan = require('morgan')


app.use(express.json())
app.use(morgan('tiny'));

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

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

app.get('/api/info', async (request, response) => {
    const currentDate = new Date().toUTCString();
    response.set('Date', currentDate); 
    response.send(
        `<p>Phone book has info for ${persons.length} people</p>` +
        `<p>Current Date: ${currentDate}</p>`
    );
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
  
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  
  })

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name is missing' 
      })
    }

    else if (!body.number) {
        return response.status(400).json({ 
          error: 'number is missing' 
        })
      }

    else if (persons.map(person => person.name).includes(body.name)) {
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }
  
    const person = {
      id: Math.floor(Math.random() * (1000 - 3 + 1)) + 3,
      name: body.name,
      number: body.number,
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})