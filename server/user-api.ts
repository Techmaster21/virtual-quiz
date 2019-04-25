import { NextFunction, Request, Response, Router } from 'express';
import { URI } from './uri';
import { answers, questions } from './api';
import { checkToken } from './server';

export const router: Router = Router();

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
  // if (answers[req.body.index].correctAnswer === questions[req.body.index].answers[req.body.answer]) {
  if (answers[req.body.index].correctAnswer.trim() === req.body.answer.trim()) {
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
