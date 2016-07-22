module.exports = config =>
  config.fs.copyAsync(
    config.locations.restoreFile,
    config.locations.backupFile,
    { clobber: true }
  )
    .then(
      () =>
        config.repoPromise
          .then(
            repo =>
              repo
                .createCommitOnHead(
                  ['.hyperterm.js'],
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
