/* eslint-disable no-await-in-loop */
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const chalk = require('chalk');

function validate(config) {
  const { url, name, properties, targetSelector } = config;
  if (!name) {
    return false;
  }
  if (!targetSelector) {
    return false;
  }
  if (!url) {
    return false;
  }
  if (!(Array.isArray(properties) && url[0])) {
    return false;
  }
  return true;
}

async function handleActions(page, actions) {
  if (Array.isArray(actions)) {
    for (let index = 0; index < actions.length; index += 1) {
      const { type, selector } = actions[index];
      switch (type) {
        case 'click':
          // eslint-disable-next-line no-await-in-loop
          await page.click(selector);
          // eslint-disable-next-line no-await-in-loop
          await page.waitFor(1000);
          break;

        default:
          break;
      }
    }
  }
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    // eslint-disable-next-line no-unused-vars
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const { scrollHeight } = document.body;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

async function grabData(page, targetSelector, properties) {
  const res = await page.evaluate(
    (list, options) => {
      // eslint-disable-next-line no-shadow
      const { targetSelector, properties } = options;
      const elements = document.querySelectorAll(targetSelector);
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
    { targetSelector, properties }
  );
  return res;
}

async function writeData(filename, data) {
  const destination = path.resolve(process.cwd(), `${filename}.json`);
  fs.writeFile(destination, JSON.stringify(data, null, 2), (error) => {
    if (error) {
      console.error(chalk.redBright('write error'), error);
    } else {
      console.log(chalk.greenBright('write succefully'));
    }
  });
}

async function crawlUrl(page, resultList, options) {
  const { url, actions, targetSelector, properties } = options;
  await page.goto(url);
  // 处理页面动作
  await handleActions(page, actions);
  // 处理滚动
  await autoScroll(page);
  // 抓取数据
  const res = await grabData(page, targetSelector, properties);
  resultList.push(...res);
}

async function crawl(config) {
  if (!validate(config)) {
    return console.error(chalk.redBright('invalid config'));
  }
  const { name, url, actions, targetSelector, pagination, properties } = config;
  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true
  });
  console.log(chalk.yellowBright('browser start'));

  const list = [];
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  await page.setViewport({ width: 1280, height: 800 });
  if (Array.isArray(url)) {
    for (let index = 0, len = url.length; index < len; index += 1) {
      const item = url[index];
      await crawlUrl(page, list, { url: item, actions, targetSelector, properties });
    }
  } else {
    try {
      // 爬取首页
      await crawlUrl(page, list, { url, actions, targetSelector, properties });
      // 处理分页
      const { count, nextpageSelector } = pagination;
      let idx = 1;
      while (idx < count) {
        const [response] = await Promise.all([
          page.waitForNavigation(),
          page.click(nextpageSelector)
        ]);
        // eslint-disable-next-line no-underscore-dangle
        await crawlUrl(page, list, { url: response._url, actions, targetSelector, properties });
        idx += 1;
      }
      await page.close();
    } catch (error) {
      console.error('crawl error', error);
    }
  }

  await writeData(name, list);
  await browser.close();
  return true;
}

module.exports = (src) => {
  const configPath = path.join(process.cwd(), src);

  if (!fs.existsSync(configPath)) {
    console.error(chalk.redBright('invalid config source'));
  } else {
    // 读取配置文件
    let config = fs.readFileSync(configPath);
    config = JSON.parse(config.toString());
    crawl(config);
  }
};
