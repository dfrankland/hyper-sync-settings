import { TITLE, ERROR_TITLE, SyncSettings } from '../../constants';
import updates from './updates';
import restore from './restore';
import backup from './backup';
import { GitConfig } from '../getGitConfig';
import { Open } from '../getOpen';

export interface Commands {
  checkForUpdates: () => Promise<void>;
  tryToBackup: () => Promise<void>;
  tryToRestore: () => Promise<void>;
}

export default (
  config: GitConfig,
  open: Open,
  { quiet }: SyncSettings,
): Commands => {
  const catchError = (err: Error): void => {
    open.notification(ERROR_TITLE, err.message);
    throw err;
  };

  const notify = (emoji: string, message: string): void | string =>
    open.notification(`${TITLE} ${emoji}`, message, config.url);

  return {
    checkForUpdates: async (): Promise<void> => {
      const isUpdated = await updates(config).catch(catchError);

      if (isUpdated) {
        notify('❗️', 'Your settings need to be updated.');
      } else if (!quiet) {
        notify('👍', 'Your settings are up to date.');
      }
    },
    tryToBackup: async (): Promise<void> => {
      await backup(config).catch(catchError);
      notify('🔜', 'Your settings have been saved.');
    },
    tryToRestore: async (): Promise<void> => {
      await restore(config).catch(catchError);
      notify('🔙', 'Your settings have been restored.');
    },
  };
};
