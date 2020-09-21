const mongoose = require('mongoose');

module.exports = (url) => {
  return mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
};
