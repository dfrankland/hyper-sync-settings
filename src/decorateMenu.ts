import { MenuItemConstructorOptions } from 'electron';
import checkForMissingSettings, {
  ConfigAndCommands,
} from './lib/checkForMissingSettings';
import { Open } from './lib/getOpen';
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
  open: Open,
  menu: MenuItemConstructorOptions[] = [],
): MenuItemConstructorOptions[] => {
  const checkAndCallback = (
    callback: (gitConfig: ConfigAndCommands) => void,
  ): (() => void) => (): void => {
    const commandsAndConfig = checkForMissingSettings(open);
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

  return menu.map(
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
                    click: checkAndCallback(
                      ({ config }: ConfigAndCommands): void => {
                        if (config.url) {
                          open.window(config.url);
                          return;
                        }

                        if (config.gistId) {
                          open.window(GIST_URL(config.gistId));
                          return;
                        }

                        open.window('https://gist.github.com');
                      },
                    ),
                    ...accelerators.openGist,
                  },
                  {
                    label: 'Repo',
                    click: (): void => {
                      open.item(DIR_REPO);
                    },
                    ...accelerators.openRepo,
                  },
                  {
                    label: 'Configuration',
                    click: (): void => {
                      open.item(FILE_CONFIG);
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
};
