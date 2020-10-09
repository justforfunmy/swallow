const { program } = require('commander');
const crawl = require('./crawl');
const init = require('./init');
const importUrls = require('./importUrls');

program.option('-src,--source <source>', 'file source');

program
  .command('crawl')
  .description('crawl website')
  .action(() => {
    const { source } = program.opts();
    crawl(source);
  });

program
  .command('init')
  .description('init config')
  .action(() => {
    init();
  });

program
  .command('import-urls')
  .description('import urls from json file')
  .action(() => {
    const { source } = program.opts();
    importUrls(source);
  });

program.parse(process.argv);
