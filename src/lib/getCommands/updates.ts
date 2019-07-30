import { GitProcess } from 'dugite';
import moment, { Moment } from 'moment';
import { DIR_REPO } from '../../constants';
import { GitConfig } from '../getGitConfig';

const getLastCommit = async (): Promise<{ hash: string; date: Moment }> => {
  const { stdout } = await GitProcess.exec(
    [
      'log',
      '-n',
      '1',
      '--date=iso',
      '--pretty=format:{ "hash": "%H", "date": "%ad" }',
    ],
    DIR_REPO,
  );

  const { hash, date } = JSON.parse(stdout);

  return { hash, date: moment(date, 'YYYY-MM-DD HH:mm:ss Z') };
};

export default async ({ repoPromise }: GitConfig): Promise<boolean> => {
  await repoPromise;
  await GitProcess.exec(['fetch'], DIR_REPO);
  await GitProcess.exec(['checkout', 'origin/master'], DIR_REPO);
  const remote = await getLastCommit();
  await GitProcess.exec(['checkout', 'master'], DIR_REPO);
  const local = await getLastCommit();
  return moment(remote.date).isAfter(local.date) && local.hash !== remote.hash;
};
