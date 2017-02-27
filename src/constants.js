import { homedir } from 'os';
import { resolve as resolvePath } from 'path';

export const gistUrl = (gistId, token) => (
  `https://${token ? `${token}@` : ''}gist.github.com/${gistId}.git`
);

export const title = 'hyper-sync-settings';
export const errorTitle = `${title} error 🔥`;
export const setupUrl = 'https://github.com/dfrankland/hyper-sync-settings#setup';

const home = homedir();
const repo = resolvePath(home, './.hyper_plugins/.hyper-sync-settings');
export const paths = {
  dirs: { home, repo },
  files: {
    config: resolvePath(home, './.hyper_plugins/.hyper-sync-settings.json'),
    configTemplate: resolvePath(__dirname, './config.default.json'),
    backup: resolvePath(repo, './.hyper.js'),
    restore: resolvePath(home, './.hyper.js'),
  },
};
