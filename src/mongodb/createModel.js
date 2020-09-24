const mongoose = require('mongoose');

const getCollectionNames = async () => {
  const cols = await mongoose.connection.db.collections();
  let colStrArr = [];
  for (let c of cols) {
    colStrArr.push(c.s.namespace.collection);
  }
  return colStrArr;
};

const isCollectionExit = async (name) => {
  name = name.toLowerCase();
  const cols = await getCollectionNames();
  if (
    cols.indexOf(name) !== -1 ||
    cols.indexOf(`${name}s`) !== -1 ||
    cols.indexOf(`${name}es`) !== -1
  ) {
    return true;
  }
  return false;
};

module.exports = async (name, params) => {
  if (await isCollectionExit(name)) {
    return null;
  }
  const result = {};
  params.forEach((item) => {
    const key = item.name;
    result[key] = { type: String, required: false };
  });
  const schema = new mongoose.Schema(result);
  const nameModel = mongoose.model(name, schema);
  return nameModel;
};
