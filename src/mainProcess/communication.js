const { ipcMain, dialog } = require('electron');
const crawl = require('./crawl');
const { getHistory } = require('../mongodb/history');
const fs = require('fs');
const path = require('path');

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

ipcMain.on('pick-json', (event, args) => {
  const src = dialog.showOpenDialogSync({
    properties: ['openFile'],
    filters: [{ name: 'json', extensions: ['json'] }]
  });
  const str = fs.readFileSync(src[0]).toString();
  const arr = JSON.parse(str);
  if (!Array.isArray(arr) || !arr[0]) {
    return event.reply('error', 'json 数据错误！');
  }
  const result = arr.reduce((prev, cur) => {
    return prev + ';' + cur.url;
  }, '');
  if (result) {
    event.reply('json-response', result);
  }
});
