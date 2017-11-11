const express = require('express')
const bodyParser = require('body-parser')
const uuid = require('uuid/v4')

const app = express()
app.use(bodyParser.json())

const blabbers = [
  {
    id: 'd9f91448-6da4-4dfb-bd17-6cbf290f4a3b',
    text: 'blabber blabber',
    comments: []
  }
]
const createBlabber = text => {
  const newBlabber = {
    id: uuid(),
    text,
    comments: []
  }
  blabbers.push(newBlabber)
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
  blabber.comments.push(comment)
  return comment
}



app.get('/blabbers', (req, res) => {
  res.send(blabbers)
})

app.post('/blabbers', ({ body }, res) => {
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
  const comment = addCommentToBlabber(id, body.text)
  res.statusCode = 201
  res.send(comment)
})


const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('Example app listening on port 3000!')
})