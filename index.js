const getOpen = require('./lib/getOpen');
const getGitConfig = require('./lib/getGitConfig');
const getCommands = require('./lib/getCommands');
const { title, errorTitle, setupUrl } = require('./lib/constants');

let open = {};
exports.onWindow = win => {
  open = getOpen(win);
};

let commands;
const checkForMissingSettings = () => {
  const config = getGitConfig();
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
          ],
        }
      );
      return newItem;
    }
  );
};
