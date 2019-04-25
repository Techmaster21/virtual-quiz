/**
 * Holds a single question
 */

export class Question {
  constructor(public question: string,
              public category: string,
              public answers: string[]
  ) {}
}
