// @ts-check

const { Release, Change, parser: keepAChangelogParser } = require('keep-a-changelog');

const dependencyListTitle = 'Dependency updates\\';

/**
 *
 * @param {string} depName
 * @param {string} currentVersion
 * @param {string} newVersion
 * @returns string
 */
function getChangeDescription(depName, currentVersion, newVersion) {
  return `${depName}: ${currentVersion} -> ${newVersion}\\`;
}

/**
 * @param {string} changelogRaw
 * @param {string} depName
 * @param {string} currentVersion
 * @param {string} newVersion
 * @returns {string} the updated changelog
 */
function keepAChangelogUpdater(changelogRaw, depName, currentVersion, newVersion) {
  const changelog = keepAChangelogParser(changelogRaw);
  const [firstRelease] = changelog.releases;
  let unReleased;
  if (!firstRelease || firstRelease.version) {
    unReleased = new Release();
    changelog.addRelease(unReleased);
  } else {
    unReleased = firstRelease;
  }
  const changedEntries = unReleased.changes.get('changed');
  let dependendyChanged = changedEntries?.find((changed) => changed.title.match(new RegExp(`^${dependencyListTitle}\n?`)));
  if (!dependendyChanged) {
    dependendyChanged = new Change(`${dependencyListTitle}\n${getChangeDescription(depName, currentVersion, newVersion)}`);
    unReleased.addChange('changed', dependendyChanged);
  } else {
    let alreadyUpdated = false;
    const dependencyChangeRegex = /^(.*):\s(.*)\s->\s(.*)\\?$/;
    const previousTitle = dependendyChanged.title;
    dependendyChanged.title = dependencyListTitle;
    for (const update of previousTitle.split('\n').slice(1)) {
      const regexResult = dependencyChangeRegex.exec(update);
      if (regexResult) {
        const [, updatedDepName, updateCurrentVersion] = regexResult;
        if (updatedDepName !== depName) {
          dependendyChanged.title += `\n${update}`;
        } else {
          dependendyChanged.title += `\n${getChangeDescription(depName, updateCurrentVersion, newVersion)}`;
          alreadyUpdated = true;
        }
      } else {
        dependendyChanged.title += `\n${update}`;
      }
    }
    if (!alreadyUpdated) {
      dependendyChanged.title += `\n${getChangeDescription(depName, currentVersion, newVersion)}`;
    }
  }
  dependendyChanged.title = dependendyChanged.title.replace(/\\$/g, '');
  return changelog.toString();
}

module.exports = {
  updater: keepAChangelogUpdater,
};
