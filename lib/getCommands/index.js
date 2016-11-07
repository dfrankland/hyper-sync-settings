const { title, errorTitle } = require('../constants');
const updates = require('./updates');
const restore = require('./restore');
const backup = require('./backup');

module.exports = (config, notify, hyperConfig) => {
  const catchError = err => {
    console.trace(err);
    notify(errorTitle, err);
  };

  return {
    checkForUpdates: () =>
      updates(config)
        .then(
          isUpdated => {
            if (isUpdated) {
              notify(
                `${title} ❗️`,
                'Your settings need to be updated.',
                config.url
              );
            } else if (!hyperConfig.quiet) {
              notify(
                `${title} 👍`,
                'Your settings are up to date.',
                config.url
              );
            }
          }
        )
        .catch(catchError),
    tryToBackup: () =>
      backup(config)
        .then(
          () => notify(
            `${title} 🔜`,
            'Your settings have been saved.',
            config.url
          )
        )
        .catch(catchError),
    tryToRestore: () =>
      restore(config)
        .then(
          () => notify(
            `${title} 🔙`,
            'Your settings have been restored.',
            config.url
          )
        )
        .catch(catchError),
  };
};
