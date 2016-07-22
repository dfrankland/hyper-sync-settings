const getNotify = require('./lib/getNotify');
const getGitConfig = require('./lib/getGitConfig');
const restore = require('./lib/restore');
const backup = require('./lib/backup');

const title = 'hyperterm-sync-settings';
exports.title = title;

const errorTitle = `${title} error 🔥`;
exports.errorTitle = errorTitle;

let notify = () => console.error(`${errorTitle}: \`notify\` function not set.`);
exports.onWindow = getNotify(notifier => {
  if (notifier) notify = notifier;
});

const openSetup = `event => {
  const { shell } = require('electron');
  shell.openExternal('https://github.com/dfrankland/hyperterm-sync-settings#setup');
}`;

let config;
const checkForMissingSettings = () => {
  config = getGitConfig();
  const { personalAccessToken, gistId } = config;

  if (personalAccessToken && gistId) {
    return true;
  } else {
    if (!personalAccessToken && !gistId) {
      notify(
        errorTitle,
        'Settings not found! Click for more info.',
        openSetup
      );
    } else {
      if (!personalAccessToken) {
        notify(
          errorTitle,
          '`personalAccessToken` not set! Click for more info.',
          openSetup
        );
      }

      if (!gistId) {
        notify(
          errorTitle,
          '`gistId` not set! Click for more info.',
          openSetup
        );
      }
    }

    return false;
  }
};

const catchError = err => {
  console.trace(err);
  notify(errorTitle, err);
};

exports.decorateMenu = menu => {
  checkForMissingSettings();
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
              label: 'Backup',
              click: () => {
                if (!checkForMissingSettings()) return;
                backup(config)
                  .then(
                    () => notify(`${title} 🔜`, 'Your settings have been saved.')
                  )
                  .catch(catchError);
              },
            },
            {
              label: 'Restore',
              click: () => {
                if (!checkForMissingSettings()) return;
                restore(config)
                  .then(
                    () => notify(`${title} 🔙`, 'Your settings have been restored.')
                  )
                  .catch(catchError);
              },
            },
          ],
        }
      );
      return newItem;
    }
  );
};
