import fsExtra from 'fs-extra';
import { promisifyAll } from 'bluebird';

export default promisifyAll(fsExtra);
