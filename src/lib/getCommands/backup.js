import simpleGit from 'simple-git';
import { paths } from '../../constants';
import fs from '../fs';

const {
  files: {
    restore: restoreFile,
    backup: backupFile,
  },
} = paths;

export default async ({ repoPromise, remoteUrl }) => {
  await fs.copyAsync(restoreFile, backupFile, { clobber: true });
  await repoPromise;
  await new Promise(
    resolve => {
      simpleGit(paths.dirs.repo)
        .removeRemote(
          'origin',
          () => undefined,
        );

      simpleGit(paths.dirs.repo)
        .addRemote(
          'origin',
          remoteUrl,
          () => undefined,
        );

      simpleGit(paths.dirs.repo)
        .fetch()
        .add('.hyper.js')
        .commit(`${new Date()}`)
        .push('origin', 'master')
        .then(resolve);
    },
  );
};
