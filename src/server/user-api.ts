import { NextFunction, Request, Response, Router } from 'express';
import { URI } from './uri';
import { answers, questions } from './api';
import { checkToken } from './server';

/** The user-api router */
export const router: Router = Router();

/** A middleware function used to authenticate users before they are allowed to access endpoints in this file */
function userAuthorization(req: Request, res: Response, next: NextFunction) {
  checkToken(req, res, () => {
    if (req.headers.authorization === 'user' || req.headers.authorization === 'admin') {
      next();
    } else {
      res.set(403).json('403 Forbidden');
    }
  });
}

router.put(URI.ANSWER.CHECK, userAuthorization, (req: Request, res: Response) => {
  // if (answers[req.body.index].correctAnswer.trim() === req.body.answer.trim()) {
  // Indices on server side and client side answers must match, otherwise this method does not work. This is mostly
  // dependent on *ngFor iterating over the array in the correct order.
  if (answers[req.body.questionIndex].correctAnswer === questions[req.body.questionIndex].answers[req.body.answerIndex]) {
    res.json(true);
  } else {
    res.json(false);
  }
});

// TODO should probably only give one question at a time
router.get(URI.QUESTIONS.GET, userAuthorization, (req: Request, res: Response) => {
  if (questions) {
    res.json(questions);
  } else {
    res.set(500).end();
  }
});
