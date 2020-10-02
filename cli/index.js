const { program } = require('commander');
const crawl = require('./crawl');

program.option('-src,--source <source>', 'config file source');

program
  .command('crawl')
  .description('crawl website')
  .action(() => {
    const { source } = program.opts();
    crawl(source);
  });

program.parse(process.argv);
