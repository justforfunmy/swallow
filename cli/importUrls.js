const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { getCwd } = require('./utils');

const isInited = () => {
  return fs.existsSync(path.resolve(getCwd(), 'config.json'));
};

module.exports = (source) => {
  if (!isInited()) {
    console.log(chalk.redBright('no config.json , please init first.'));
  } else {
    const config = JSON.parse(fs.readFileSync(path.resolve(getCwd(), 'config.json')).toString());
    const data = JSON.parse(fs.readFileSync(path.resolve(getCwd(), source)).toString());
    const urls = data.map((item) => item.url);
    config.url = urls;
    fs.writeFile(
      path.resolve(getCwd(), 'config.json'),
      JSON.stringify(config, null, 2),
      (error) => {
        if (error) {
          return console.error(chalk.redBright('import failed', error));
        }
        return console.log(chalk.greenBright('import succeded'));
      }
    );
  }
};
