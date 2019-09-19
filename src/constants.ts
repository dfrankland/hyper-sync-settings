// eslint-disable-next-line import/no-extraneous-dependencies
import { app, App } from 'electron';
import { homedir } from 'os';
import { resolve as resolvePath } from 'path';

export interface SyncSettings {
  quiet?: boolean;
  accelerators?: Record<Accelerators, string>;
}

export type HyperApp = App & {
  config: { getConfig: () => { syncSettings?: SyncSettings } };
};

export const getHyperApp = (): HyperApp => {
  if (!app) {
    throw new Error('electron app is undefined');
  }
  (async (): Promise<void> => {
    await app.whenReady();
  })();
  return app as HyperApp;
};

export const GIST_URL = (gistId: string, token?: string): string =>
  `https://${token ? `${token}@` : ''}gist.github.com/${gistId}.git`;

export const TITLE = 'hyper-sync-settings';
export const ERROR_TITLE = `${TITLE} error 🔥`;
export const SETUP_URL =
  'https://github.com/dfrankland/hyper-sync-settings#setup';

// If the user defines XDG_CONFIG_HOME they definitely want their config there,
// otherwise use the home directory in linux/mac and userdata in windows
export const DIR_HOME = (): string => {
  if (typeof process.env.XDG_CONFIG_HOME !== 'undefined') {
    return resolvePath(process.env.XDG_CONFIG_HOME, 'hyper');
  }

  return process.platform === 'win32'
    ? getHyperApp().getPath('userData')
    : homedir();
};

export const DIR_REPO = (): string =>
  resolvePath(DIR_HOME(), '.hyper_plugins', '.hyper-sync-settings');

export const FILE_CONFIG = (): string =>
  resolvePath(DIR_HOME(), '.hyper_plugins', '.hyper-sync-settings.json');

export const FILE_CONFIG_TEMPLATE = resolvePath(
  __dirname,
  'config.default.json',
);
export const FILE_BACKUP = (): string => resolvePath(DIR_REPO(), '.hyper.js');

export const FILE_RESTORE = (): string => resolvePath(DIR_HOME(), '.hyper.js');

export type Accelerators =
  | 'checkForUpdates'
  | 'backupSettings'
  | 'restoreSettings'
  | 'openGist'
  | 'openRepo'
  | 'openConfiguration';

export const POSSIBLE_ACCELERATORS: [
  'checkForUpdates',
  'backupSettings',
  'restoreSettings',
  'openGist',
  'openRepo',
  // eslint-disable-next-line prettier/prettier
  'openConfiguration',
] = [
  'checkForUpdates',
  'backupSettings',
  'restoreSettings',
  'openGist',
  'openRepo',
  'openConfiguration',
];
