/** Holds a single question */
export class Question {
  /**
   * Constructs a Question
   * @param question
   *  The actual question
   * @param category
   *  The category that the question falls into
   * @param answers
   *  The choices for potential answers to the question
   */
  constructor(
    public question: string,
    public category: string,
    public answers: string[]
  ) {}
}
