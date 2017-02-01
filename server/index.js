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
var url = 'mongodb://localhost:27017/vq';

// TODO Pull from config file
var year = 2016;
var month = 7;
var day = 17;
var hour = 20;
var dateStart = new Date(year, month, day, hour);

app.use( bodyParser.json() );
//app.use(express.static(__dirname));

var answers = require('./answers.json');

/**
 * Connects to database and starts server
 */
MongoClient.connect(url, function(err, database) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  db = database;

  // Starts server
  app.listen(8080, function () {
    console.log('Virtual Quiz app listening on port 8080');
  });
});

/**
 * Gets the current Date and time according to the server
 * @param callback
 */
var getDateNow = function(callback) {
  console.log("Got the date");
  callback(new Date());

};

/**
 * Gets the Date and time that the competition will start
 * @param callback
 */
var getDateStart = function(callback) {
  console.log("Got the start date");
  callback(dateStart);
};

/**
 * Grabs questions from the questions collection
 * @param db
 *  - the mongodb database
 * @param callback
 *  - function to execute after completion
 */
var findQuestions = function(db, callback) {
  // Get the questions collection
  var collection = db.collection('questions');
  // Find the questions
  collection.find({}).toArray(function(err, questions) {
    assert.equal(err, null);
    console.log("Found the questions");
    callback(questions);
  });
};

/**
 * Grabs practice questions from the practiceQuestions collection
 * @param db
 *  - the mongodb database
 * @param callback
 *  - function to execute after completion
 */
var findPracticeQuestions = function(db, callback) {
  // Get the practiceQuestions collection
  var collection = db.collection('practiceQuestions');
  // Find the practice questions
  collection.find({}).toArray(function(err, questions) {
    assert.equal(err, null);
    console.log("Found the questions");
    callback(questions);
  });
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

app.use(express.static(path.join(__dirname, '/../dist')));

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
  findQuestions(db, function (questions) {
    res.json(questions);
  });
});

app.get('/practiceQuestions', function (req, res) {
  console.log('Practice questions request received');
  findPracticeQuestions(db, function (questions) {
    res.json(questions);
  });
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
    res.json(result);
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
