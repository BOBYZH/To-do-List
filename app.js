const express = require('express')
const app = express()
const mongoose = require('mongoose')

const exphbs = require('express-handlebars')

app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection // 已連線的資料庫

db.on('error', () => { // on可觸發多次
  console.log('mongodb error!')
})

db.once('open', () => { // once只觸發一次
  console.log('mongodb connected!')
})

const Todo = require('./models/todo')

app.get('/', (req, res) => {
  Todo.find((err, todos) => {
    if (err) return console.log(err)
    return res.render('index', { todos: todos })
  })
})

app.get('/todos', (req, res) => {
  return res.redirect('/')
})

app.get('/todos/new', (req, res) => {
  return res.render('new')
})

app.get('/todos/:id', (req, res) => {
  res.send('Display the detail of Todo.')
})

app.post('/todos', (req, res) => {
  const todo = new Todo({
    name: req.body.name
  })

  todo.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})

app.get('/todos/:id/edit', (req, res) => {
  res.send('Page of editing a Todo.')
})

app.post('/todos/:id/edit', (req, res) => {
  res.send('Edit a Todo.')
})

app.post('/todos/:id/delete', (req, res) => {
  res.send('Delete a Todo.')
})

app.listen(3000, () => {
  console.log('App is listening!')
})
