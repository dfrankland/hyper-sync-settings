import { MenuItemConstructorOptions, shell } from 'electron';
import { ensureDir } from 'fs-extra';
import checkForMissingSettings, {
  ConfigAndCommands,
} from './lib/checkForMissingSettings';
import {
  GIST_URL,
  DIR_REPO,
  FILE_CONFIG,
  POSSIBLE_ACCELERATORS,
  Accelerators,
  SyncSettings,
  hyperApp,
} from './constants';

type ValueOf<T> = T[keyof T];

const defaultAccelerators: Partial<SyncSettings['accelerators']> = {};

export default (
  menu: MenuItemConstructorOptions[] = [],
): MenuItemConstructorOptions[] => {
  // Proactively notify about missing settings
  (async (): Promise<void> => {
    await hyperApp.whenReady();
    checkForMissingSettings();
  })();

  const checkAndCallback = (
    callback: (gitConfig: ConfigAndCommands) => void,
  ): NonNullable<MenuItemConstructorOptions['click']> => async (): Promise<
    void
  > => {
    const commandsAndConfig = await checkForMissingSettings();
    if (commandsAndConfig === null) return;
    callback(commandsAndConfig);
  };

  checkAndCallback(({ commands }: ConfigAndCommands): void => {
    commands.checkForUpdates();
  });

  const {
    syncSettings: {
      accelerators: syncSettingsAccelerators = defaultAccelerators,
    } = {},
  } = hyperApp.config.getConfig();

  const accelerators: Partial<
    Record<Accelerators, { accelerator: ValueOf<SyncSettings['accelerators']> }>
  > = POSSIBLE_ACCELERATORS.reduce(
    (
      allAccelerators: Partial<
        Record<
          Accelerators,
          { accelerator: ValueOf<SyncSettings['accelerators']> }
        >
      >,
      nextKey: Accelerators,
    ): Partial<
      Record<
        Accelerators,
        { accelerator: ValueOf<SyncSettings['accelerators']> }
      >
    > => {
      const accelerator = syncSettingsAccelerators[nextKey];
      return {
        ...allAccelerators,
        [nextKey]: accelerator ? { accelerator } : {},
      };
    },
    {},
  );

  const newMenu = menu.map(
    (item: MenuItemConstructorOptions): MenuItemConstructorOptions => {
      if (item.label !== 'Plugins') return item;
      return {
        ...item,
        submenu: [
          ...(Array.isArray(item.submenu) ? item.submenu : []),
          {
            label: 'Sync Settings',
            type: 'submenu',
            submenu: [
              {
                label: 'Check for Updates',
                click: checkAndCallback(
                  ({ commands }: ConfigAndCommands): void => {
                    commands.checkForUpdates();
                  },
                ),
                ...accelerators.checkForUpdates,
              },
              {
                label: 'Backup Settings',
                click: checkAndCallback(
                  ({ commands }: ConfigAndCommands): void => {
                    commands.tryToBackup();
                  },
                ),
                ...accelerators.backupSettings,
              },
              {
                label: 'Restore Settings',
                click: checkAndCallback(
                  ({ commands }: ConfigAndCommands): void => {
                    commands.tryToRestore();
                  },
                ),
                ...accelerators.restoreSettings,
              },
              {
                label: 'Open',
                type: 'submenu',
                submenu: [
                  {
                    label: 'Gist',
                    click: (...args): void => {
                      checkAndCallback(
                        ({ config }: ConfigAndCommands): void => {
                          if (config.url) {
                            shell.openExternal(config.url);
                            return;
                          }

                          if (config.gistId) {
                            shell.openExternal(GIST_URL(config.gistId));
                            return;
                          }

                          shell.openExternal('https://gist.github.com');
                        },
                      )(...args);
                    },
                    ...accelerators.openGist,
                  },
                  {
                    label: 'Repo',
                    click: async (): Promise<void> => {
                      await ensureDir(DIR_REPO());
                      shell.openItem(DIR_REPO());
                    },
                    ...accelerators.openRepo,
                  },
                  {
                    label: 'Configuration',
                    click: (): void => {
                      shell.openItem(FILE_CONFIG());
                    },
                    ...accelerators.openConfiguration,
                  },
                ],
              },
            ],
          },
        ],
      };
    },
  );

  return newMenu;
};
