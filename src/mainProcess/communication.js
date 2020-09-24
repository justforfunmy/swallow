const { ipcMain, dialog } = require('electron');
const crawl = require('./crawl');
const { getHistory } = require('../mongodb/history');

ipcMain.on('start-crawl', (event, formData) => {
  console.log(formData);
  crawl(event, formData);
});

ipcMain.on('choose-output', (event, args) => {
  const result = dialog.showOpenDialogSync({ properties: ['openDirectory'] });
  if (result) {
    event.reply('output-selected', result[0]);
  }
});

ipcMain.on('get-history', async (event) => {
  const result = await getHistory();
  console.log(result);
  event.reply('history-response', JSON.stringify(result));
});
