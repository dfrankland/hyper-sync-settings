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
      () => config.fs.copyAsync(
        config.locations.backupFile,
        config.locations.restoreFile
      )
    );
