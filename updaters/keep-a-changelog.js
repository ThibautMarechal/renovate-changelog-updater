// @ts-check

const { Release, Change, parser: keepAChangelogParser } = require('keep-a-changelog');

const dependencyListTitle = 'Dependency updates\\';
const terraformMaintenanceTitle = 'Lock file maintenance';

/**
 *
 * @param {string} depName
 * @param {string} currentVersion
 * @param {string} newVersion
 * @returns string
 */
function getChangeDescription(depName, currentVersion, newVersion) {
  // Ensure all parts are valid and not empty
  if (!depName || !currentVersion || !newVersion) {
    return null; // Return null if any of the parameters are empty or invalid
  }
  return `${depName}: ${currentVersion} -> ${newVersion}\\`;
}

/**
 * Determines the semver category for the version change.
 *
 * @param {string} currentVersion
 * @param {string} newVersion
 * @returns {'changed' | 'added' | 'fixed'}
 */
function getSemverCategory(currentVersion, newVersion) {
  if (semver.diff(currentVersion, newVersion) === 'major') {
    return 'changed';
  } else if (semver.diff(currentVersion, newVersion) === 'minor') {
    return 'added';
  } else if (semver.diff(currentVersion, newVersion) === 'patch') {
    return 'fixed';
  } else {
    return 'changed';
  }
}

/**
 * @param {string} changelogRaw
 * @param {string} depName
 * @param {string} currentVersion
 * @param {string} newVersion
 * @param {boolean} isLockFileMaintenance
 * @returns {string} the updated changelog
 */
function keepAChangelogUpdater(changelogRaw, depName, currentVersion, newVersion, isLockFileMaintenance) {
  const changelog = keepAChangelogParser(changelogRaw);
  const [firstRelease] = changelog.releases;
  let unReleased;
  if (!firstRelease || firstRelease.version) {
    unReleased = new Release();
    changelog.addRelease(unReleased);
  } else {
    unReleased = firstRelease;
  }
  
  // Regular behavior for other dependencies
  const category = getSemverCategory(currentVersion, newVersion);
  const changeDescription = getChangeDescription(depName, currentVersion, newVersion);
  
  // Only proceed if the change description is valid (non-null)
  if (changeDescription !== null) {
    let dependencyChange = unReleased.changes.get(category)?.find((change) => change.title.match(new RegExp(`^${dependencyListTitle}\\n?`)));
    if (!dependendyChanged) {
      dependendyChanged = new Change(`${dependencyListTitle}\n${changeDescription}`);
      unReleased.addChange(category, dependendyChanged);  
    } else {
      let alreadyUpdated = false;
      const dependencyChangeRegex = /^(.*):\s(.*)\s->\s([^\\\s]*)\\?$/;
      const previousTitle = dependendyChanged.title;
      dependendyChanged.title = dependencyListTitle;
      for (const update of previousTitle.split('\n').slice(1)) {
        const regexResult = dependencyChangeRegex.exec(update);
        if (regexResult) {
          const [, updatedDepName, updateCurrentVersion, updatedVersion] = regexResult;
          if (updatedDepName !== depName) {
            dependendyChanged.title += `\n${getChangeDescription(updatedDepName, updateCurrentVersion, updatedVersion)}`;
          } else {
            dependendyChanged.title += `\n${getChangeDescription(depName, updateCurrentVersion, newVersion)}`;
            alreadyUpdated = true;
          }
        } else {
          dependendyChanged.title += `\n${update}`;
        }
      }
      if (!alreadyUpdated) {
        dependendyChanged.title += `\n${changeDescription}`;
      }
    }
  dependendyChanged.title = dependendyChanged.title.replace(/\\$/g, '');
  }
  // Add changelog entry if lock file maintenance is performed
  if (isLockFileMaintenance) {
    // Find an existing "Terraform lock file maintenance" entry
    let lockFileChange = unReleased.changes.get('added')?.find(change => change.title === terraformMaintenanceTitle);
    if (!lockFileChange) {
      unReleased.addChange('added', new Change(terraformMaintenanceTitle));
    }
  }
  return changelog.toString();
}

module.exports = {
  updater: keepAChangelogUpdater,
};
