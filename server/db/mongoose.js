const mongoose = require('mongoose');

const {
  mongodbRemoteConnectionUrl
} = require('./../../util/constants');

mongoose.Promise = global.Promise;
mongoose.connect(mongodbRemoteConnectionUrl);

module.exports = {
  mongoose
};
