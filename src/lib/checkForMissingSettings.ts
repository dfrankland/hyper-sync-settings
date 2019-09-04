import { ERROR_TITLE, SETUP_URL, getHyperApp } from '../constants';
import getGitConfig, { GitConfig } from './getGitConfig';
import getCommands, { Commands } from './getCommands';
import notify from './notify';

export interface ConfigAndCommands {
  config: GitConfig;
  commands: Commands;
}

export default async (): Promise<null | ConfigAndCommands> => {
  const notifyErr = (message: string): void | string =>
    notify({
      title: ERROR_TITLE,
      body: message,
      url: SETUP_URL,
      level: 'error',
    });

  if (
    !getHyperApp().config ||
    typeof getHyperApp().config.getConfig !== 'function'
  ) {
    throw new Error(
      '`app` from `electron` does not have the `config` object from Hyper!',
    );
  }

  const config = await getGitConfig();
  const { personalAccessToken, gistId } = config;
  const hyperConfig = getHyperApp().config.getConfig().syncSettings || {
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
