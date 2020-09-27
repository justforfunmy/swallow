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

// eslint-disable-next-line new-cap
const historyModel = new mongoose.model('history', historySchema);

exports.getHistory = async () => {
  const history = await historyModel.find({});
  return history;
};

exports.createRecord = async (record) => {
  await historyModel.create(record);
};
