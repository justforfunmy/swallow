const { ipcMain, dialog } = require('electron');
const fs = require('fs');
const crawl = require('./crawl');
const { getHistory } = require('../mongodb/history');

ipcMain.on('start-crawl', (event, formData) => {
  console.log(formData);
  crawl(event, formData);
});

ipcMain.on('choose-output', (event) => {
  const result = dialog.showOpenDialogSync({ properties: ['openDirectory'] });
  if (result) {
    event.reply('output-selected', result[0]);
  }
});

ipcMain.on('get-history', async (event) => {
  const result = await getHistory();
  event.reply('history-response', JSON.stringify(result));
});

ipcMain.on('pick-json', (event, args) => {
  const src = dialog.showOpenDialogSync({
    properties: ['openFile'],
    filters: [{ name: 'json', extensions: ['json'] }]
  });
  if (src) {
    const str = fs.readFileSync(src[0]).toString();
    const arr = JSON.parse(str);
    if (arr && Array.isArray(arr) && arr[0]) {
      const result = arr.reduce((prev, cur) => `${prev};${cur.url}`, '');
      if (result) {
        const { mode } = args;
        event.reply('json-response', { result, mode });
      }
    }
  }
});
