import { title, errorTitle } from '../../constants';
import updates from './updates';
import restore from './restore';
import backup from './backup';

export default (config, open, { quiet }) => {
  const catchError = err => {
    open.notification(errorTitle, err);
    throw err;
  };

  const notify = (emoji, message) => open.notification(`${title} ${emoji}`, message, config.url);

  return {
    checkForUpdates: async () => {
      const isUpdated = await updates(config).catch(catchError);

      if (isUpdated) {
        notify('❗️', 'Your settings need to be updated.');
      } else if (!quiet) {
        notify('👍', 'Your settings are up to date.');
      }
    },
    tryToBackup: async () => {
      await backup(config).catch(catchError);
      notify('🔜', 'Your settings have been saved.');
    },
    tryToRestore: async () => {
      await restore(config).catch(catchError);
      notify('🔙', 'Your settings have been restored.');
    },
  };
};
