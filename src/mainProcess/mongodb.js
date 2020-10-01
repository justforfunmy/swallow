const mongoose = require('mongoose');
const connect = require('../mongodb/connect');

const getCollectionNames = async () => {
  const cols = await mongoose.connection.db.collections();
  const colStrArr = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const c of cols) {
    colStrArr.push(c.s.namespace.collection);
  }
  return colStrArr;
};

connect('mongodb://localhost:27017/swallow');
const db = mongoose.connection;
db.on('error', (error) => {
  console.error(`connection error:${error}`);
});
db.once('open', async () => {
  console.log('mongo server starting');
  const cols = await getCollectionNames();
  console.log(cols);
});
