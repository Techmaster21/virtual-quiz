import { database } from './server';
import { Question } from '../shared/question';

/** An interface to describe an Answer object */
interface Answer {
  /** The correct answer for the particular question */
  correctAnswer: string;
}

/** An interface to describe a PracticeQuestion object */
interface PracticeQuestion extends Question {
  /** The correct answer for the particular question */
  correctAnswer: string;
}

/** A class that is in charge of storing and retrieving the questions from the database */
export class QuestionStore {
  /** The stored practice questions */
  private _practiceQuestions: Promise<PracticeQuestion[]>;
  /** The stored answers */
  private _answers: Promise<Answer[]>;
  /** The stored questions */
  private _questions: Promise<Question[]>;
  /** Whether or not to force retrieval from database instead of cached version */
  public force = false;

  /** Get the practice questions */
  public get practiceQuestions() {
    return this.getter('practiceQuestions') as Promise<PracticeQuestion[]>;
  }

  /** Set the practice questions */
  public set practiceQuestions(given: Promise<PracticeQuestion[]>) {
    this._practiceQuestions = given;
  }

  /** Get the questions */
  public get questions() {
    return this.getter('questions') as Promise<Question[]>;
  }

  /** Set the questions */
  public set questions(given: Promise<Question[]>) {
    this._questions = given;
  }

  /** Get the answers */
  public get answers() {
    return this.getter('answers') as Promise<Answer[]>;
  }

  /** Set the answers */
  public set answers(given: Promise<Answer[]>) {
    this._answers = given;
  }

  /** A helper method that returns the value in the given instance variable store, and sets it if it doesn't exist */
  private getter(name: string): Promise<PracticeQuestion[] | Question[] | Answer[]> {
    if (!this['_' + name] || this.force) {
      this['_' + name] = this.getFromDatabase(name);
    }
    return this['_' + name];
  }

  /** A helper method that gets retrieves values from the database */
  private async getFromDatabase(name: string): Promise<PracticeQuestion[] | Question[] | Answer[]> {
    try {
      const collection = database.collection(name);
      const result = await collection.findOne({});
      return result[name];
    } catch (err) {
      console.error(`An error occurred while getting ${name}: ${err.message}`);
    }
  }
}
