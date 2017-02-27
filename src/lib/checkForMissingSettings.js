import { app } from 'electron';
import getGitConfig from './getGitConfig';
import getCommands from './getCommands';
import { errorTitle, setupUrl } from '../constants';

export default open => {
  const config = getGitConfig();
  const { personalAccessToken, gistId } = config;
  const hyperConfig = app.config.getConfig().syncSettings || { quiet: false };

  if (personalAccessToken && gistId) {
    const commands = getCommands(config, open, hyperConfig);
    return { config, commands };
  }

  const notify = message => open.notification(errorTitle, message, setupUrl);

  if (!personalAccessToken && !gistId) {
    notify('Settings not found! Click for more info.');
    return false;
  }

  if (!personalAccessToken) notify('`personalAccessToken` not set! Click for more info.');
  if (!gistId) notify('`gistId` not set! Click for more info.');
  return false;
};
