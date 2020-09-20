const { ipcMain, dialog } = require('electron');
const crawl = require('./crawl');

ipcMain.on('start-crawl', (event, formData, destination) => {
  console.log(formData, destination);
  crawl(event, formData, destination);
});

ipcMain.on('choose-output', (event, args) => {
  const result = dialog.showOpenDialogSync({ properties: ['openDirectory'] });
  if (result) {
    event.reply('output-selected', result[0]);
  }
});
