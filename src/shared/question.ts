/** Holds a single question */
export class Question {
  /**
   * Constructs a Question
   * @param category
   *  The category that the question falls into
   * @param question
   *  The actual question
   * @param answers
   *  The choices for potential answers to the question
   */
  constructor(
    public category: string,
    public question: string,
    public answers: string[]
  ) {}
}
