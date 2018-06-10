const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {
  app
} = require('./../server');
const {
  Todo
} = require('./../models/todo');

testTodos = [{
  _id: new ObjectId(),
  text: 'Test todo 1'
}, {
  _id: new ObjectId(),
  text: 'Test todo 2',
  completed: true,
  completedAt: 333
}]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(testTodos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'SOmething to do';
    request(app)
      .post('/todos')
      .send({
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });

  it('should not create a todo with invalid request', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${testTodos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(testTodos[0].text);
      })
      .end(done);
  });

  it('should return 404 if id not valid', (done) => {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);
  });

  it('should return 404 if id is not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectId().toHexString()}`)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete a todo', (done) => {
    request(app)
      .delete(`/todos/${testTodos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(testTodos[0].text);
      })
      .end((err, res) => {
        if (err)
          return done(err);
        Todo.find().then((res) => {
          expect(res.length).toBe(1);
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });

  it('should return 404 if id not valid', (done) => {
    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done);
  });

  it('should return 404 if id is not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectId().toHexString()}`)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    var updateTodo = {text: 'Updated todo 1', completed: true}
    request(app)
      .patch(`/todos/${testTodos[0]._id.toHexString()}`)
      .send(updateTodo)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(updateTodo.text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not complete', (done) => {
    var updateTodo = {text: 'Updated todo 2', completed: false}
    request(app)
      .patch(`/todos/${testTodos[1]._id.toHexString()}`)
      .send({text: "Updated todo 2", completed: false})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(updateTodo.text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });

  it('should return 404 if id is not valid', (done) => {
    request(app)
      .patch('/todos/123abc')
      .expect(404)
      .end(done);
  });

  it('should return 404 if id is not found', (done) => {
    request(app)
      .patch(`/todos/${new ObjectId().toHexString()}`)
      .expect(404)
      .end(done);
  });
});
