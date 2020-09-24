const { ipcRenderer } = require('electron');
const { showToast } = require('./toast');
const { createHistoryDom } = require('./history');

const historyContainer = document.querySelector('.history-container');

ipcRenderer.on('error', (event, message) => {
  showToast(message);
});

ipcRenderer.on('crawl-response', (event, res) => {
  showToast(res);
});

ipcRenderer.on('history-response', (event, res) => {
  const list = JSON.parse(res);
  createHistoryDom(list);
});

historyContainer.addEventListener('mouseenter', () => {
  ipcRenderer.send('get-history');
});
