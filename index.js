// import http from 'http';
const express = require('express')
const cors = require('cors')
const app = express()

// Notice that json-parser is taken into use
// before the other middleware
app.use(express.json())
app.use(cors())

// Middleware BEFORE routes
const requestLogger = (request, response, next) => {
  console.log('Method: ', request.method)
  console.log('Path: ', request.path)
  console.log('Body: ', request.body)
  console.log('------------------------------')
  next()
}

app.use(requestLogger)

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true
  }
]

const generateNoteId = () => {
  const maxIdNumber = notes.length > 0
    ? Math.max(...notes.map(note => note.id))
    : 0
  return maxIdNumber + 1
}

app.get('/', (request, response) => {
  response.send('<h1>Hello, World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (!note) {
    return response.status(404).json({
      error: 'No note is found'
    }).end()
  }
  response.json(note)
})

// Precisa testar
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  return response.status(204).json({
    message: 'Note deleted'
  }).end()
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'Content missing'
    })
  }

  const note = {
    id: generateNoteId(),
    content: body.content,
    date: new Date(),
    important: body.important || false,
  }

  notes = notes.concat(note)
  response.json(note)
})

// Middleware AFTER routes
const unknowEndpoint = (request, response) => {
  response.status(404).json({
    error: 'Endpoint not found!'
  })
}

app.use(unknowEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})