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
  text: 'Test todo 2'
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

  it('should return 404 if id not found', (done) => {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);
  });

  it('should return 404 if id is not valid', (done) => {
    request(app)
      .get(`/todos/${new ObjectId().toHexString()}`)
      .expect(404)
      .end(done);
  });
});
