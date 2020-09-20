// const Application = require('spectron').Application;
// const assert = require('assert');
// const electronPath = require('electron'); // Require Electron from the binaries included in node_modules.
// const path = require('path');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer');
const electron = require('electron');
const { assert } = require('console');

describe('Application launch', async function () {
  // this.timeout(10000);

  // const app = new Application({
  //   path: electronPath,
  //   args: [path.resolve(__dirname, '..')]
  // });

  // beforeEach(async (done) => {
  //   await app.start();
  //   done();
  // });

  // afterEach(async (done) => {
  //   if (app && app.isRunning()) {
  //     await app.stop();
  //     done();
  //   }
  // });

  // it('shows an initial window', async function (done) {
  //   await app.client.waitUntilWindowLoaded();
  //   return app.client.getWindowCount().then(function (count) {
  //     assert.equal(count, 1);
  //     // Please note that getWindowCount() will return 2 if `dev tools` are opened.
  //     // assert.equal(count, 2)
  //     done();
  //   });
  // });

  const spwanProcess = spawn(electron, ['.', '--remote-debugging-port=9200'], { shell: true });
  const app = await puppeteer.connect({ browserURL: 'http://localhost:9200' });
  const [page] = await app.pages();

  it('start button', async () => {
    const startBtn = page.$('.start-btn');
    assert.equal(startBtn.innerText, '开始');
  });
});
