const puppeteer = require('puppeteer');
const createModel = require('../mongodb/createModel');

const grabData = async (page, options) => {
  console.log('grabing data');

  const result = await page.evaluate(
    (list, options) => {
      const { target, properties } = options;
      const elements = document.querySelectorAll(target);
      elements.forEach((el) => {
        const result = {};
        Object.keys(properties).forEach((key) => {
          const item = properties[key];
          const { name, selector, source } = item;
          const temp = el.querySelector(selector);
          if (temp[source]) {
            result[name] = temp[source];
          } else {
            result[name] = temp.getAttribute(source);
          }
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

const insertData = async (data, model) => {
  data.forEach(async (item) => {
    await model.create(item);
  });
  console.log('grabing data finished');
};

const crawlUrl = async (page, model, { url, target, properties }) => {
  await page.goto(url);
  await page.waitFor(1000);
  const res = await grabData(page, { target, properties });
  await insertData(res, model);
  await page.waitFor(2500);
  await page.close();
};

module.exports = async function (event, formValues) {
  const { name, link, target, properties } = formValues;
  const model = await createModel(name, properties);
  if (!model) {
    return;
  }
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true
  });
  console.log('browser start');

  const linkArray = link.split(';');

  const promises = [];
  for (let i = 0, len = linkArray.length; i < len; i++) {
    promises.push(async () => {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(0);
      await page.setViewport({ width: 1280, height: 800 });
      await crawlUrl(page, model, { url: linkArray[i], target, properties });
    });
  }

  for (const item of promises) {
    await item();
  }
  await browser.close();

  // page.on('console', (msg) => {
  //   if (typeof msg === 'object') {
  //     console.dir(msg);
  //   } else {
  //     console.log(msg);
  //   }
  // });
};
