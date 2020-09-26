const mongoose = require('mongoose');

const historySchema = mongoose.Schema({
  name: String,
  url: String,
  trigger: String,
  target: String,
  properties: [
    {
      name: String,
      selector: String,
      source: String
    }
  ]
});

const historyModel = new mongoose.model('history', historySchema);

exports.getHistory = async () => {
  return await historyModel.find({});
};

exports.createRecord = async (record) => {
  await historyModel.create(record);
};
