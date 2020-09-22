const { ipcMain, dialog } = require('electron');
const crawl = require('./crawl');

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
