const historyContainer = document.querySelector('.history-container');
const recordTemplate = document.querySelector('#record-template');

exports.createHistoryDom = (list) => {
  while (historyContainer.lastChild) {
    historyContainer.removeChild(historyContainer.lastChild);
  }

  list.forEach((item) => {
    const { name, link } = item;
    const record = document.importNode(recordTemplate.content, true);
    record.querySelector('.record-title').innerHTML = name;
    record.querySelector('.record-link').innerHTML = link;
    historyContainer.appendChild(record);
  });
};
