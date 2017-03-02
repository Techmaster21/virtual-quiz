var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var ObjectId = require('mongodb').ObjectId;
var db;
/**
 * Database URL
 */
var url = process.env.MONGODB_URI;

// TODO Pull from config file
// The date and time of the start of the competition. Before this time, users will only be able to access practiceQuestions.
var year = 2016;
var month = 3;
var day = 6;
var hour = 12;
var dateStart = new Date(year, month, day, hour);

app.use( bodyParser.json() );

var answers = require('./answers.json');
var questions = require('./questions.json');
var practiceQuestions = require('./practiceQuestions.json');

/**
 * Connects to database and starts server
 */
MongoClient.connect(url, function(err, database) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  db = database;

  // Starts server
  app.listen(process.env.PORT || 8080, function () {
    console.log('Virtual Quiz app listening on port 8080');
  });
});

/**
 * Gets the current date and time according to the server
 * @param callback
 */
var getDateNow = function(callback) {
  console.log("Got the date");
  callback(new Date());
};

/**
 * Gets the date and time that the competition will start
 * @param callback
 */
var getDateStart = function(callback) {
  console.log("Got the start date");
  callback(dateStart);
};

/**
 * Adds a Result to the results collection
 * @param db
 *  - the mongodb database
 * @param result
 *  - the result to add
 * @param callback
 */
var addResult = function(db, result, callback) {
  // Get the results collection
  var collection = db.collection('results');
  // Add a Result
  collection.insertOne(result, function(err, res) {
    assert.equal(err, null);
    console.log("Inserted result");
    callback(res.ops[0]);
  });
};

// TODO: return something meaningful?
/**
 * Updates the result by ID
 * @param db
 *  - the mongodb database
 * @param result
 *  - the result to update
 * @param callback
 */
var updateResult = function(db, result, callback) {
  // Get the results collection
  var collection = db.collection('results');
  // Update a Result
  collection.updateOne({_id: ObjectId(result._id)}, {
    $set: {
      team: result.team,
      schoolName: result.schoolName,
      points: result.points,
      currentQuestion: result.currentQuestion,
      timeStarted: result.timeStarted,
      timeEnded: result.timeEnded
    }
  }, function(err, res) {
    assert.equal(err, null);
    console.log("Updated result");
    callback(result);
  });
};

/**
 * Returns a result, searching by schoolName and team number
 * @param db
 *  - the mongodb database
 * @param result
 *  - a json object containing schoolName and team
 * @param callback
 */
var getResult = function(db, result, callback) {
  // Get the results collection
  var collection = db.collection('results');
  // Add a Result
  collection.find({schoolName: result.schoolName, team: result.team}).toArray(function(err, res) {
    assert.equal(err, null);
    console.log("Got result");
    callback(res);
  });
};

// Allows the client access to any files located in /../dist without having to explicitly declare so.
app.use(express.static(path.join(__dirname, '/../dist')));

// Redirects all these paths to the base index html file. Angular 2 handles the routing from there.
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/../dist/index.html'));
});
app.get('/game', function (req, res) {
  res.sendFile(path.join(__dirname+'/../dist/index.html'));
});
app.get('/signup', function (req, res) {
  res.sendFile(path.join(__dirname+'/../dist/index.html'));
});
app.get('/gameover', function (req, res) {
  res.sendFile(path.join(__dirname+'/../dist/index.html'));
});

app.get('/questions', function (req, res) {
  console.log('Questions request received');
  res.json(questions);
});

app.get('/practiceQuestions', function (req, res) {
  console.log('Practice questions request received');
  res.json(practiceQuestions);
});

app.get('/dateNow', function (req, res) {
  console.log('Date now request received');
  getDateNow(function (now) {
    res.json({year: now.getFullYear(), month: now.getMonth(), day: now.getDay(), hour: now.getHours()});
  });
});

app.get('/dateStart', function (req, res) {
  console.log('Date start request received');
  getDateStart(function (start) {
    res.json({year: start.getFullYear(), month: start.getMonth(), day: start.getDay(), hour: start.getHours()});
  });
});

app.post('/results', function (req, res) {
  console.log('Results post received');
  addResult(db, req.body, function (result) {
    res.json(result);
  });
});

app.put('/results', function (req, res) {
  console.log('Results put received');
  updateResult(db, req.body, function (result) {
    res.json(result);
  });
});

app.put('/getResult', function (req, res) {
  console.log('get Result put received');
  getResult(db, req.body, function (result) {
    if (result.length === 0) {
      res.json({});
    }
    else {
      res.json(result[0]);
    }
  });
});

app.put('/answerCheck', function (req, res) {
  console.log('answer check request received');
  if (answers[req.body.index].correctAnswer === req.body.answer) {
    res.json({correct: true});
  }
  else {
    res.json({correct: false});
  }
});
