import { join } from 'path';

// Pulls from environment variable or compares against the start of unix time (in CST and mostly for fun)
export const start = process.env.START_DATE  || '12/31/1969 7pm' || '12/12/2020 8pm';

// __dirname is the path to the directory in which this file is located.
export const Path = {
  client: join(__dirname, '/../virtual-quiz'),
  answers: join(__dirname, '/answers.json'),
  questions: {
    practice: join(__dirname, '/practiceQuestions.json'),
    JSON: join(__dirname, '/questions.json'),
    CSV: join(__dirname, '/questions.csv')
  }
};

/**
 * Database URL
 */
export const dbURL = 'mongodb://heroku_whlj8cct:i2k7ued2lj5duem2trvtbievf7@ds253918.mlab.com:53918/heroku_whlj8cct';

export const secret = process.env.SECRET || 'test secret';
export const adminPassword = process.env.ADMIN_PASSWORD || 'password';
