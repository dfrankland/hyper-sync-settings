import { app } from 'electron';
import checkForMissingSettings from './lib/checkForMissingSettings';
import { gistUrl, paths, possibleAccelerators } from './constants';

export default (open, menu = []) => {
  const checkAndCallback = callback => () => {
    const commandsAndConfig = checkForMissingSettings(open);
    if (commandsAndConfig === false) return;
    callback(commandsAndConfig);
  };

  checkAndCallback(({ commands }) => commands.checkForUpdates());

  const { accelerators: syncSettingsAccelerators = {} } = app.config.getConfig().syncSettings || {};
  const accelerators = possibleAccelerators.reduce(
    (allAccelerators, nextKey) => {
      const accelerator = syncSettingsAccelerators[nextKey];
      return {
        ...allAccelerators,
        [nextKey]: accelerator ? { accelerator } : {},
      };
    },
    {},
  );

  return menu.map(
    item => {
      if (item.label !== 'Plugins') return item;
      return {
        ...item,
        submenu: [
          ...item.submenu,
          {
            label: 'Sync Settings',
            type: 'submenu',
            submenu: [
              {
                label: 'Check for Updates',
                click: checkAndCallback(({ commands }) => commands.checkForUpdates()),
                ...accelerators.checkForUpdates,
              },
              {
                label: 'Backup Settings',
                click: checkAndCallback(({ commands }) => commands.tryToBackup()),
                ...accelerators.backupSettings,
              },
              {
                label: 'Restore Settings',
                click: checkAndCallback(({ commands }) => commands.tryToRestore()),
                ...accelerators.restoreSettings,
              },
              {
                label: 'Open',
                type: 'submenu',
                submenu: [
                  {
                    label: 'Gist',
                    click: checkAndCallback(
                      ({ config }) => open.window(config ? config.url : gistUrl),
                    ),
                    ...accelerators.openGist,
                  },
                  {
                    label: 'Repo',
                    click: () => open.item(paths.dirs.repo),
                    ...accelerators.openRepo,
                  },
                  {
                    label: 'Configuration',
                    click: () => open.item(paths.files.config),
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
