import checkForMissingSettings from './lib/checkForMissingSettings';
import { gistUrl, paths } from './constants';

export default (open, menu = []) => {
  const checkAndCallback = callback => () => {
    const commandsAndConfig = checkForMissingSettings(open);
    if (commandsAndConfig === false) return;
    callback(commandsAndConfig);
  };

  checkAndCallback(({ commands }) => commands.checkForUpdates());

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
              },
              {
                label: 'Backup Settings',
                click: checkAndCallback(({ commands }) => commands.tryToBackup()),
              },
              {
                label: 'Restore Settings',
                click: checkAndCallback(({ commands }) => commands.tryToRestore()),
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
                  },
                  {
                    label: 'Repo',
                    click: () => open.item(paths.dirs.repo),
                  },
                  {
                    label: 'Configuration',
                    click: () => open.item(paths.files.config),
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
