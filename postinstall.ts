/* eslint-disable global-require, no-console */

import { execFile } from 'child_process';

const HYPER_SYNC_SETTINGS_CHECK_FOR_DUGITE = JSON.stringify(true);

if (process.env.HYPER_SYNC_SETTINGS_CHECK_FOR_DUGITE) {
  process.exit(0);
}

try {
  console.log('Checking if `dugite` installed correctly');
  require('dugite');
} catch (_) {
  console.log('`dugite` is not installed correctly');
  console.log('Installing all dependencies using `npm`');

  execFile(
    'npm',
    ['install'],
    {
      cwd: __dirname,
      env: { ...process.env, HYPER_SYNC_SETTINGS_CHECK_FOR_DUGITE },
    },
    installErr => {
      if (installErr) {
        console.log('Installing all dependencies using `npm` failed');
        throw installErr;
      }

      console.log('Installing all dependencies using `npm` succeeded');

      try {
        console.log('Checking if `dugite` installed correctly again');
        require('dugite');
      } catch (err) {
        console.log('`dugite` is still not installed correctly');
        throw err;
      }

      console.log('`dugite` is installed correctly');
    },
  );
}

console.log('`dugite` is installed correctly');
