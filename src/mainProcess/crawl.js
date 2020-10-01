const puppeteer = require('puppeteer');
const createModel = require('../mongodb/createModel');
const { createRecord } = require('../mongodb/history');

const grabData = async (page, params) => {
  console.log('grabing data');

  const res = await page.evaluate(
    (list, options) => {
      const { target, properties } = options;
      const elements = document.querySelectorAll(target);
      elements.forEach((el) => {
        const result = {};
        properties.forEach((item) => {
          const { name, selector, source } = item;
          const temp = el.querySelector(selector);
          if (temp) {
            result[name] = temp[source] ? temp[source] : temp.getAttribute(source);
          }
        });
        list.push(result);
      });
      return list;
    },
    [],
    params
  );

  return res;
};

const insertData = async (data, model) => {
  data.forEach(async (item) => {
    await model.create(item);
  });
  console.log('grabing data finished');
};

const crawlUrl = async (page, model, event, { url, trigger, target, pagination, properties }) => {
  try {
    await page.goto(url);
    if (trigger !== '') {
      await page.click(trigger);
    }
    await page.waitFor(1000);
    if (pagination && pagination !== '') {
      const pageitems = await page.$$(pagination);
      pageitems.forEach(async (item, idx) => {
        const clickElement = page.$(`${pagination}:nth-child(${idx + 1})`);
        if (clickElement) {
          await page.click(`${pagination}:nth-child(${idx + 1})`);
          const res = await grabData(page, { target, properties });
          await insertData(res, model);
        }
      });
    } else {
      const res = await grabData(page, { target, properties });
      await insertData(res, model);
    }

    await page.waitFor(2500);
    await page.close();
  } catch (error) {
    console.error(error);
    event.reply('error', '网页爬取失败!');
  }
};

module.exports = async function crawl(event, formValues) {
  const { name, url, trigger, target, pagination, properties } = formValues;
  const model = await createModel(name, properties);
  if (!model) {
    return event.reply('error', '数据库集合名已存在');
  }
  await createRecord(formValues);
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true
  });
  console.log('browser start');

  const urlArray = url.split(';');

  const promises = [];
  for (let i = 0, len = urlArray.length; i < len; i += 1) {
    promises.push(async () => {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(0);
      await page.setViewport({ width: 1280, height: 800 });
      await crawlUrl(page, model, event, {
        url: urlArray[i],
        trigger,
        target,
        pagination,
        properties
      });
    });
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const item of promises) {
    // eslint-disable-next-line no-await-in-loop
    await item();
  }
  await browser.close();
  return event.reply('crawl-response', '网页爬取完成！');
  // page.on('console', (msg) => {
  //   if (typeof msg === 'object') {
  //     console.dir(msg);
  //   } else {
  //     console.log(msg);
  //   }
  // });
};
