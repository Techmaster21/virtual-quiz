import { sign as jwtSign, SignOptions } from 'jsonwebtoken';

import { URI } from './uri';
import { Request, Response, Router } from 'express';
import { ObjectId } from 'bson';
import { database } from './server';
import { Moment, tz } from 'moment-timezone';
import { start, secret, adminPassword } from './constants';

export const router: Router = Router();

// The date and time of the start of the competition. Before this time, users will only be able to access
// practiceQuestions.
export const startDate: Moment = tz(start, 'MM-DD-YYYY hhA', 'America/Chicago');

export let practiceQuestions;
export let answers;
export let questions;

export function setAnswers(givenAnswers) {
  answers = givenAnswers;
}

export function setQuestions(givenQuestions) {
  questions = givenQuestions;
}

async function setJSONValues() {
  try {
    if (!practiceQuestions) {
      const collection = database.collection('practiceQuestions');
      const result = await collection.findOne({});
      practiceQuestions = result.questions;
    }
    if (!questions) {
      const collection = database.collection('questions');
      const result = await collection.findOne({});
      questions = result.questions;
    }
    if (!answers) {
      const collection = database.collection('answers');
      const result = await collection.findOne({});
      answers = result.answers;
    }
  } catch (err) {
    console.log('An error occurred while getting questions/answers/practiceQuestions: ' + err.message);
  }
}

router.get(URI.PRACTICE_QUESTIONS.GET, (req: Request, res: Response) => {
  res.json(practiceQuestions);
});

router.put(URI.PRACTICE_QUESTIONS.CHECK, (req: Request, res: Response) => {
  if (practiceQuestions[req.body.index].correctAnswer.trim() === req.body.answer.trim()) {
    res.json(true);
  } else {
    res.json(false);
  }
});

router.get(URI.DATE.NOW, (req: Request, res: Response) => {
  const now = new Date();
  console.log('Got the date: ' + now.valueOf());
  res.json(now);
});

router.get(URI.DATE.START, (req: Request, res: Response) => {
  console.log('Got the start date: ' + startDate.valueOf());
  res.json(startDate);
});

router.get(URI.DATE.CAN_START, async (req: Request, res: Response) => {
  try {
    // makes sure that we currently have a set of answers and questions.
    await setJSONValues();
    if (answers && questions) { // if answers and questions exist
      res.json(new Date() >= startDate.toDate());
    } else {
      // if we don't have questions ready, only allow practice play.
      res.json(false);
    }
  } catch (err) {
    console.log('An error occurred while getting questions/answers/practiceQuestions: ' + err.message);
    res.set(500).end();
  }
});

router.post(URI.TEAM.SAVE, async (req: Request, res: Response) => {
  try {
    // Get the results collection
    const collection = database.collection('teams');
    const team = req.body;
    const payload = { type: 'user', check:  true };
    const options: SignOptions = { expiresIn: 14400 }; // expires in 10 days
    team.token = jwtSign(payload, secret, options);
    // Add a Result
    const result = await collection.insertOne(team);
    res.json(result.ops[0]);
  } catch (err) {
    console.log('An error occurred while updating a team: ' + err.message);
    res.set(500).end();
  }
});

router.put(URI.TEAM.SAVE, async (req: Request, res: Response) => {
  try {
    // Get the teams collection
    const collection = database.collection('teams');
    const team = req.body;
    // Update a Team
    // TODO can use object here?
    const result = await collection.updateOne({_id: new ObjectId(team._id)}, {
      $set: { teamNumber: team.teamNumber, schoolName: team.schoolName, points: team.points,
        currentQuestion: team.currentQuestion, timeStarted: team.timeStarted, timeEnded: team.timeEnded, token: team.token
      }
    });
    res.json(team);
  } catch (err) {
    console.log('An error occurred while saving a team: ' + err.message);
    res.set(500).end();
  }
});

router.put(URI.TEAM.GET, async (req: Request, res: Response) => {
  try {
    // Get the results collection
    const collection = database.collection('teams');
    const team = req.body;
    // Add a Result
    const result = await collection.findOne({schoolName: team.schoolName, teamNumber: team.teamNumber});
    if (result === null) { // not sure if this is possible, or if in this case the promise would be rejected. Requires testing
      res.json({});
    } else {
      res.json(result);
    }
  } catch (err) {
    console.log('An error occurred while getting a team: ' + err.message);
    res.set(500).end();
  }
});

router.post(URI.ADMIN.LOGIN, (req: Request, res: Response) => {
  const password = req.body.password;
  if (password === adminPassword) {
    const payload = { type: 'admin', check:  true };
    const options: SignOptions = { expiresIn: 1440 }; // expires in 24 hours
    const token = jwtSign(payload, secret, options);
    res.json({token});
  } else {
    res.set(403).end();
  }
});

