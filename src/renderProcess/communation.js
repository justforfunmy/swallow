const { ipcRenderer } = require('electron');
const { showToast } = require('./toast');
const { createHistoryDom } = require('./history');
const { Form, getTargetForm } = require('./form');

const historyContainer = document.querySelector('.history-container');
const nextLinkBtn = document.querySelector('#next-link');
const deleteLinkBtn = document.querySelector('#delete-link');
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

historyContainer.addEventListener('mouseenter', () => {
  ipcRenderer.send('get-history');
});

nextLinkBtn.addEventListener('click', (event) => {
  new Form();
});

deleteLinkBtn.addEventListener('click', (event) => {
  const formList = document.querySelectorAll('.form-instance');
  if (formList.length < 2) {
    return;
  }
  const lastForm = root.lastElementChild;
  root.removeChild(lastForm);
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
