import { Request, Response, Router } from 'express';

import { URI } from '../shared/uri';
import { QuestionPreparer } from './question-preparer';
import { database, questionStore } from './server';
import { Authorization } from './authorization';

/** The admin-api router */
export const router: Router = Router();

router.post(URI.QUESTIONS.SAVE, Authorization.admin, async (req: Request, res: Response) => {
  try {
    // todo return some console output
    const [questions, answers] = QuestionPreparer.prepare(req.body);
    let collection = database.collection('questions');
    // todo handle errors better
    await collection.findOneAndDelete({});
    await collection.insertOne({ questions });
    collection = database.collection('answers');
    await collection.findOneAndDelete({});
    await collection.insertOne({ answers });
    questionStore.questions = Promise.resolve(questions);
    questionStore.answers = Promise.resolve(answers);
    res.end();
  } catch (err) {
    console.log(`An error occurred while saving or parsing questions.csv: ${err.message}`);
    res.status(500).end();
  }
});
