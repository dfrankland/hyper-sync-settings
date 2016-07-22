const NodeGit = require('nodegit');
const fs = require('bluebird').promisifyAll(require('fs-extra'));
const { paths, gistUrl } = require('./constants');

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
    config = require(paths.files.config);
  } catch (err) {
    console.error(
      `hyperterm-sync-settings: error 🔥 no config file found in \`${
        paths.files.config
      }\`, creating one`
    );
    fs.copySync(paths.files.configTemplate, paths.files.config);
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

  const url = `https://gist.github.com/${gistId}.git`;

  const repoPromise = (
    fs
      .ensureDirAsync(paths.dirs.repo)
      .then(
        () =>
          NodeGit
            .Clone(url, paths.dirs.repo, options)
            .catch(
              error =>
                NodeGit
                  .Repository
                  .open(paths.dirs.repo)
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
    url,
    repoPromise,
    options,
    fs,
  };
};
