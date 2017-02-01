/**
 * Holds a single answer. Used to facilitate animations
 */
export class Answer {
  constructor(public text: string,
              public state = 'inactive') {
  }
  correct() {
    this.state = 'correct';
  }
  incorrect() {
    this.state = 'incorrect';
  }
}
