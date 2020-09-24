const root = document.querySelector('#root');
const formTemplate = document.querySelector('#form-template');
const trTemplate = document.querySelector('#tr-template');
const nextLinkBtn = document.querySelector('#next-link');
const deleteLinkBtn = document.querySelector('#delete-link');
const formModal = document.querySelector('#form-modal');
const addFieldBtn = document.querySelector('#add-field');
const fieldInput = document.querySelector('#field');
const selectorInput = document.querySelector('#selector');
const sourceInput = document.querySelector('#source');

const { ipcRenderer } = require('electron');
class Form {
  constructor() {
    this.init();
    this.initHandler();
  }

  target = null;

  init() {
    this.add();
  }

  resetModal() {
    formModal.style.display = 'none';
    fieldInput.value = '';
    selectorInput.value = '';
    sourceInput.value = '';
  }

  add() {
    const clone = document.importNode(formTemplate.content, true);
    const collectBtn = clone.querySelector('.collect-btn');
    const startBtn = clone.querySelector('.start-btn');
    collectBtn.addEventListener('click', () => {
      formModal.style.display = 'block';
      const target = collectBtn.parentNode.parentNode.parentNode;
      this.target = target;
    });
    startBtn.addEventListener('click', (e) => {
      const form = startBtn.parentNode.parentNode.parentNode;
      this.target = form;
      const values = this.getValues();
      ipcRenderer.send('start-crawl', values);
    });
    root.appendChild(clone);
  }

  delete() {
    const formList = document.querySelectorAll('.form-instance');
    const len = formList.length;
    if (len > 1) {
      root.removeChild(formList[len - 1]);
    }
  }

  addProperty(field, selector, source) {
    const table = this.target.querySelector('table');
    const tbody = table.querySelector('tbody');
    let td = trTemplate.content.querySelectorAll('td');
    td[0].textContent = field;
    td[1].textContent = selector;
    td[2].textContent = source;
    const clone = document.importNode(trTemplate.content, true);
    const deleteBtn = clone.querySelector('.delete-property');
    deleteBtn.addEventListener('click', () => {
      const tr = deleteBtn.parentNode;
      tbody.removeChild(tr);
    });
    tbody.appendChild(clone);
  }

  getValues() {
    const item = this.target;
    const name = item.querySelector('input[name="name"]').value;
    const link = item.querySelector('input[name="link"]').value;
    const target = item.querySelector('input[name="target"]').value;
    const trigger = item.querySelector('input[name="trigger"]').value;
    const tbody = item.querySelector('tbody');
    const trs = tbody.querySelectorAll('tr');
    const properties = {};
    trs.forEach((tr) => {
      const tds = tr.querySelectorAll('td');
      const name = tds[0].innerText;
      const selector = tds[1].innerText;
      const source = tds[2].innerText;
      properties[name] = {
        name,
        selector,
        source
      };
    });
    return { name, link, trigger, target, properties };
  }

  initHandler() {
    nextLinkBtn.addEventListener('click', (event) => {
      this.add();
    });

    deleteLinkBtn.addEventListener('click', (event) => {
      this.delete();
    });

    addFieldBtn.addEventListener('click', () => {
      if (this.target) {
        this.addProperty(fieldInput.value, selectorInput.value, sourceInput.value);
        this.resetModal();
      }
    });
  }
}

module.exports = Form;
