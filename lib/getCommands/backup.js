const {
  paths: {
    files: {
      restore: restoreFile,
      backup: backupFile,
    },
  },
} = require('../constants');

module.exports = config =>
  config.fs
    .copyAsync(restoreFile, backupFile, { clobber: true })
    .then(
      () =>
        config.repoPromise
          .then(
            repo =>
              repo
                .createCommitOnHead(
                  ['.hyper.js'],
                  repo.defaultSignature(),
                  repo.defaultSignature(),
                  `${new Date()}`
                )
                .then(
                  commit => repo
                )
          )
          .then(
            repo =>
              repo
                .getRemote('origin')
          )
          .then(
            remote =>
              remote
                .push(
                  ['refs/heads/master:refs/heads/master'],
                  config.options.fetchOpts
                )
          )
    );
