import { sign as jwtSign, SignOptions } from 'jsonwebtoken';
import { Request, Response, Router } from 'express';
import { ObjectId } from 'mongodb';
import { Moment, tz } from 'moment-timezone';

import { URI } from '../shared/uri';
import { database, questionStore } from './server';
import { start, secret, adminPassword } from './constants';

/** The api router */
export const router: Router = Router();

/** The date and time of the start of the competition. Before this time, users can only play with practice questions. */
export const startDate: Moment = tz(start, 'MM-DD-YYYY hhA', 'America/Chicago');

router.get(URI.PRACTICE_QUESTIONS.GET, async (req: Request, res: Response) => {
  const questions = await questionStore.practiceQuestions;
  res.json(questions);
});

router.put(URI.PRACTICE_QUESTIONS.CHECK, async (req: Request, res: Response) => {
  // if (practiceQuestions[req.body.index].correctAnswer.trim() === req.body.answer.trim()) {
  const questions = await questionStore.practiceQuestions;
  const question = questions[req.body.questionIndex];
  if (question.correctAnswer === question.answers[req.body.answerIndex]) {
    res.json(true);
  } else {
    res.json(false);
  }
});

router.get(URI.DATE.CAN_START, async (req: Request, res: Response) => {
  try {
    const answers = await questionStore.answers;
    const questions = await questionStore.questions;
    if (answers && questions) { // if answers and questions exist
      res.json(new Date() >= startDate.toDate());
    } else {
      // if we don't have questions ready, only allow practice play.
      res.json(false);
    }
  } catch (err) {
    console.log(`An error occurred while getting questions/answers/practiceQuestions: ${err.message}`);
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
    console.log(`An error occurred while updating a team: ${err.message}`);
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
    console.log(`An error occurred while saving a team: ${err.message}`);
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
    console.log(`An error occurred while getting a team: ${err.message}`);
    res.set(500).end();
  }
});

router.post(URI.ADMIN.LOGIN, (req: Request, res: Response) => {
  const password = req.body;
  if (password === adminPassword) {
    const payload = { type: 'admin', check:  true };
    const options: SignOptions = { expiresIn: 1440 }; // expires in 24 hours
    const token = jwtSign(payload, secret, options);
    res.send(token);
  } else {
    res.set(403).end();
  }
});

