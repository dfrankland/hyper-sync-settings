import { GitProcess } from 'dugite';
import { copyFile, ensureDir, readJson, pathExists } from 'fs-extra';
import {
  FILE_CONFIG,
  FILE_CONFIG_TEMPLATE,
  GIST_URL,
  ERROR_TITLE,
  DIR_REPO,
} from '../constants';
import notify from './notify';

export interface IdAndToken {
  personalAccessToken: string;
  gistId: string;
}

export interface GitConfig extends IdAndToken {
  url: string;
  remoteUrl: string;
  repoPromise: Promise<void>;
}

const getIdAndToken = async (): Promise<IdAndToken> => {
  let config: IdAndToken = {
    personalAccessToken: '',
    gistId: '',
  };

  const {
    HYPER_SYNC_SETTINGS_PERSONAL_ACCESS_TOKEN,
    HYPER_SYNC_SETTINGS_GIST_ID,
  } = process.env;

  if (
    !HYPER_SYNC_SETTINGS_PERSONAL_ACCESS_TOKEN ||
    !HYPER_SYNC_SETTINGS_GIST_ID
  ) {
    try {
      if (!(await pathExists(FILE_CONFIG()))) {
        notify({
          title: ERROR_TITLE,
          body: `no config file found in \`${FILE_CONFIG()}\`, creating one`,
          level: 'error',
        });
        await copyFile(FILE_CONFIG_TEMPLATE, FILE_CONFIG());
      } else {
        try {
          config = await readJson(FILE_CONFIG());
        } catch (err) {
          notify({
            title: ERROR_TITLE,
            body: `could not read \`${FILE_CONFIG()}\`, maybe the JSON is not valid?`,
            level: 'error',
          });
        }
      }
    } catch (err) {
      notify({
        title: ERROR_TITLE,
        body: `could not check in \`${FILE_CONFIG()}\` for config file`,
        level: 'error',
      });
    }
  }

  if (HYPER_SYNC_SETTINGS_PERSONAL_ACCESS_TOKEN) {
    config.personalAccessToken = HYPER_SYNC_SETTINGS_PERSONAL_ACCESS_TOKEN;
  }

  if (HYPER_SYNC_SETTINGS_GIST_ID) {
    config.gistId = HYPER_SYNC_SETTINGS_GIST_ID;
  }

  return config;
};

export default async (): Promise<GitConfig> => {
  const config: GitConfig = {
    ...(await getIdAndToken()),
    url: '',
    remoteUrl: '',
    repoPromise: Promise.resolve(),
  };

  const { personalAccessToken, gistId } = config;

  if (!personalAccessToken || !gistId) return config;

  const remoteUrl = GIST_URL(gistId, personalAccessToken);

  const repoPromise = (async (): Promise<void> => {
    await ensureDir(DIR_REPO());
    try {
      await GitProcess.exec(['clone', remoteUrl, '.'], DIR_REPO());
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
