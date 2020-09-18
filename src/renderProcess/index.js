const Form = require('./form');
const { ipcRenderer } = require('electron');
const outputPath = document.querySelector('.output-path');
const outputText = outputPath.querySelector('#output');

module.exports = function () {
  console.log('render process');
  new Form();
  outputPath.addEventListener('click', () => {
    ipcRenderer.send('choose-output');
    ipcRenderer.on('output-selected', (event, output) => {
      outputText.innerText = output;
    });
  });
};
