import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

import { Answer } from '../answer';
import { correctColor, incorrectColor } from '../constants';
import { Question } from '../question';
import { QuestionService } from '../question.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';

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
  /** Whether or not this question has been completed. True when user has either exhausted both tries,
   * or chose the correct answer; false otherwise
   * @type {boolean}
   */
  @Input() finished: boolean;
  @Input() index;
  @Input() pointsGained;
  /**
   * Event that fires when an answer is clicked
   * @type {EventEmitter<string>}
   */
  @Output() onAnswerClicked = new EventEmitter<string>();
  /**
   * The current question
   */
  @Input() question: Question;

  constructor(private questionService: QuestionService) { }

  /**
   * Sets all answers to their respective colors once a user's tries have been exhausted.
   */
  finishAnimation() {
    let answers = [];
    for (let answer of this.question.answers) {
      answers.push(this.questionService.checkAnswer(answer, this.index));
    }
    forkJoin(answers).subscribe(
      results => {
        for (let i = 0; i < results.length; ++i) {
          let answer: Answer = this.question.answers[i];
          if (answer.state === 'inactive') {
            if (results[i]) {
              answer.correct();
            } else {
              answer.incorrect();
            }
          }
        }
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['finished'] && changes['finished'].currentValue === true) {
      this.finishAnimation();
    }
  }
  /**
   * Called when an answer is clicked. Emits an event which contains a string saying whether the answer was 'correct'
   * or 'incorrect' and changes the answer object's state so that it is properly animated
   * @param answer
   *  the answer as Answer
   */
  onClick(answer: Answer) {
    if (!this.finished) {
      this.questionService.checkAnswer(answer, this.index)
        .subscribe(result => {
          if (result) {
            this.onAnswerClicked.emit('correct');
            answer.correct();
          } else {
            this.onAnswerClicked.emit('incorrect');
            answer.incorrect();
          }
        });
    }
  }
}

