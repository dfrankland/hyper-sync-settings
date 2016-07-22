const getOpen = require('./lib/getOpen');
const getGitConfig = require('./lib/getGitConfig');
const getCommands = require('./lib/getCommands');
const { title, errorTitle, setupUrl, paths, gistUrl } = require('./lib/constants');

let open = {};
exports.onWindow = win => {
  open = getOpen(win);
};

let commands;
let config;
const checkForMissingSettings = () => {
  config = getGitConfig();
  const { personalAccessToken, gistId } = config;

  if (personalAccessToken && gistId) {
    commands = getCommands(config, open.notification);
    return true;
  } else {
    if (!personalAccessToken && !gistId) {
      open.notification(
        errorTitle,
        'Settings not found! Click for more info.',
        setupUrl
      );
    } else {
      if (!personalAccessToken) {
        open.notification(
          errorTitle,
          '`personalAccessToken` not set! Click for more info.',
          setupUrl
        );
      }

      if (!gistId) {
        open.notification(
          errorTitle,
          '`gistId` not set! Click for more info.',
          setupUrl
        );
      }
    }

    return false;
  }
};

exports.decorateMenu = menu => {
  if (checkForMissingSettings()) commands.checkForUpdates();
  return menu.map(
    item => {
      if (item.label !== 'Plugins') return item;
      const newItem = Object.assign({}, item);
      newItem.submenu = newItem.submenu.concat(
        {
          label: 'Sync Settings',
          type: 'submenu',
          submenu: [
            {
              label: 'Check for Updates',
              click: () => {
                if (!checkForMissingSettings()) return;
                commands.checkForUpdates();
              },
            },
            {
              label: 'Backup Settings',
              click: () => {
                if (!checkForMissingSettings()) return;
                commands.tryToBackup();
              },
            },
            {
              label: 'Restore Settings',
              click: () => {
                if (!checkForMissingSettings()) return;
                commands.tryToRestore();
              },
            },
            {
              label: 'Open',
              type: 'submenu',
              submenu: [
                {
                  label: 'Gist',
                  click: () => {
                    open.window(config ? config.url : gistUrl);
                  },
                },
                {
                  label: 'Repo',
                  click: () => {
                    open.item(paths.dirs.repo);
                  },
                },
                {
                  label: 'Configuration',
                  click: () => {
                    open.item(paths.files.config);
                  },
                },
              ],
            },
          ],
        }
      );
      return newItem;
    }
  );
};
