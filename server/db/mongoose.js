const mongoose = require('mongoose');

const {
  env
} = require('./../env/env');

mongoose.Promise = global.Promise;
mongoose.connect(env.mongodbUri);

module.exports = {
  mongoose
};
