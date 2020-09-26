const { ipcRenderer } = require('electron');
const { showToast } = require('./toast');
const { createHistoryDom } = require('./history');
const { Form, getTargetForm } = require('./form');

const historyContainer = document.querySelector('.history-container');
const nextUrlBtn = document.querySelector('#next-url');
const deleteUrlBtn = document.querySelector('#delete-url');
const importUrlBtn = document.querySelector('#import-url');
const root = document.querySelector('#root');

const addFieldBtn = document.querySelector('#add-field');
const cancelFieldBtn = document.querySelector('#cancel-field');
const fieldInput = document.querySelector('#field');
const selectorInput = document.querySelector('#selector');
const sourceInput = document.querySelector('#source');
const formModal = document.querySelector('#form-modal');

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

ipcRenderer.on('json-response', (event, res) => {
  const form = new Form();
  form.setUrl(res);
});

historyContainer.addEventListener('mouseenter', () => {
  ipcRenderer.send('get-history');
});

nextUrlBtn.addEventListener('click', (event) => {
  new Form();
});

deleteUrlBtn.addEventListener('click', (event) => {
  const lastForm = root.lastElementChild;
  root.removeChild(lastForm);
});

importUrlBtn.addEventListener('click', () => {
  ipcRenderer.send('pick-json');
});

function resetModal() {
  formModal.style.display = 'none';
  fieldInput.value = '';
  selectorInput.value = '';
  sourceInput.value = '';
}

addFieldBtn.addEventListener('click', () => {
  const targetForm = getTargetForm();
  if (targetForm) {
    targetForm.addProperty(fieldInput.value, selectorInput.value, sourceInput.value);
    resetModal();
  }
});

cancelFieldBtn.addEventListener('click', () => {
  resetModal();
});
