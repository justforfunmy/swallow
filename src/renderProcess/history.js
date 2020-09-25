const historyContainer = document.querySelector('.history-container');
const recordTemplate = document.querySelector('#record-template');
const { Form } = require('./form');

exports.createHistoryDom = (list) => {
  while (historyContainer.lastChild) {
    historyContainer.removeChild(historyContainer.lastChild);
  }

  list.forEach((item) => {
    const { name, link } = item;
    const record = document.importNode(recordTemplate.content, true);
    record.querySelector('.record-title').innerHTML = name;
    record.querySelector('.record-link').innerHTML = link;
    record.querySelector('.record-item').addEventListener('click', () => {
      new Form(item);
    });
    historyContainer.appendChild(record);
  });
};
