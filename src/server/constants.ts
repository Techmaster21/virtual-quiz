import { join } from 'path';
import { SHA3, WordArray } from 'crypto-js';

/**
 * The start of the competition. Pulls from environment variable or compares against the start of unix time (in CST and
 * mostly for fun)
 */
export const start = process.env.START_DATE || '12/31/1969 7pm' || '12/12/2020 8pm';

// __dirname is the path to the directory in which this file is located.
/** The absolute path to the client */
export const clientPath = join(__dirname, '/../virtual-quiz');

/** Database URI */
export const dbURI = process.env.MONGODB_URI;

/** The secret used to sign all the javascript web tokens */
export const secret = process.env.SECRET || 'test secret';
/** The password used to access the admin interface */
export const adminPassword = SHA3(process.env.ADMIN_PASSWORD || 'password').toString();
