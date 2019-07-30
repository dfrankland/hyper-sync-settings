import { TITLE, ERROR_TITLE, SyncSettings } from '../../constants';
import updates from './updates';
import restore from './restore';
import backup from './backup';
import { GitConfig } from '../getGitConfig';
import notify from '../notify';

export interface Commands {
  checkForUpdates: () => Promise<void>;
  tryToBackup: () => Promise<void>;
  tryToRestore: () => Promise<void>;
}

export default (config: GitConfig, { quiet }: SyncSettings): Commands => {
  const catchError = (err: Error): void => {
    notify({ title: ERROR_TITLE, body: err.message, level: 'error' });
    throw err;
  };

  const notifyMsg = (emoji: string, message: string): void | string =>
    notify({
      title: `${TITLE} ${emoji}`,
      body: message,
      url: config.url,
      level: 'info',
    });

  return {
    checkForUpdates: async (): Promise<void> => {
      const isUpdated = await updates(config).catch(catchError);

      if (isUpdated) {
        notifyMsg('❗️', 'Your settings need to be updated.');
      } else if (!quiet) {
        notifyMsg('👍', 'Your settings are up to date.');
      }
    },
    tryToBackup: async (): Promise<void> => {
      await backup(config).catch(catchError);
      notifyMsg('🔜', 'Your settings have been saved.');
    },
    tryToRestore: async (): Promise<void> => {
      await restore(config).catch(catchError);
      notifyMsg('🔙', 'Your settings have been restored.');
    },
  };
};
