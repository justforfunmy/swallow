const mongoose = require('mongoose');

module.exports = (name, params) => {
  const result = {};
  Object.keys(params).forEach((key) => {
    result[key] = { type: String, required: false };
  });
  return mongoose.model(name, result);
};
