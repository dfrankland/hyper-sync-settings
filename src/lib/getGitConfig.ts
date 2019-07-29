import { GitProcess } from 'dugite';
import { copySync, ensureDir } from 'fs-extra';
import {
  FILE_CONFIG,
  FILE_CONFIG_TEMPLATE,
  GIST_URL,
  ERROR_TITLE,
  DIR_REPO,
} from '../constants';

export interface GitConfig {
  url?: string;
  remoteUrl?: string;
  repoPromise?: Promise<void>;
  personalAccessToken?: string;
  gistId?: string;
}

let config: GitConfig = {};

const {
  HYPER_SYNC_SETTINGS_PERSONAL_ACCESS_TOKEN,
  HYPER_SYNC_SETTINGS_GIST_ID,
} = process.env;

if (
  !HYPER_SYNC_SETTINGS_PERSONAL_ACCESS_TOKEN ||
  !HYPER_SYNC_SETTINGS_GIST_ID
) {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    config = require(FILE_CONFIG);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      `hyper-sync-settings: error 🔥 no config file found in \`${FILE_CONFIG}\`, creating one`,
    );
    copySync(FILE_CONFIG_TEMPLATE, FILE_CONFIG);
  }
}

if (HYPER_SYNC_SETTINGS_PERSONAL_ACCESS_TOKEN) {
  config.personalAccessToken = HYPER_SYNC_SETTINGS_PERSONAL_ACCESS_TOKEN;
}

if (HYPER_SYNC_SETTINGS_GIST_ID) {
  config.gistId = HYPER_SYNC_SETTINGS_GIST_ID;
}

export default (): GitConfig => {
  const { personalAccessToken, gistId } = config;

  if (!personalAccessToken || !gistId) return config;

  const remoteUrl = GIST_URL(gistId, personalAccessToken);

  const repoPromise = (async (): Promise<void> => {
    await ensureDir(DIR_REPO);
    try {
      await GitProcess.exec(['clone', remoteUrl, '.'], DIR_REPO);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`${ERROR_TITLE} ${err.message}`);
    }
  })();

  return {
    ...config,
    url: GIST_URL(gistId),
    remoteUrl,
    repoPromise,
  };
};
