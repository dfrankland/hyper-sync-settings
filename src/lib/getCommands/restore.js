import simpleGit from 'simple-git';
import { paths } from '../../constants';
import fs from '../fs';

const {
  files: {
    restore: restoreFile,
    backup: backupFile,
  },
} = paths;

export default async ({ repoPromise }) => {
  await repoPromise;
  await new Promise(
    resolve => (
      simpleGit(paths.dirs.repo)
        .fetch()
        .mergeFromTo('origin/master', 'master')
        .then(resolve)
    ),
  );
  await fs.copyAsync(backupFile, restoreFile);
};
