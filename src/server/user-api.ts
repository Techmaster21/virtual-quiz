import { Request, Response, Router } from 'express';

import { URI } from '../shared/uri';
import { Authorization } from './authorization';
import { questionStore } from './server';

/** The user-api router */
export const router: Router = Router();

router.put(URI.ANSWER.CHECK, Authorization.user, async (req: Request, res: Response) => {
  // if (answers[req.body.index].correctAnswer.trim() === req.body.answer.trim()) {
  // Indices on server side and client side answers must match, otherwise this method does not work. This is mostly
  // dependent on *ngFor iterating over the array in the correct order.
  const answers = await questionStore.answers;
  const questions = await questionStore.questions;
  if (answers[req.body.questionIndex].correctAnswer ===
      questions[req.body.questionIndex].answers[req.body.answerIndex]) {
    res.json(true);
  } else {
    res.json(false);
  }
});

// TODO should probably only give one question at a time
router.get(URI.QUESTIONS.GET, Authorization.user, async (req: Request, res: Response) => {
  const questions = await questionStore.questions;
  if (questions) {
    res.json(questions);
  } else {
    res.set(500).end();
  }
});
