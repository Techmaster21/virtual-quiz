import { NextFunction, Request, Response, Router } from 'express';
import { URI } from './uri';
import { setAnswers, setQuestions } from './api';
import { QuestionPreparer } from './question-preparer';
import { checkToken, database } from './server';

export const router: Router = Router();

function adminAuthorization(req: Request, res: Response, next: NextFunction) {
  checkToken(req, res, () => {
    if (req.headers.authorization === 'admin') {
      next();
    } else {
      res.set(403).json('403 Forbidden');
    }
  });
}

router.post(URI.QUESTIONS.SAVE, adminAuthorization, async (req: Request, res: Response) => {
  try {
    // todo return some console output
    const [givenQuestions, givenAnswers] = QuestionPreparer.prepare(req.body);
    let collection = database.collection('questions');
    // todo handle errors better
    await collection.findOneAndDelete({});
    await collection.insertOne({ questions: givenQuestions });
    collection = database.collection('answers');
    await collection.findOneAndDelete({});
    await collection.insertOne({ answers: givenAnswers });
    setQuestions(givenQuestions);
    setAnswers(givenAnswers);
    res.end();
  } catch (err) {
    console.log('An error occurred while saving or parsing questions.csv: ' + err.message);
    res.status(500).end();
  }
});
