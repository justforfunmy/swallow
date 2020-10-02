const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

function validate(config) {
  const { url, name, properties, targetSelector } = config;
  if (name === '') {
    return false;
  }
  if (targetSelector === '') {
    return false;
  }
  if (!(Array.isArray(url) && url[0])) {
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
      console.error('write error', error);
    } else {
      console.log('write succefully');
    }
  });
}

async function crawl(config) {
  if (!validate(config)) {
    return console.error('invalid config');
  }
  const { name, url, actions, targetSelector, pagination, properties } = config;
  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true
  });
  console.log('browser start');
  const processArray = url.map((item) => {
    return async (list) => {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(0);
      await page.setViewport({ width: 1280, height: 800 });
      try {
        await page.goto(item);
        // 处理页面动作
        await handleActions(page, actions);
        // 处理滚动
        await autoScroll(page);
        // 抓取数据
        const res = await grabData(page, targetSelector, properties);
        list.push(...res);
        await page.close();
      } catch (error) {
        console.error('crawl error', error);
      }
    };
  });
  const list = [];
  for (let index = 0; index < processArray.length; index += 1) {
    const process = processArray[index];
    // eslint-disable-next-line no-await-in-loop
    await process(list);
  }
  await writeData(name, list);
  await browser.close();
  return true;
}

module.exports = (src) => {
  const configPath = path.join(process.cwd(), src);

  if (!fs.existsSync(configPath)) {
    console.error('invalid config source');
  } else {
    // 读取配置文件
    let config = fs.readFileSync(configPath);
    config = JSON.parse(config.toString());
    crawl(config);
  }
};
