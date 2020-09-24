const { ipcRenderer } = require('electron');
const { showToast } = require('./toast');
ipcRenderer.on('error', (event, message) => {
  showToast(message);
});

ipcRenderer.on('crawl-response', (event, res) => {
  console.log(res);
});
