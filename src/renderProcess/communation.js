const { ipcRenderer } = require('electron');
const { showToast } = require('./toast');
const { createHistoryDom } = require('./history');
const { Form, getTargetForm } = require('./form');

const root = document.querySelector('#root');
const jsonRoot = document.querySelector('#json-root');
const historyContainer = document.querySelector('.history-container');
const nextUrlBtn = document.querySelector('#next-url');
const deleteUrlBtn = document.querySelector('#delete-url');
const importUrlBtn = document.querySelector('#import-url');
const addFieldBtn = document.querySelector('#add-field');
const cancelFieldBtn = document.querySelector('#cancel-field');
const fieldInput = document.querySelector('#field');
const selectorInput = document.querySelector('#selector');
const sourceInput = document.querySelector('#source');
const formModal = document.querySelector('#form-modal');
const switchComp = document.querySelector('#switch-comp');
const jsonConfigTextarea = document.querySelector('#json-config-textarea');
const jsonImportUrl = document.querySelector('#json-import-url');
const jsonReset = document.querySelector('#json-reset');
const jsonAddTrigger = document.querySelector('')

const initialConfig = {
  name: '',
  url: '',
  trigger: '',
  properties: [
    {
      name: '',
      selector: '',
      source: ''
    }
  ]
};

jsonConfigTextarea.value = JSON.stringify(initialConfig, null, 2);

const updateConfig = (params) => {
  const { key, value } = params;
  const prevText = jsonConfigTextarea.value;
  const config = JSON.parse(prevText);
  switch (key) {
    case 'url':
      config.url += `;${value}`;
      break;

    default:
      break;
  }
  jsonConfigTextarea.value = JSON.stringify(config, null, 2);
};

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
  const { result, mode } = res;
  if (mode === 'form') {
    const form = new Form();
    form.setUrl(res);
  } else {
    updateConfig({ key: 'url', value: result });
  }
});

switchComp.addEventListener('change', () => {
  const { value } = switchComp;
  jsonRoot.style.display = value === 'json' ? 'block' : 'none';
  root.style.display = value === 'form' ? 'block' : 'none';
});

jsonReset.addEventListener('click', () => {
  jsonConfigTextarea.value = JSON.stringify(initialConfig, null, 2);
});

historyContainer.addEventListener('mouseenter', () => {
  ipcRenderer.send('get-history');
});

nextUrlBtn.addEventListener('click', () => {
  // eslint-disable-next-line no-new
  new Form();
});

deleteUrlBtn.addEventListener('click', () => {
  const lastForm = root.lastElementChild;
  root.removeChild(lastForm);
});

importUrlBtn.addEventListener('click', () => {
  ipcRenderer.send('pick-json', { mode: 'form' });
});

jsonImportUrl.addEventListener('click', () => {
  ipcRenderer.send('pick-json', { mode: 'json' });
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
