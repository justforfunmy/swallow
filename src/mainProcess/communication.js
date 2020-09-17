const { ipcMain } = require('electron');
const crawl = require('./crawl');

ipcMain.on('start-crawl', (event, args) => {
  crawl(event, args);
});
