import { GitProcess } from 'dugite';
import { ensureFile, copyFile } from 'fs-extra';
import { FILE_RESTORE, FILE_BACKUP, DIR_REPO } from '../../constants';
import { GitConfig } from '../getGitConfig';

export default async ({ repoPromise }: GitConfig): Promise<void> => {
  await repoPromise;
  await GitProcess.exec(['fetch'], DIR_REPO());
  await GitProcess.exec(['merge', 'origin/master', 'master'], DIR_REPO());
  await ensureFile(FILE_RESTORE());
  await copyFile(FILE_BACKUP(), FILE_RESTORE());
};
