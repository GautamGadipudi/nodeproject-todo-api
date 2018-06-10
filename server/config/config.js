var env = process.env.NODE_ENV || 'development';

switch(env) {
  case 'development':
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/ToDoApp'
    break;
  case 'test':
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/ToDoAppTest'
    break;
  case 'production':
    process.env.MONGODB_URI = 'mongodb://gautamgadipudi:boom4boom@ds217138.mlab.com:17138/nemesis-todo-api'
    break;
  default:
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/ToDoApp'
}
