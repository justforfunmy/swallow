const mongoose = require('mongoose');
const { dialog } = require('electron');

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
    await dialog.showMessageBox({ title: 'Error', message: '数据库集合名已存在' });
    return null;
  }
  const result = {};
  Object.keys(params).forEach((key) => {
    result[key] = { type: String, required: false };
  });
  const schema = new mongoose.Schema(result);
  const nameModel = mongoose.model(name, schema);
  return nameModel;
};
