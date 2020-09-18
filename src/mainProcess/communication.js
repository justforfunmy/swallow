const { ipcMain, dialog } = require('electron');
const crawl = require('./crawl');

ipcMain.on('start-crawl', (event, args) => {
  crawl(event, args);
});

ipcMain.on('choose-output', (event, args) => {
  const result = dialog.showOpenDialogSync({ properties: ['openDirectory'] });
  if (result) {
    event.reply('output-selected', result[0]);
  }
});
