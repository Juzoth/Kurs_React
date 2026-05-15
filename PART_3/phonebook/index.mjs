import express from 'express'

const app = express()

// Middleware to parse JSON
app.use(express.json())

const persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
]

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'Name and number are required' })
  }

  const newPerson = {
    id: String(Math.floor(Math.random() * 1000000)),
    name,
    number
  }

  persons.push(newPerson)
  res.status(201).json(newPerson)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = String(req.params.id);
  const index = persons.findIndex(p => p.id === id);
  
  if (index !== -1) {
    persons.splice(index, 1);
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Person not found' });
  }
});

app.get('/api/persons/:id', (req, res) => {
  const id = String(req.params.id);
  const person = persons.find(p => p.id === id);
  
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const currentTime = new Date().toString()
  const count = persons.length
  res.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${currentTime}</p>
  `)
})

app.get('/', (req, res) => {
  res.send(`
    <h1>Phonebook API</h1>
    <h2>Available Endpoints:</h2>
    <ul>
      <li><strong>GET</strong> /api/persons - Get all phonebook entries</li>
      <li><strong>GET</strong> /api/persons/:id - Get a specific person by ID</li>
      <li><strong>POST</strong> /api/persons - Add a new person (requires name and number)</li>
      <li><strong>DELETE</strong> /api/persons/:id - Delete a person by ID</li>
      <li><strong>GET</strong> /info - Get phonebook statistics</li>
    </ul>
  `)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
