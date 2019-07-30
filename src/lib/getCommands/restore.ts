import { GitProcess } from 'dugite';
import { ensureFile, outputFile, readFile } from 'fs-extra';
import { FILE_RESTORE, FILE_BACKUP, DIR_REPO } from '../../constants';
import { GitConfig } from '../getGitConfig';

export default async ({ repoPromise }: GitConfig): Promise<void> => {
  await repoPromise;
  await GitProcess.exec(['fetch'], DIR_REPO);
  await GitProcess.exec(['merge', 'origin/master', 'master'], DIR_REPO);
  await ensureFile(FILE_RESTORE);
  const file = await readFile(FILE_BACKUP);
  await outputFile(FILE_RESTORE, file, { flag: 'r+' });
};
