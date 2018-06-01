const mongoose = require('mongoose');

const {
  mongodbConnectionUrl
} = require('./../../util/constants');

mongoose.Promise = global.Promise;
mongoose.connect(mongodbConnectionUrl);

module.exports = {
  mongoose
};
