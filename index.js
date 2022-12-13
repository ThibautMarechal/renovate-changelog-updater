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
    'ignore-failure': {
      type: 'boolean',
      describe: 'Ignore errors',
      default: false,
    },
    path: {
      type: 'string',
      describe: 'The changelog file location',
      default: './CHANGELOG.md',
    },
  })
  .example('$0 --dep-name my-updated-package --current-version 1.0.0 --new-version 2.0.0', '');

(async () => {
  const { format, path, depName, newVersion, currentVersion, ignoreFailure } = await parser.argv;
  let changelogBuffer;
  try {
    changelogBuffer = await fs.readFile(path);
  } catch (e) {
    if (!ignoreFailure) {
      throw e;
    } else {
      return;
    }
  }
  const changelogUpdater = updaters[format];
  if (!changelogUpdater) {
    throw new Error(`Unsupported changelog format "${format}"`);
  }
  try {
    await fs.writeFile(path, changelogUpdater(changelogBuffer.toString(), depName, currentVersion, newVersion));
  } catch (e) {
    if (!ignoreFailure) {
      throw e;
    }
  }
})();
