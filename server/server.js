const express = require('express');
const bodyParser = require('body-parser');
const {
  ObjectId
} = require('mongodb');

const {
  mongoose
} = require('./db/mongoose');
const {
  Todo
} = require('./models/todo');
const {
  User
} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({
      todos
    })
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectId.isValid(id))
    return res.status(404).send({
      error: 'id not valid'
    });
  Todo.findById(id).then((todo) => {
    if (todo) {
      res.send({
        todo
      });
    } else {
      res.status(404).send({
        error: 'The Id does not exist'
      })
    }
  }).catch((e) => {
    res.status(400).send();
  })
})

app.listen(port, () => {
  console.log('Listening on port: ' + port);
});

module.exports = {
  app
};
