/**
 * Holds a single question
 */
import { Answer } from './answer';

export class Question {
  constructor(public question: string,
              public category: string,
              public answers: Answer[]
  ) {}
}
