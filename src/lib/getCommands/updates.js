import moment from 'moment';
import simpleGit from 'simple-git';
import { paths } from '../../constants';

const gitDateToISOString = gitDate => moment(gitDate, 'YYYY-MM-DD HH:mm:ss Z');

export default async ({ repoPromise }) => {
  const local = {};
  const remote = {};

  await repoPromise;
  await new Promise(
    resolve => (
      simpleGit(paths.dirs.repo)
        .fetch()
        .checkout('origin/master')
        .log(['-n', '1', '--date=iso'], (err, log) => {
          remote.hash = log.latest.hash;
          remote.date = gitDateToISOString(log.latest.date);
        })
        .checkout('master')
        .log(['-n', '1', '--date=iso'], (err, log) => {
          local.hash = log.latest.hash;
          local.date = gitDateToISOString(log.latest.date);
        })
        .then(resolve)
    ),
  );

  return (
    moment(remote.date).isAfter(local.date) &&
    local.hash !== remote.hash
  );
};
