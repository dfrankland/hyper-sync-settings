const {
  paths: {
    files: {
      restore: restoreFile,
      backup: backupFile,
    },
  },
} = require('../constants');

module.exports = config =>
  config.repoPromise
    .then(
      repo => {
        repo.fetchAll(config.options);
        return repo;
      }
    )
    .then(
      repo => repo.mergeBranches('master', 'origin/master')
    )
    .then(
      () => config.fs.copyAsync(backupFile, restoreFile)
    );
