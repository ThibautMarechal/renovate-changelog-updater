# Renovate-changelog-updater

How to use it ?
```
npx umbralab-renovate-changelog-updater --depName my-updated-package --current-version 1.0.0 --new-version 2.0.0 --is-lock-file-maintenance false
```

How to configure renovate ?
```
{
  allowPostUpgradeCommandTemplating: true,
  allowedPostUpgradeCommands: ['^npx umbralab-renovate-changelog-updater'],
  postUpgradeTasks: {
    commands: ['npx umbralab-renovate-changelog-updater --depName {{{depName}}} --current-version {{{currentVersion}}} --new-version {{{newVersion}}} --is-lock-file-maintenance {{{isLockFileMaintenance}}}'],
    fileFilters: ['CHANGELOG.md'],
    executionMode: 'update',
  }
}
```