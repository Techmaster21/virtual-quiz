import { sign as jwtSign, SignOptions } from 'jsonwebtoken';
import { Request, Response, Router } from 'express';
import { ObjectId } from 'mongodb';
import { Moment, tz } from 'moment-timezone';

import { URI } from '../shared/uri';
import { database, questionStore } from './server';
import { start, secret, adminPassword } from './constants';
import { Authorization } from './authorization';
import { WordArray } from 'crypto-js';

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
    console.error(`An error occurred while getting questions/answers/practiceQuestions: ${err.message}`);
    res.status(500).end();
  }
});

router.post(URI.TEAM.SAVE, async (req: Request, res: Response) => {
  try {
    // Get the results collection
    const collection = database.collection('teams');
    const team = req.body;
    const payload = { team: { schoolName: team.schoolName, teamNumber: team.teamNumber }, type: 'user', check:  true };
    const options: SignOptions = { expiresIn: '10 days' };
    // Add a Result
    const result = (await collection.insertOne(team)).ops[0];
    const token = jwtSign(payload, secret, options);
    res.json([result, token]);
  } catch (err) {
    console.error(`An error occurred while updating a team: ${err.message}`);
    res.status(500).end();
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
        currentQuestion: team.currentQuestion, timeStarted: team.timeStarted, timeEnded: team.timeEnded
      }
    });
    res.json(team);
  } catch (err) {
    console.error(`An error occurred while saving a team: ${err.message}`);
    res.status(500).end();
  }
});

router.put(URI.TEAM.GET, async (req: Request, res: Response) => {
  try {
    // Get the results collection
    const collection = database.collection('teams');
    const team = req.body;
    // Add a Result
    const result = await collection.findOne({schoolName: team.schoolName, teamNumber: team.teamNumber});
    res.json(result);
  } catch (err) {
    console.error(`An error occurred while getting a team: ${err.message}`);
    res.status(500).end();
  }
});

router.get(URI.TEAM.GET, Authorization.user, async (req: Request, res: Response) => {
  try {
    const collection = database.collection('teams');
    const [schoolName, teamNumber] = req.headers.authorization.slice(1);
    const result = await collection.findOne({schoolName, teamNumber});
    res.json(result);
  } catch (err) {
    console.error(`An error occurred while getting a team: ${err.message}`);
    res.status(500).end();
  }
});

router.post(URI.ADMIN.LOGIN, (req: Request, res: Response) => {
  const hashedPassword: string = req.body;
  if (hashedPassword === adminPassword) {
    const payload = { type: 'admin', check:  true };
    const options: SignOptions = { expiresIn: '1 day' };
    const token = jwtSign(payload, secret, options);
    res.send(token);
  } else {
    res.status(403).end();
  }
});

