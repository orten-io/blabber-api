const express = require('express')
const bodyParser = require('body-parser')
const uuid = require('uuid/v4')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())

let blabbers = [
  {
    id: 'd9f91448-6da4-4dfb-bd17-6cbf290f4a3b',
    text: 'If I won the award for laziness, I would send somebody to pick it up for me.',
    votes: 12,
    comments: [
      {
        id: 'c66602de-5da6-4da8-8780-4b688d05c002',
        text: 'Looool',
      }
    ]
  },
  {
    id: 'c850f5fe-6e40-4829-95e3-56f882617783',
    text: 'Don\'t know where your kids are in the house? Turn off the internet and they\'ll show up quickly.',
    votes: -3,
    comments: []
  },
  {
    id: 'eb1c2926-b8cf-40ef-88d6-84a386bfa76e',
    text: 'My bed is a magical place where I suddenly remember everything I forgot to do.',
    votes: 0,
    comments: []
  }
]
const createBlabber = text => {
  const newBlabber = {
    id: uuid(),
    text,
    votes: 0,
    comments: []
  }
  blabbers = [newBlabber, ...blabbers]
  return newBlabber
}
const getBlabberById = id => blabbers.filter(blabber => blabber.id === id)[0] || null
const getCommentsForBlabber = id => getBlabberById(id).comments || []

const addCommentToBlabber = (id, text) => {
  const blabber = getBlabberById(id)
  const comment = {
    id: uuid(),
    text
  }
  blabber.comments = [comment, ...blabber.comments]
  return comment
}


// Handle input json syntax errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    res.statusCode = 400
    res.send({ error: 'INVALID_JSON' })
    return
  }

  next(err)
})

app.get('/blabbers', (req, res) => {
  res.send(blabbers)
})

app.post('/blabbers', ({ body }, res) => {
  if (!body.text) {
    res.statusCode = 400
    res.send({ error: 'TEXT_REQUIRED' })
    return
  }

  if (body.text.length > 600) {
    res.statusCode = 400
    res.send({ error: 'TEXT_MAX_LENGTH_600' })
    return
  }

  const newBlabber = createBlabber(body.text)
  res.statusCode = 201
  res.send(newBlabber)
})

app.get('/blabbers/:id', ({ params: { id } }, res) => {
  const blabber = getBlabberById(id)

  if (blabber) {
    res.send(blabber)
  } else {
    res.statusCode = 404
    res.send()
  }
})

app.get('/blabbers/:id/comments', ({ params: { id } }, res) => {
  const comments = getCommentsForBlabber(id)
  res.send(comments)
})

app.post('/blabbers/:id/comments', ({ params: { id }, body }, res) => {
  if (!body.text) {
    res.statusCode = 400
    res.send({ error: 'TEXT_REQUIRED' })
    return
  }

  if (body.text.length > 600) {
    res.statusCode = 400
    res.send({ error: 'TEXT_MAX_LENGTH_600' })
    return
  }

  const comment = addCommentToBlabber(id, body.text)
  res.statusCode = 201
  res.send(comment)
})

app.post('/blabbers/:id/votes', ({ params: { id } }, res) => {
  const blabber = getBlabberById(id)

  if (!blabber) {
    res.statusCode = 404
    res.send()
    return
  }

  blabber.votes += 1

  res.send(blabber)
})

app.delete('/blabbers/:id/votes', ({ params: { id } }, res) => {
  const blabber = getBlabberById(id)

  if (!blabber) {
    res.statusCode = 404
    res.send()
    return
  }

  blabber.votes -= 1

  res.send(blabber)
})


// 404 endpoint
app.use('*', (req, res) => {
  res.statusCode = 404
  res.send();
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
