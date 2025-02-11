// @ts-check

const { updater } = require('./keep-a-changelog');
const { Changelog, Release } = require('keep-a-changelog');

const depName = 'my-awesome-dependency';

it('add the "UnReleased" released if not exist', () => {
  expect(updater(new Changelog('My changelog').toString(), depName, '0', '1', false)).toMatchInlineSnapshot(`
    "# My changelog

    All notable changes to this project will be documented in this file.

    The format is based on [Keep a Changelog](http://keepachangelog.com/)
    and this project adheres to [Semantic Versioning](http://semver.org/).

    ## Unreleased
    ### Changed
    - Dependency updates\\
      my-awesome-dependency: 0 -> 1
    "
  `);
});

it('add the changed to the already existing "UnReleased"section', () => {
  const changelog = new Changelog('My Changelog');
  const release = new Release();
  release.addChange('fixed', 'some fixes');
  changelog.addRelease(release);
  expect(updater(changelog.toString(), depName, '0', '1', false)).toMatchInlineSnapshot(`
    "# My Changelog

    All notable changes to this project will be documented in this file.

    The format is based on [Keep a Changelog](http://keepachangelog.com/)
    and this project adheres to [Semantic Versioning](http://semver.org/).

    ## Unreleased
    ### Changed
    - Dependency updates\\
      my-awesome-dependency: 0 -> 1

    ### Fixed
    - some fixes
    "
  `);
});

it('add the updated package to the dependency list if it already exists', () => {
  const changelog = new Changelog('My Changelog');
  const release = new Release();
  release.addChange('changed', 'Dependency updates\nanother-dependency: 4 -> 5');
  changelog.addRelease(release);
  expect(updater(changelog.toString(), depName, '0', '1', false)).toMatchInlineSnapshot(`
    "# My Changelog

    All notable changes to this project will be documented in this file.

    The format is based on [Keep a Changelog](http://keepachangelog.com/)
    and this project adheres to [Semantic Versioning](http://semver.org/).

    ## Unreleased
    ### Changed
    - Dependency updates\\
      another-dependency: 4 -> 5\\
      my-awesome-dependency: 0 -> 1
    "
  `);
});

it('update the dependency list if it already exists', () => {
  const changelog = new Changelog('My Changelog');
  const release = new Release();
  release.addChange('changed', `Dependency updates\n${depName}: 0 -> 1`);
  changelog.addRelease(release);
  expect(updater(changelog.toString(), depName, '1', '2', false)).toMatchInlineSnapshot(`
    "# My Changelog

    All notable changes to this project will be documented in this file.

    The format is based on [Keep a Changelog](http://keepachangelog.com/)
    and this project adheres to [Semantic Versioning](http://semver.org/).

    ## Unreleased
    ### Changed
    - Dependency updates\\
      my-awesome-dependency: 0 -> 2
    "
  `);
});

it('doesn\'t remove lines if someone messed up the dependency list updates', () => {
  const changelog = new Changelog('My Changelog');
  const release = new Release();
  release.addChange('changed', `Dependency updates\nHello world!\nmy-another-dependency: 0 -> 1\\`);
  changelog.addRelease(release);
  expect(updater(changelog.toString(), depName, '1', '2', false)).toMatchInlineSnapshot(`
    "# My Changelog

    All notable changes to this project will be documented in this file.

    The format is based on [Keep a Changelog](http://keepachangelog.com/)
    and this project adheres to [Semantic Versioning](http://semver.org/).

    ## Unreleased
    ### Changed
    - Dependency updates\\
      Hello world!
      my-another-dependency: 0 -> 1\\
      my-awesome-dependency: 1 -> 2
    "
  `);
});

it('adds only one line for lock file maintenance', () => {
  const changelog = new Changelog('My Changelog');
  expect(updater(changelog.toString(), depName, '0', '1', true)).toMatchInlineSnapshot(`
    "# My Changelog

    All notable changes to this project will be documented in this file.

    The format is based on [Keep a Changelog](http://keepachangelog.com/)
    and this project adheres to [Semantic Versioning](http://semver.org/).

    ## Unreleased
    ### Changed
    - Lock file maintenance
    "
  `);
});
