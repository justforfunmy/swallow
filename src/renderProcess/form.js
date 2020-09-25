const root = document.querySelector('#root');
const formTemplate = document.querySelector('#form-template');
const trTemplate = document.querySelector('#tr-template');

const formModal = document.querySelector('#form-modal');

const { ipcRenderer } = require('electron');

let targetForm = null;

exports.getTargetForm = () => targetForm;
const setTargetForm = (exports.setTargetForm = (form) => {
  targetForm = form;
});
class Form {
  constructor(options) {
    this.init(options);
  }

  dom = null;

  init(options) {
    const clone = document.importNode(formTemplate.content, true);
    const collectBtn = clone.querySelector('.collect-btn');
    const startBtn = clone.querySelector('.start-btn');
    collectBtn.addEventListener('click', () => {
      formModal.style.display = 'block';
      setTargetForm(this);
    });
    startBtn.addEventListener('click', (e) => {
      const values = this.getValues();
      ipcRenderer.send('start-crawl', values);
    });

    root.appendChild(clone);

    this.dom = root.lastElementChild;
    if (options) {
      this.initOptions(options);
    }
  }

  initOptions(options) {
    const { name, link, trigger, target, properties } = options;
    const dom = this.dom;
    dom.querySelector('input[name="name"]').value = name;
    dom.querySelector('input[name="link"]').value = link;
    dom.querySelector('input[name="target"]').value = target;
    dom.querySelector('input[name="trigger"]').value = trigger;
    properties.forEach((item) => {
      const { name, selector, source } = item;
      this.addProperty(name, selector, source);
    });
  }

  addProperty(field, selector, source) {
    const table = this.dom.querySelector('table');
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
    const dom = this.dom;
    const name = dom.querySelector('input[name="name"]').value;
    const link = dom.querySelector('input[name="link"]').value;
    const target = dom.querySelector('input[name="target"]').value;
    const trigger = dom.querySelector('input[name="trigger"]').value;
    const tbody = dom.querySelector('tbody');
    const trs = tbody.querySelectorAll('tr');
    const properties = [];
    trs.forEach((tr) => {
      const tds = tr.querySelectorAll('td');
      const name = tds[0].innerText;
      const selector = tds[1].innerText;
      const source = tds[2].innerText;
      properties.push({
        name,
        selector,
        source
      });
    });
    return { name, link, trigger, target, properties };
  }
}

exports.Form = Form;
