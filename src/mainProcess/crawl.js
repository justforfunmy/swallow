const puppeteer = require('puppeteer');

const grabData = (page, options) => {
  console.log('grabing data');

  const result = page.evaluate(
    (list, options) => {
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
        list.push(result);
      });
      return list;
    },
    [],
    options
  );

  return result;
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
      const res = await grabData(page, { target, properties });
      event.reply('crawl-response', res);
      await browser.close();
    } catch (error) {
      console.error(error);
      await browser.close();
    }
  });
};
