const mongoose = require('mongoose');

const modelsMap = {};

module.exports = (name, params) => {
  if (modelsMap[name]) {
    return modelsMap[name];
  }
  const result = {};
  Object.keys(params).forEach((key) => {
    result[key] = { type: String, required: false };
  });
  const schema = new mongoose.Schema(result);
  const nameModel = mongoose.model(name, schema);
  modelsMap[name] = nameModel;
  return nameModel;
};
