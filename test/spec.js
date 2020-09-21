const Application = require('spectron').Application;
const assert = require('assert');
const electronPath = require('electron'); // Require Electron from the binaries included in node_modules.
const path = require('path');

describe('Application launch', function () {
  this.timeout(10000);

  const app = new Application({
    // Your electron path can be any binary
    // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
    // But for the sake of the example we fetch it from our node_modules.
    path: electronPath,

    // Assuming you have the following directory structure

    //  |__ my project
    //     |__ ...
    //     |__ main.js
    //     |__ package.json
    //     |__ index.html
    //     |__ ...
    //     |__ test
    //        |__ spec.js  <- You are here! ~ Well you should be.

    // The following line tells spectron to look and use the main.js file
    // and the package.json located 1 level above.
    args: [path.join(__dirname, '..')]
  });

  beforeEach(function () {
    return app.start();
  });

  afterEach(function () {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  it.skip('shows an initial window', async () => {
    const count = await app.client.getWindowCount();
    return assert.strictEqual(count, 1);
  });

  it.skip('has the correct title', async () => {
    await app.client.waitUntilWindowLoaded();
    const title = await app.browserWindow.getTitle();
    return assert.strictEqual(title, 'Swallow');
  });

  it.skip('does not have the dev tools open', async () => {
    await app.client.waitUntilWindowLoaded();
    const devToolsOpen = await app.browserWindow.isDevToolsOpened();
    return assert.strictEqual(devToolsOpen, false);
  });

  it.skip('has a button with the text "添加路径"', async () => {
    await app.client.waitUntilWindowLoaded();
    const buttonText = await (await app.client.$('#next-link')).getText();
    return assert.strictEqual(buttonText, '添加路径');
  });

  it.skip('should have only one link input when the application start', async () => {
    await app.client.waitUntilWindowLoaded();
    const linkInput = await app.client.$$('input[name="link"]');
    return assert.strictEqual(linkInput.length, 1);
  });

  it.skip('should have at least two link input when the "添加路径" button pressed', async () => {
    await app.client.waitUntilWindowLoaded();
    await (await app.client.$('#next-link')).click();
    const linkInput = await app.client.$$('input[name="link"]');
    return assert.strictEqual(linkInput.length, 2);
  });

  it.skip('should succefully remove a link input', async () => {
    await app.client.waitUntilWindowLoaded();
    await (await app.client.$('#next-link')).click();
    await (await app.client.$('#delete-link')).click();
    const linkInput = await app.client.$$('input[name="link"]');
    return assert.strictEqual(linkInput.length, 1);
  });

  it.skip('should modal display none when the application start', async () => {
    await app.client.waitUntilWindowLoaded();
    const modal = await app.client.$('#form-modal');
    const display = await modal.getCSSProperty('display');
    return assert.strictEqual(display.value, 'none');
  });

  it.skip('should open a modal when the "添加采集数据项" buttons pressed', async () => {
    await app.client.waitUntilWindowLoaded();
    const collectButtons = await app.client.$$('.collect-btn');
    await collectButtons[0].click();
    const modal = await app.client.$('#form-modal');
    const display = await modal.getCSSProperty('display');
    return assert.strictEqual(display.value, 'block');
  });

  it('should add properties succefully', async () => {
    await app.client.waitUntilWindowLoaded();
    const form = await app.client.$$('.form-instance');
    await (await form[0].$('.collect-btn')).click();
    const modal = await app.client.$('#form-modal');
  });
});
