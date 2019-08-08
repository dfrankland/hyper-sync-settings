import { GitProcess } from 'dugite';
import { copy } from 'fs-extra';
import { FILE_RESTORE, FILE_BACKUP, DIR_REPO } from '../../constants';
import { GitConfig } from '../getGitConfig';

export default async ({ repoPromise, remoteUrl }: GitConfig): Promise<void> => {
  await copy(FILE_RESTORE(), FILE_BACKUP(), { overwrite: true });
  await repoPromise;
  await GitProcess.exec(['add', 'remote', remoteUrl], DIR_REPO());
  await GitProcess.exec(['fetch'], DIR_REPO());
  await GitProcess.exec(['add', '.'], DIR_REPO());
  await GitProcess.exec(['commit', '-m', `${new Date()}`], DIR_REPO());
  await GitProcess.exec(['push', 'origin', 'master'], DIR_REPO());
};
