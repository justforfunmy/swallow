let request = require('request');
const { ipcMain } = require('electron');
const { promisify } = require('util');
request = promisify(request);

// const regex = /(?<=\()\S+(?=\))/g;
const regex = /\((.+?)\)/;

ipcMain.on('send-request', async (e, url) => {
  let result = await request({
    url,
    json: true,
    headers: {
      'Content-Type': 'text/html;application/x-www-form-urlencoded; charset=GB2312',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36'
    },
    encoding: 'utf-8'
  });
  result = result.body;
  result = result.match(regex);
  // result = result[0];
  e.reply('request-done', result[1]);
});
