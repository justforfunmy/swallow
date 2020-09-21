const puppeteer = require('puppeteer');
const createModel = require('../mongodb/createModel');

const grabData = (page, options, model) => {
  console.log('grabing data');

  page.evaluate(
    (model, options) => {
      const { target, properties } = options;
      const elements = document.querySelectorAll(target);
      elements.forEach((el) => {
        const result = {};
        Object.keys(properties).forEach((key) => {
          const item = properties[key];
          const { name, selector, source } = item;
          const temp = el.querySelector(selector);
          result[name] = temp[source];
        });
        model.create(result);
      });
    },
    model,
    options
  );
};

module.exports = async function (event, steps, destination) {
  const browser = await puppeteer.launch({ headless: false, ignoreHTTPSErrors: true });
  console.log('server start');

  const page = await browser.newPage();

  page.on('console', (msg) => {
    if (typeof msg === 'object') {
      console.dir(msg);
    } else {
      console.log(msg);
    }
  });
  await page.setDefaultNavigationTimeout(0);

  steps.forEach(async (step, idx) => {
    const { name, link, target, properties } = step;
    try {
      await page.goto(link);
      const model = createModel(name, properties);
      await grabData(page, { target, properties }, model);
      event.reply('crawl-response');
      await browser.close();
    } catch (error) {
      console.error(error);
      await browser.close();
    }
  });
};
