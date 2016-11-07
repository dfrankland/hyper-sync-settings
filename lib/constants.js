const { homedir } = require('os');
const { resolve: resolvePath } = require('path');

const title = 'hyper-sync-settings';
exports.title = title;

const errorTitle = `${title} error 🔥`;
exports.errorTitle = errorTitle;

const setupUrl = 'https://github.com/dfrankland/hyper-sync-settings#setup';
exports.setupUrl = setupUrl;

const paths = { dirs: {} };
paths.dirs.home = homedir();
paths.dirs.repo = resolvePath(paths.dirs.home, './.hyper_plugins/.hyper-sync-settings');
paths.files = {
  config: resolvePath(paths.dirs.home, './.hyper_plugins/.hyper-sync-settings.json'),
  configTemplate: resolvePath(__dirname, './config.default.json'),
  backup: resolvePath(paths.dirs.repo, './.hyper.js'),
  restore: resolvePath(paths.dirs.home, './.hyper.js'),
};
exports.paths = paths;

exports.gistUrl = 'https://gist.github.com/';
