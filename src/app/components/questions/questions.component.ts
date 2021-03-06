import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { correctColor, incorrectColor } from '../../constants';
import { Question } from '../../../shared/question';
import { QuestionService } from '../../services/question.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { forkJoin, Observable } from 'rxjs';

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
  /** The current question */
  @Input() currentQuestion: Question;
  /** Event that fires when an answer is clicked */
  @Output() answerClicked = new EventEmitter<[string, number]>();
  /** The state of each answer, used for animations */
  state: Array<string>;

  /** Questions component constructor */
  constructor(private questionService: QuestionService) { }

  /** Sets all answers to their respective colors once a user's tries have been exhausted */
  finishAnimation() {
    // todo more efficient (less requests) but kinda confusing
    const [answers, indices] = this.currentQuestion.answers.reduce((result: [Array<Observable<boolean>>, Array<number>], answer, i) => {
      if (this.state[i] === 'inactive') {
        result[0].push(this.questionService.checkAnswer(i, this.index));
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

  /** Called when there is a change in [finished]{@link #finished} or [currentQuestion]{@link #currentQuestion} */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.finished && changes.finished.currentValue === true) {
      this.finishAnimation();
    } else if (changes.currentQuestion) {
      this.state = new Array(this.currentQuestion.answers.length).fill('inactive');
    }
  }

  /**
   * Called when an answer is clicked. Emits an event which contains a string saying whether the answer was 'correct'
   * or 'incorrect' and changes the answer object's state so that it is properly animated
   */
  onClick(answerIndex: number) {
    if (!this.finished) {
      this.questionService.checkAnswer(answerIndex, this.index)
        .subscribe(result => {
          if (result) {
            this.answerClicked.emit(['correct', answerIndex]);
            this.state[answerIndex] = 'correct';
          } else {
            this.answerClicked.emit(['incorrect', answerIndex]);
            this.state[answerIndex] = 'incorrect';
          }
        });
    }
  }
}
