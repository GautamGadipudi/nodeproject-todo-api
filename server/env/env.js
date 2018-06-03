const yargs = require('yargs');
var env = {};
const localEnvironment = require('./local').env;
const herokuEnvironment = require('./heroku').env;

switch (yargs.argv.environment) {
  case 'local':
    env = localEnvironment;
    break;
  case 'heroku':
    env = herokuEnvironment;
    break;
  default:
    env = localEnvironment;
}

module.exports = {env};
