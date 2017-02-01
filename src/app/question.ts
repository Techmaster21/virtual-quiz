import { Answer } from './answer';

/**
 * Holds a single question
 */
export class Question {
  constructor(public question: string,
              public category: string,
              public answers: Answer[],
  ) {}
}
