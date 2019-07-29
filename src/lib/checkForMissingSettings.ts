import { app, App } from 'electron';
import { ERROR_TITLE, SETUP_URL, SyncSettings } from '../constants';
import getGitConfig, { GitConfig } from './getGitConfig';
import getCommands, { Commands } from './getCommands';
import { Open } from './getOpen';

export interface ConfigAndCommands {
  config: GitConfig;
  commands: Commands;
}

const hyperApp: App & {
  config?: { getConfig?: () => { syncSettings?: SyncSettings } };
} = app;

export default (open: Open): null | ConfigAndCommands => {
  const notify = (message: string): void | string =>
    open.notification(ERROR_TITLE, message, SETUP_URL);

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
    const commands = getCommands(config, open, hyperConfig);
    return { config, commands };
  }

  if (!personalAccessToken && !gistId) {
    notify('Settings not found! Click for more info.');
    return null;
  }

  if (!personalAccessToken) {
    notify('`personalAccessToken` not set! Click for more info.');
  }

  if (!gistId) {
    notify('`gistId` not set! Click for more info.');
  }

  return null;
};
