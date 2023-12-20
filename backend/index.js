const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('post-data', function (req) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body); 
  }
  return ''; 
});

app.use((req, res, next) => {
  if (req.method === 'POST') {
    morgan(':method :url :status :res[content-length] - :response-time ms :post-data')(req, res, next);
  } else {
    morgan('tiny')(req, res, next);
  }
});
 
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
  Person.find({}) .then(persons => {
      response.json(persons);
    })
    .catch(error => {
      response.status(500).json({ error: error.message });
    });
});


app.get('/api/info', async (request, response) => {
    const currentDate = new Date().toUTCString();
    response.set('Date', currentDate); 
    response.send(
        `<p>Phone book has info for ${persons.length} people</p>` +
        `<p>Current Date: ${currentDate}</p>`
    );
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  Person = Person.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
      return response.status(400).json({ error: 'Name or number is missing' });
  }

  Person.findOne({ name: body.name })
      .then((person) => {
          if (person) {
              return response.status(400).json({ error: 'Name must be unique' });
          }

          const newPerson = new Person({
              name: body.name,
              number: body.number,
          });

          return newPerson.save();
      })
      .then((savedPerson) => {
          response.json(savedPerson);
      })
      .catch((error) => {
          response.status(500).json({ error: error.message });
      });
});


  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })