const os = require('os');
const path = require('path');
const NodeGit = require('nodegit');
const fs = require('bluebird').promisifyAll(require('fs-extra'));

const homeDir = os.homedir();
const repoDir = path.resolve(homeDir, './.hyperterm_plugins/hyperterm-sync-settings');

module.exports = config => {
  const { personalAccessToken, gistId } = config;
  const credentials = (
    NodeGit
      .Cred
      .userpassPlaintextNew(personalAccessToken, 'x-oauth-basic')
  );
  const options = {
    fetchOpts: {
      callbacks: {
        certificateCheck: () => 1,
        credentials: () => credentials,
      },
    },
  };

  const repoPromise = (
    fs
      .ensureDirAsync(repoDir)
      .then(
        () =>
          NodeGit
            .Clone(
              `https://gist.github.com/${gistId}.git`,
              repoDir,
              options
            )
            .catch(
              error =>
                NodeGit
                  .Repository
                  .open(repoDir)
                  .catch(
                    error =>
                    console.trace('hyperterm-sync: error 🔥 couldn\'t open repo', error)
                  )
            )
      )
  );

  return {
    locations: {
      homeDir,
      repo: repoDir,
      backupFile: path.resolve(repoDir, './.hyperterm.js'),
      restoreFile: path.resolve(homeDir, './.hyperterm.js'),
    },
    repoPromise,
    options,
    fs,
  };
};
