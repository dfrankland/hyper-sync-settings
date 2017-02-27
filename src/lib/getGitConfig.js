import simpleGit from 'simple-git';
import fs from './fs';
import { paths, gistUrl, errorTitle } from '../constants';

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
    config = require(paths.files.config); // eslint-disable-line import/no-dynamic-require, global-require, max-len
  } catch (err) {
    console.error( // eslint-disable-line no-console
      `hyper-sync-settings: error 🔥 no config file found in \`${
        paths.files.config
      }\`, creating one`,
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

export default () => {
  const { personalAccessToken, gistId } = config;

  if (!personalAccessToken || !gistId) return config;

  const remoteUrl = gistUrl(gistId, personalAccessToken);

  const repoPromise = (
    async () => {
      await fs.ensureDirAsync(paths.dirs.repo);
      return new Promise(
        resolve => {
          simpleGit(paths.dirs.repo).clone(
            remoteUrl,
            paths.dirs.repo,
            (error) => {
              resolve();
              if (error) console.error(`${errorTitle} ${error}`); // eslint-disable-line no-console
            },
          );
        },
      );
    }
  )();

  return {
    ...config,
    url: gistUrl(gistId),
    remoteUrl,
    repoPromise,
  };
};
