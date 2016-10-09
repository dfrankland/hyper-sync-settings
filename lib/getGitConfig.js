const NodeGit = require('nodegit');
const fs = require('bluebird').promisifyAll(require('fs-extra'));
const { paths, gistUrl } = require('./constants');

let config = {};

const {
  HYPER_SYNC_SETTINGS_PERSONAL_ACCESS_TOKEN,
  HYPER_SYNC_SETTINGS_GIST_ID,
} = process.env;

if (
  !HYPER_SYNC_SETTINGS_PERSONAL_ACCESS_TOKEN ||
  !HYPER_SYNC_SETTINGS_GIST_ID
) {
  try {
    config = require(paths.files.config);
  } catch (err) {
    console.error(
      `hyper-sync-settings: error 🔥 no config file found in \`${
        paths.files.config
      }\`, creating one`
    );
    fs.copySync(paths.files.configTemplate, paths.files.config);
  }
}

if (HYPER_SYNC_SETTINGS_PERSONAL_ACCESS_TOKEN) {
  config.personalAccessToken = HYPER_SYNC_SETTINGS_PERSONAL_ACCESS_TOKEN;
}

if (HYPER_SYNC_SETTINGS_GIST_ID) {
  config.gistId = HYPER_SYNC_SETTINGS_GIST_ID;
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

  const url = `${gistUrl}${gistId}.git`;

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
                    console.trace('hyper-sync-settings: error 🔥 couldn\'t open repo', error)
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
