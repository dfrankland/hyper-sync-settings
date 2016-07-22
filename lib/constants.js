const { homedir } = require('os');
const { resolve: resolvePath } = require('path');

const title = 'hyperterm-sync-settings';
exports.title = title;

const errorTitle = `${title} error 🔥`;
exports.errorTitle = errorTitle;

const setupUrl = 'https://github.com/dfrankland/hyperterm-sync-settings#setup';
exports.setupUrl = setupUrl;

const paths = { dirs: {} };
paths.dirs.home = homedir();
paths.dirs.repo = resolvePath(paths.dirs.home, './.hyperterm_plugins/.hyperterm-sync-settings');
paths.files = {
  config: resolvePath(paths.dirs.home, './.hyperterm_plugins/.hyperterm-sync-settings.json'),
  configTemplate: resolvePath(__dirname, './config.default.json'),
  backup: resolvePath(paths.dirs.repo, './.hyperterm.js'),
  restore: resolvePath(paths.dirs.home, './.hyperterm.js'),
};
exports.paths = paths;

exports.gistUrl = 'https://gist.github.com/';
