const getNotify = require('./lib/getNotify');
const getGitConfig = require('./lib/getGitConfig');
const getCommands = require('./lib/getCommands');
const { title, errorTitle, setupUrl } = require('./lib/constants');

let notify = () => console.error(`${errorTitle}: \`notify\` function not set.`);
exports.onWindow = getNotify(notifier => {
  if (notifier) notify = notifier;
});

let commands;
const checkForMissingSettings = () => {
  const config = getGitConfig();
  const { personalAccessToken, gistId } = config;

  if (personalAccessToken && gistId) {
    commands = getCommands(config, notify);
    return true;
  } else {
    if (!personalAccessToken && !gistId) {
      notify(
        errorTitle,
        'Settings not found! Click for more info.',
        setupUrl
      );
    } else {
      if (!personalAccessToken) {
        notify(
          errorTitle,
          '`personalAccessToken` not set! Click for more info.',
          setupUrl
        );
      }

      if (!gistId) {
        notify(
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
