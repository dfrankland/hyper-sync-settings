const moment = require('moment');

module.exports = config =>
  config.repoPromise
    .then(
      repo => {
        repo.fetchAll(config.options);
        return repo;
      }
    )
    .then(
      repo =>
        repo
          .getBranchCommit('master')
          .then(
            commit => ({ repo, commits: { local: commit } })
          )
    )
    .then(
      ({ repo, commits }) =>
        repo
          .getBranchCommit('origin/master')
          .then(
            commit => {
              commits.remote = commit;
              return commits;
            }
          )
    )
    .then(
      ({ local, remote }) => {
        if (
          moment(remote.time()).isAfter(local.time()) &&
          local.sha() !== remote.sha()
        ) {
          return true;
        }

        return false;
      }
    );
