import { join } from 'path';

/**
 * The start of the competition. Pulls from environment variable or compares against the start of unix time (in CST and
 * mostly for fun)
 */
export const start = process.env.START_DATE || '12/31/1969 7pm' || '12/12/2020 8pm';

// __dirname is the path to the directory in which this file is located.
/** The absolute path to the client */
export const clientPath = join(__dirname, '/../virtual-quiz');

/** Database URL */
export const dbURL = 'mongodb://heroku_whlj8cct:i2k7ued2lj5duem2trvtbievf7@ds253918.mlab.com:53918/heroku_whlj8cct';

/** The secret used to sign all the javascript web tokens */
export const secret = process.env.SECRET || 'test secret';
/** The password used to access the admin interface */
export const adminPassword = process.env.ADMIN_PASSWORD || 'password';
