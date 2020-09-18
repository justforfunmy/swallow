const root = document.querySelector('#root');
const template = document.querySelector('#form-template');
const nextLinkBtn = document.querySelector('#next-link');
const deleteLinkBtn = document.querySelector('#delete-link');
const formModal = document.querySelector('#form-modal');
const { setTarget } = require('./modal');

const { ipcRenderer } = require('electron');

ipcRenderer.on('crawl-response', (e, res) => {
  console.log(res);
});

class Form {
  constructor() {
    this.init();
    this.initHandler();
  }

  init() {
    this.add();
  }

  add() {
    const clone = document.importNode(template.content, true);
    const collectBtn = clone.querySelector('.collect-btn');
    collectBtn.addEventListener('click', () => {
      formModal.style.display = 'block';
      const target = collectBtn.parentNode.parentNode.parentNode;
      setTarget(target);
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

  initHandler() {
    const startBtn = document.querySelector('#start-btn');

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
  }
}

module.exports = Form;
