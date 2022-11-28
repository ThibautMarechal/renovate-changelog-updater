#!/usr/bin/env node
// @ts-check

const process = require('process');
const fs = require('fs/promises');
const yargs = require('yargs');
const updaters = require('./updaters');

const parser = yargs(process.argv.slice(2))
  .options({
    'dep-name': {
      type: 'string',
      demandOption: true,
      describe: 'The name of the updated dependency',
    },
    'current-version': {
      type: 'string',
      demandOption: true,
      describe: 'The current version of the updated package',
    },
    'new-version': {
      type: 'string',
      demandOption: true,
      describe: 'The new version of the updated package',
    },
    format: {
      type: 'string',
      describe: 'The changelog format',
      default: 'keep-a-changelog',
      choices: Object.keys(updaters),
    },
    path: {
      type: 'string',
      describe: 'The changelog file location',
      default: './CHANGELOG.md',
    },
  })
  .example('$0 --dep-name my-updated-package --current-version 1.0.0 --new-version 2.0.0', '');

(async () => {
  const { 'new-version': newVersion, 'current-version': currentVersion, 'dep-name': depName, format, path } = await parser.argv;
  const changelogBuffer = await fs.readFile(path);
  const changelogUpdater = updaters[format];
  if (!changelogUpdater) {
    throw new Error(`Unsupported changelog format "${format}"`);
  }
  await fs.writeFile(path, changelogUpdater(changelogBuffer.toString(), depName, currentVersion, newVersion));
})();
