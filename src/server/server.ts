import * as express from 'express';
import { json as bodyParserJSON, text as bodyParserText } from 'body-parser';
import { Application } from 'express';
import { Db, MongoClient, MongoError } from 'mongodb';

import { clientPath, dbURL } from './constants';
import { router as apiRoutes } from './api';
import { router as userRoutes } from './user-api';
import { router as adminRoutes } from './admin-api';
import { QuestionStore } from './question-store';

// todo comment out before commit
// const requestStats = require('request-stats');
// const reqbytes = [];
// const resbytes = [];

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

MongoClient.connect(dbURL, { useNewUrlParser: true }, (err: MongoError, client: MongoClient) => {
  if (err) {
    console.log('Failed to connect to server: ' + err);
    return;
  }
  console.log('Connected successfully to server');
  database = client.db('heroku_whlj8cct'); // if db changes, this will need to change

  // Starts express server
  const port: number = +process.env.PORT || 8080;
  const server = app.listen(port, () => {
    console.log('Virtual Quiz app listening on port ' + port);
  });
  // todo comment out before commit
  // let count = 0;
  // requestStats(server, stats => {
  //   count += 1;
  //   // this function will be called every time a request to the server completes
  //   if (count > 10) {
  //     reqbytes.push(stats.req.bytes);
  //     if (stats.res.bytes < 10000) {
  //       resbytes.push(stats.res.bytes);
  //     }
  //     console.log('average req bytes: ' + reqbytes.reduce((prev, current) => prev + current) / reqbytes.length);
  //     console.log('average res bytes: ' + resbytes.reduce((prev, current) => prev + current) / resbytes.length);
  //   }
  // });
});


