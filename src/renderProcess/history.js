const historyContainer = document.querySelector('.history-container');
const recordTemplate = document.querySelector('#record-template');
const { Form } = require('./form');

exports.createHistoryDom = (list) => {
  while (historyContainer.lastChild) {
    historyContainer.removeChild(historyContainer.lastChild);
  }

  list.forEach((item) => {
    const { name, url } = item;
    const record = document.importNode(recordTemplate.content, true);
    record.querySelector('.record-title').innerHTML = name;
    record.querySelector('.record-url').innerHTML = url;
    record.querySelector('.record-item').addEventListener('click', () => {
      new Form(item);
    });
    historyContainer.appendChild(record);
  });
};
