const os = require('os');
const path = require('path');
const NodeGit = require('nodegit');
const fs = require('bluebird').promisifyAll(require('fs-extra'));

const homeDir = os.homedir();
const repoDir = path.resolve(homeDir, './.hyperterm_plugins/.hyperterm-sync-settings');
const configFile = path.resolve(homeDir, './.hyperterm_plugins/.hyperterm-sync-settings.json');
const configDefaultFile = path.resolve(__dirname, './config.default.json');

let config = {};

const {
  HYPERTERM_SYNC_SETTINGS_PERSONAL_ACCESS_TOKEN,
  HYPERTERM_SYNC_SETTINGS_GIST_ID,
} = process.env;

if (
  !HYPERTERM_SYNC_SETTINGS_PERSONAL_ACCESS_TOKEN ||
  !HYPERTERM_SYNC_SETTINGS_GIST_ID
) {
  try {
    config = require(configFile);
  } catch (err) {
    console.error(
      `hyperterm-sync-settings: error 🔥 no config file found in \`${configFile}\`, creating one`
    );
    fs.copySync(configDefaultFile, configFile);
  }
}

if (HYPERTERM_SYNC_SETTINGS_PERSONAL_ACCESS_TOKEN) {
  config.personalAccessToken = HYPERTERM_SYNC_SETTINGS_PERSONAL_ACCESS_TOKEN;
}

if (HYPERTERM_SYNC_SETTINGS_GIST_ID) {
  config.gistId = HYPERTERM_SYNC_SETTINGS_GIST_ID;
}

module.exports = () => {
  const { personalAccessToken, gistId } = config;

  if (!personalAccessToken || !gistId) return config;

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
                    console.trace('hyperterm-sync-settings: error 🔥 couldn\'t open repo', error)
                  )
            )
      )
  );

  return {
    personalAccessToken,
    gistId,
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
