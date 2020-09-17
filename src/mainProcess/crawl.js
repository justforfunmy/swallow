const puppeteer = require('puppeteer');
const path = require('path');

const handleData = (page) => {
  console.log('data dealing');

  const result = page.evaluate((list) => {
    const authors = document.querySelectorAll('.author');
    for (const item of authors) {
      list.push(item.innerText.trim());
    }
    return list;
  }, []);

  return result;
};

module.exports = async function (event, args) {
  const browser = await puppeteer.launch({ headless: false, ignoreHTTPSErrors: true });
  console.log('server start');

  try {
    const page = await browser.newPage();

    page.on('console', (msg) => {
      if (typeof msg === 'object') {
        console.dir(msg);
      } else {
        console.log(msg);
      }
    });
    await page.setDefaultNavigationTimeout(0);
    await page.goto('https://book.douban.com/');
    console.log('page loaded');
    const res = await handleData(page);
    console.log(`response:${res}`);
    event.reply('crawl-response', res);
    await browser.close();
  } catch (error) {
    console.error(error);
    await browser.close();
  }
};
