// This program assumes that the csv file is in the following form:
// Date and time, Category, _question, answer A, B, C, D, E, Correct answer Letter, Initials, Witty comment
// Most importantly, it assumes that it has a header, that is, a row before the rows containing data.
// Most common errors:
// The lines containing a quote character(") have not been properly escaped by the csv exporter (should look like "")
import { parse as papaparse } from 'papaparse';

// todo should probably import but this messes up dist folder
class Question {
  constructor(public question: string,
              public category: string,
              public answers: string[]
  ) {}
}

export class QuestionPreparer {
  static prepare(csv: string): [Question[], any[]] {
    // todo check errors from papa
    const parsed = papaparse(csv, {skipEmptyLines: true});
    const errors = parsed.errors;
    if (errors.length) {
      console.log(errors);
    }
    const rows = parsed.data
      .slice(1); // remove header
    const indices = Array.from(Array(rows.length).keys()); // creates list of rows.length numbers 0 to rows.length
    this.shuffle(indices);
    const questions = Array();
    const answers = Array();
    indices.forEach(index => {
      const [question, answer] = this.processRow(rows[index]);
      questions.push(question);
      answers.push(answer);
    });
    return [questions, answers];
  }

  private static shuffle(array: any[]) {
    for ( let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private static processRow(row: string[]): [Question, any] {
    const correctAnswer = row[3 + row[8].charCodeAt(0) - 65]; // assigns the string corresponding to the correct answer
    const indices = [3, 4, 5, 6, 7];
    this.shuffle(indices);
    // create questions as TS object
    return [ new Question(row[1], row[2], indices.map(index => row[index])),
      { correctAnswer }];
  }
}
