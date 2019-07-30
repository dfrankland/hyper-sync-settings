import { app, App } from 'electron';
import { ERROR_TITLE, SETUP_URL, SyncSettings } from '../constants';
import getGitConfig, { GitConfig } from './getGitConfig';
import getCommands, { Commands } from './getCommands';
import notify from './notify';

export interface ConfigAndCommands {
  config: GitConfig;
  commands: Commands;
}

const hyperApp: App & {
  config?: { getConfig?: () => { syncSettings?: SyncSettings } };
} = app;

export default (): null | ConfigAndCommands => {
  const notifyErr = (message: string): void | string =>
    notify({
      title: ERROR_TITLE,
      body: message,
      url: SETUP_URL,
      level: 'error',
    });

  if (!hyperApp.config || typeof hyperApp.config.getConfig !== 'function') {
    throw new Error(
      '`app` from `electron` does not have the `config` object from Hyper!',
    );
  }

  const config = getGitConfig();
  const { personalAccessToken, gistId } = config;
  const hyperConfig = hyperApp.config.getConfig().syncSettings || {
    quiet: false,
  };

  if (personalAccessToken && gistId) {
    const commands = getCommands(config, hyperConfig);
    return { config, commands };
  }

  if (!personalAccessToken && !gistId) {
    notifyErr('Settings not found! Click for more info.');
    return null;
  }

  if (!personalAccessToken) {
    notifyErr('`personalAccessToken` not set! Click for more info.');
  }

  if (!gistId) {
    notifyErr('`gistId` not set! Click for more info.');
  }

  return null;
};
