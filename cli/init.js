const path = require('path');
const inquirer = require('inquirer');
const ejs = require('ejs');
const Metalsmith = require('metalsmith');
const chalk = require('chalk');

const { getCwd } = require('./utils');

async function genConfigFile(options) {
  const { name } = options;
  const cwd = getCwd();
  const templateSrc = path.resolve(__dirname, '../template');
  Metalsmith(__dirname)
    .source(templateSrc)
    .destination(path.resolve(cwd, `${name}`))
    .use((files) => {
      Object.keys(files).forEach((key) => {
        const file = files[key];
        // 原内容
        const str = file.contents.toString();
        // 新内容
        const newContents = ejs.render(str, options);
        // 将新内容写到文件中
        file.contents = Buffer.from(newContents);
      });
    })
    .build((error) => {
      if (error) {
        console.error(chalk.redBright('init error'), error);
      }
      console.log(chalk.greenBright(`directory ${name} created.`));
    });
}

module.exports = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'name?'
    }
  ]);
  genConfigFile(answers);
};
