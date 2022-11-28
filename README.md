# Renovate-changelog-parser

How to use it ?
```
npx renovate-changelog-updater --depName my-updated-package --current-version 1.0.0 --new-version 2.0.0
```

How to configure renovate ?
```
{
  allowPostUpgradeCommandTemplating: true,
  allowedPostUpgradeCommands: ['^npx renovate-changelog-updater'],
  postUpgradeTasks: {
    commands: ['npx renovate-changelog-updater --depName {{{depName}}} --current-version {{{currentVersion}}} --new-version {{{newVersion}}}'],
    fileFilters: ['CHANGELOG.md'],
    executionMode: 'update',
  }
}
```