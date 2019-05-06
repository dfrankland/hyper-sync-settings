import { app } from 'electron';
import { homedir } from 'os';
import { resolve as resolvePath } from 'path';

export const gistUrl = (gistId, token) => (
  `https://${token ? `${token}@` : ''}gist.github.com/${gistId}.git`
);

export const title = 'hyper-sync-settings';
export const errorTitle = `${title} error 🔥`;
export const setupUrl = 'https://github.com/dfrankland/hyper-sync-settings#setup';

// If the user defines XDG_CONFIG_HOME they definitely want their config there,
// otherwise use the home directory in linux/mac and userdata in windows
const home =
  process.env.XDG_CONFIG_HOME !== undefined
    ? join(process.env.XDG_CONFIG_HOME, 'hyper')
    : process.platform == 'win32' ? app.getPath('userData') : homedir();

const repo = resolvePath(applicationDirectory, './.hyper_plugins/.hyper-sync-settings');

export const paths = {
  dirs: { home, repo },
  files: {
    config: resolvePath(home, './.hyper_plugins/.hyper-sync-settings.json'),
    configTemplate: resolvePath(__dirname, './config.default.json'),
    backup: resolvePath(repo, './.hyper.js'),
    restore: resolvePath(home, './.hyper.js'),
  },
};

export const possibleAccelerators = [
  'checkForUpdates',
  'backupSettings',
  'restoreSettings',
  'openGist',
  'openRepo',
  'openConfiguration',
];
