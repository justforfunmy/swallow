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

  it('shows an initial window', async () => {
    const count = await app.client.getWindowCount();
    return assert.strictEqual(count, 1);
  });

  it('has the correct title', async () => {
    await app.client.waitUntilWindowLoaded();
    const title = await app.browserWindow.getTitle();
    return assert.strictEqual(title, 'Swallow');
  });

  it('does not have the dev tools open', async () => {
    await app.client.waitUntilWindowLoaded();
    const devToolsOpen = await app.browserWindow.isDevToolsOpened();
    return assert.strictEqual(devToolsOpen, false);
  });

  it('has a button with the text "新建"', async () => {
    await app.client.waitUntilWindowLoaded();
    const buttonText = await (await app.client.$('#next-link')).getText();
    return assert.strictEqual(buttonText, '新建');
  });

  it('should have only one link input when the application start', async () => {
    await app.client.waitUntilWindowLoaded();
    const linkInput = await app.client.$$('input[name="link"]');
    return assert.strictEqual(linkInput.length, 1);
  });

  it('should have at least two link input when the "新建" button pressed', async () => {
    await app.client.waitUntilWindowLoaded();
    await (await app.client.$('#next-link')).click();
    const linkInput = await app.client.$$('input[name="link"]');
    return assert.strictEqual(linkInput.length, 2);
  });

  it('should succefully remove a link input', async () => {
    await app.client.waitUntilWindowLoaded();
    await (await app.client.$('#next-link')).click();
    await (await app.client.$('#delete-link')).click();
    const linkInput = await app.client.$$('input[name="link"]');
    return assert.strictEqual(linkInput.length, 1);
  });

  it('should modal display none when the application start', async () => {
    await app.client.waitUntilWindowLoaded();
    const modal = await app.client.$('#form-modal');
    const display = await modal.getCSSProperty('display');
    return assert.strictEqual(display.value, 'none');
  });

  it('should open a modal when the "添加采集数据项" buttons pressed', async () => {
    await app.client.waitUntilWindowLoaded();
    const collectButtons = await app.client.$$('.collect-btn');
    await collectButtons[0].click();
    const modal = await app.client.$('#form-modal');
    const display = await modal.getCSSProperty('display');
    return assert.strictEqual(display.value, 'block');
  });

  it('should toast opacity is 0 when the application start', async () => {
    await app.client.waitUntilWindowLoaded();
    const toast = await app.client.$('.toast');
    const opacity = await toast.getCSSProperty('opacity');
    return assert.strictEqual(opacity.value, '0');
  });
});
