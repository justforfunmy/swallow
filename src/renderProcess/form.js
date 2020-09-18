const root = document.querySelector('#root');
const formTemplate = document.querySelector('#form-template');
const trTemplate = document.querySelector('#tr-template');
const nextLinkBtn = document.querySelector('#next-link');
const deleteLinkBtn = document.querySelector('#delete-link');
const formModal = document.querySelector('#form-modal');
const startBtn = document.querySelector('#start-btn');
const addFieldBtn = document.querySelector('#add-field');
const fieldInput = document.querySelector('#field');
const selectorInput = document.querySelector('#selector');
const sourceInput = document.querySelector('#source');

const { ipcRenderer } = require('electron');

ipcRenderer.on('crawl-response', (e, res) => {
  console.log(res);
});

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
    collectBtn.addEventListener('click', () => {
      formModal.style.display = 'block';
      const target = collectBtn.parentNode.parentNode.parentNode;
      this.target = target;
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

  initHandler() {
    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const url =
        'https://club.jd.com/comment/productPageComments.action?callback=fetchJSON_comment98&productId=50647371545&score=0&sortType=5&page=0&pageSize=10&isShadowSku=0&fold=1';
      ipcRenderer.send('start-crawl', url);
    });

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
