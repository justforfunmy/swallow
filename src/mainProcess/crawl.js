const puppeteer = require('puppeteer');
const createModel = require('../mongodb/createModel');

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

const crawlUrl = async (page, { link, name, target, properties }) => {
  await page.goto(link);
  const model = createModel(name, properties);
  const res = await grabData(page, { target, properties });
  await insertData(res, model);
};

module.exports = async function (event, formValues) {
  const browser = await puppeteer.launch({ headless: false, ignoreHTTPSErrors: true });
  console.log('browser start');

  const { name, link, target, properties } = formValues;
  const linkArray = link.split(';');
  const promises = [];
  for (let i = 0, len = linkArray.length; i < len; i++) {
    promises.push(
      browser.newPage().then(async (page) => {
        page.setDefaultNavigationTimeout(0);
        await page.setViewport({ width: 1280, height: 800 });
        await page.goto(linkArray[i]);
        await crawlUrl(page, { link, name, target, properties });
      })
    );
  }

  await Promise.all(promises);
  await browser.close();

  // page.on('console', (msg) => {
  //   if (typeof msg === 'object') {
  //     console.dir(msg);
  //   } else {
  //     console.log(msg);
  //   }
  // });
};
