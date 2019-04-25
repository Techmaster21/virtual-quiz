import * as express from 'express';
import { json as bodyParserJSON, text as bodyParserText } from 'body-parser';
import { verify as jwtVerify, VerifyErrors } from 'jsonwebtoken';

import { Application, NextFunction, Request, Response } from 'express';
import { Db, MongoClient, MongoError } from 'mongodb';
import { dbURL, Path, secret } from './constants';
import { router as apiRouter } from './api';
import { router as userRoutes } from './user-api';
import { router as adminRoutes } from './admin-api';
const requestStats = require('request-stats');

let reqbytes = [];
let resbytes = [];

export function checkToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization as string;
  if (token) {
    jwtVerify(token, secret, (err: VerifyErrors, decoded: any) => { // adding type would break decoded.type
      if (err) {
        return res.json('invalid token');
      } else {
        req.headers.authorization = decoded.type;
        next();
      }
    });
  } else {
    res.set(403).json('403 Forbidden');
  }
}

const app: Application = express()
  .use( bodyParserJSON( {limit: '10mb'} ), bodyParserText({ type: 'text/csv', limit: '10mb'}) )
  .use( express.static(Path.client) ) // Allows the client access to any files located in /../dist without having to explicitly declare so.
  .use( apiRouter )
  // all routes after this are protected by token
  .use( userRoutes )
  .use( adminRoutes )
  // Redirects all other paths that dont begin with /api to the base index html file. Angular handles the routing from there.
  // Must be the last thing - express handles this sequentially.
  .all(/^(?!.*\/api.*).*$/, (req, res) => {
    res.sendFile(Path.client + '/index.html');
  });

export let database: Db;

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
  requestStats(server, stats => {
    // this function will be called every time a request to the server completes
    reqbytes.push(stats.req.bytes);
    if (stats.res.bytes < 10000) {
      resbytes.push(stats.res.bytes);
    }
    console.log('average req bytes: ' + reqbytes.reduce( (prev, current) => prev + current) / reqbytes.length);
    console.log('average res bytes: ' + resbytes.reduce( (prev, current) => prev + current) / resbytes.length);
  });
});


