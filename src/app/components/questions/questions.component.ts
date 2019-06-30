import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { correctColor, incorrectColor } from '../../constants';
import { Question } from '../../models/question';
import { QuestionService } from '../../services/question.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { forkJoin } from 'rxjs';

/** Component used to display the questions and answers and to animate them */
@Component({
  selector: 'app-questions',
  templateUrl: 'questions.component.html',
  styleUrls: ['questions.component.css'],
  animations: [
    trigger('answerState', [
      state('correct', style({
        backgroundColor: correctColor
      })),
      state('incorrect', style({
        backgroundColor: incorrectColor
      })),
      transition('* => correct', animate('500ms ease-in')),
      transition('* => incorrect', animate('500ms ease-in'))
    ])
  ]
})
export class QuestionsComponent implements OnChanges {
  /** Whether or not this currentQuestion has been completed */
  @Input() finished: boolean;
  /** The index of the current question */
  @Input() index;
  /** The number of points gained from this question */
  @Input() pointsGained;
  /** Event that fires when an answer is clicked */
  @Output() answerClicked = new EventEmitter<string>();
  /** The current question (used in part to facilitate animations) */
  @Input() set question(given: Question) {
    this.state = new Array(given.answers.length).fill('inactive'); // todo should do instead with lifecycle hooks
    this.currentQuestion = given;
  }
  /** The current question */
  currentQuestion: Question;
  /** The state of each answer, used for animations */
  state: Array<string>;

  /** @ignore */
  constructor(private questionService: QuestionService) { }

  /** Sets all answers to their respective colors once a user's tries have been exhausted */
  finishAnimation() {
    // todo more efficient (less requests) but kinda confusing
    const [answers, indices] = this.currentQuestion.answers.reduce((result, answer, i) => {
      if (this.state[i] === 'inactive') {
        result[0].push(this.questionService.checkAnswer(answer, this.index));
        result[1].push(i);
      }
      return result;
    }, [[], []]);
    forkJoin(answers).subscribe(results =>
        results.forEach( (result, i) => {
          if (results[i]) {
            this.state[indices[i]] = 'correct';
          } else {
            this.state[indices[i]] = 'incorrect';
          }
        })
    );
  }

  /** Called when there is a change in the variable [finished]{@link #finished} */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.finished && changes.finished.currentValue === true) {
      this.finishAnimation();
    }
  }

  /**
   * Called when an answer is clicked. Emits an event which contains a string saying whether the answer was 'correct'
   * or 'incorrect' and changes the answer object's state so that it is properly animated
   */
  onClick(answer: string, answerIndex: number) {
    if (!this.finished) {
      this.questionService.checkAnswer(answer, this.index)
        .subscribe(result => {
          if (result) {
            this.answerClicked.emit('correct');
            this.state[answerIndex] = 'correct';
          } else {
            this.answerClicked.emit('incorrect');
            this.state[answerIndex] = 'incorrect';
          }
        });
    }
  }
}
