import crypto from 'crypto';

import {parentPort } from 'node:worker_threads';

const hashPassword = (password) => {
    const salt = crypto.randomBytes(128).toString('base64');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
    return hash;
}

parentPort.on('message', (task) => {
    const hash = hashPassword(task);
    parentPort.postMessage(hash);
});