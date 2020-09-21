const connect = require('../mongodb/connect');
const { ipcMain } = require('electron');
const mongoose = require('mongoose');

connect('mongodb://localhost:27017/swallow');
const db = mongoose.connection;
db.on('error', (error) => {
  console.error(`connection error:${error}`);
});
db.once('open', () => {
  console.log('mongo server starting');
});
