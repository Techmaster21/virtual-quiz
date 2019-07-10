import * as express from 'express';
import { json as bodyParserJSON, text as bodyParserText } from 'body-parser';
import { Application } from 'express';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { clientPath, dbPassword, dbUser } from './constants';
import { router as apiRoutes } from './api';
import { router as userRoutes } from './user-api';
import { router as adminRoutes } from './admin-api';
import { QuestionStore } from './question-store';
import { practiceQuestions } from './practiceQuestions';

/** The Express server */
const app: Application = express()
  .use( bodyParserJSON( { limit: '10mb' } ),
        bodyParserText( { type: ['text/csv', 'text/plain'], limit: '10mb'}) )
  .use( express.static(clientPath) ) // Allows the client access to any files located in /../dist without having to explicitly declare so.
  .use( apiRoutes )
  // all routes after this comment are protected by token
  .use( userRoutes )
  .use( adminRoutes )
  // Redirects all other paths that dont begin with /api to the base index html file. Angular handles the routing from there.
  // Must be the last thing - express handles this sequentially.
  .all(/^(?!.*\/api.*).*$/, (req, res) => {
    res.sendFile(clientPath + '/index.html');
  });

/** A reference to the Mongo database */
export let database: Db;
/** A reference to the question store */
export const questionStore = new QuestionStore();
/** Database URL */
let dbURL: string;

/** Sets dbURL based on whether we are using the production database or a local development version */
async function setDbURL() {
  if (!dbUser || !dbPassword) {
    const mongod = new MongoMemoryServer();
    dbURL = await mongod.getUri();
  } else {
    dbURL = `mongodb://${dbUser}:${dbPassword}@ds253918.mlab.com:53918/${dbUser}`;
  }
}

setDbURL().then(async () => {
  try {
    database = (await MongoClient.connect(dbURL, {useNewUrlParser: true})).db();
    if (!dbUser || !dbPassword) {
      await database.collection('answers').insertOne({ answers: practiceQuestions });
      await database.collection('questions').insertOne({ questions: practiceQuestions });
      await database.collection('practiceQuestions').insertOne({ practiceQuestions });
    }
    // Starts express server
    const port: number = +process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`Virtual Quiz app listening on port ${port}`);
    });
  } catch (err) {
    console.log(`There was an error while starting the server: ${err}`);
  }
});
