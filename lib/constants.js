const os = require('os');
const path = require('path');

const title = 'hyperterm-sync-settings';
exports.title = title;

const errorTitle = `${title} error 🔥`;
exports.errorTitle = errorTitle;

const setupUrl = 'https://github.com/dfrankland/hyperterm-sync-settings#setup';
exports.setupUrl = setupUrl;

const paths = {
  dirs: {
    home: os.homedir(),
    repo: path.resolve(paths.dirs.home, './.hyperterm_plugins/.hyperterm-sync-settings'),
  },
  files: {
    config: path.resolve(paths.dirs.home, './.hyperterm_plugins/.hyperterm-sync-settings.json'),
    configTemplate: path.resolve(__dirname, './config.default.json'),
    backup: path.resolve(paths.dirs.repo, './.hyperterm.js'),
    restore: path.resolve(paths.dirs.home, './.hyperterm.js'),
  },
};
exports.paths = paths;

exports.gistUrl = 'https://gist.github.com/';
