const getNotify = require('./lib/getNotify');
const getGitConfig = require('./lib/getGitConfig');
const restore = require('./lib/restore');
const backup = require('./lib/backup');
const constants = require('./lib/constants');

const { title, errorTitle, setupUrl } = constants;

let notify = () => console.error(`${errorTitle}: \`notify\` function not set.`);
exports.onWindow = getNotify(notifier => {
  if (notifier) notify = notifier;
});

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
              label: 'Backup Settings',
              click: () => {
                if (!checkForMissingSettings()) return;
                backup(config)
                  .then(
                    () => notify(
                      `${title} 🔜`,
                      'Your settings have been saved.',
                      config.url
                    )
                  )
                  .catch(catchError);
              },
            },
            {
              label: 'Restore Settings',
              click: () => {
                if (!checkForMissingSettings()) return;
                restore(config)
                  .then(
                    () => notify(
                      `${title} 🔙`,
                      'Your settings have been restored.',
                      config.url
                    )
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
