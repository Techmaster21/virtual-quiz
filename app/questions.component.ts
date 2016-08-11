import { Component, OnInit, DoCheck, state,
 style, transition, animate, trigger } from '@angular/core';

import { Question } from './question';
import { QuestionService } from './question.service';
import { Router } from '@angular/router';

@Component({
    selector: 'my-questions',
    template: `
      {{(mseconds/1000).toFixed(1)}}
      {{points}}
      <button (click)="stopTimer()">Rest</button>
      <button (click)="startTimer()">UnRest</button>
    	<div *ngIf="currentQuestion">
        <div class="w3-panel w3-light-grey w3-border">
    		<h5>{{currentQuestion.question}}</h5>
        </div>
        <div class="question">
          <button class="w3-btn-block"
            #answerElement *ngFor="let answer of currentQuestion.answers"
            (click)="onClick(answerElement)"
            [style.backgroundColor]="color(answer)">{{answer}}</button>
        </div>
    	<div class="w3-progress-container">
        <div id="myBar" class="w3-progressbar w3-red" [style.width]="percentComplete()">
          <div class="w3-center w3-text-black">{{index}}/{{questions.length}}</div>
        </div>
      </div>

    `,
    styles: [`
    .question button {
      color:#000;
      background-color: #f1f1f1;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .question {
      margin: 1rem;
    }
    `],
    animations: [
    trigger('answerState', [
      state('inactive', style({
        backgroundColor: '#f1f1f1'
      })),
      state('active',   style({
        backgroundColor: 'red'
      })),
      transition('* => *', animate('1000ms ease-in'))
    ])
  ]
})
export class QuestionsComponent implements OnInit {
	questions: Question[];
  currentQuestion: Question;
  index = 0;
  mseconds = 0.0;
  subscription: any;
  secondTryAllowed: boolean = true;
  finished: boolean = false;
  points: number = 0;
  timer: any;

	constructor(private router: Router,
    private questionService: QuestionService) { }

  color(answer: string) {
    if (this.finished) {
      if (answer===this.currentQuestion.correctAnswer) {
        return 'green';
      }
      else {
        return 'red';
      }
    }
  }
  onLoad(answer: any) {
    console.log('test');
  }
  startTimer() {
    let time = Date.now();
    this.timer = window.setInterval(()=> {
      this.mseconds += Date.now()-time;
      if (this.mseconds >= 60000) {
        if (this.secondTryAllowed) {
          this.secondTryAllowed = false;
          this.stopTimer();
          this.resetTimer();
          this.startTimer();
        } else {
          this.loadQuestion();
        }
      }
      time = Date.now();
    }, 100);
  }
  stopTimer() {
    window.clearInterval(this.timer);
  }
  resetTimer() {
    this.mseconds = 0.0;
  }
  percentComplete() {
    return this.index/this.questions.length*100 + '%';
  }
  loadQuestion() {
    ++this.index;
    if (this.questions[this.index]) {
      this.currentQuestion = this.questions[this.index];
      this.stopTimer();
      this.resetTimer();
      this.startTimer();
      this.secondTryAllowed = true;
      this.finished = false;
    }
    else {
      this.gameOver();
    }
  }
  gameOver() {
    this.router.navigate['/gameover'];
  }
	getQuestions() {
    this.questionService.getQuestions().then(questions => this.questions = questions)
                                       .then(() => this.currentQuestion = this.questions[0]); // proper? dunno. Better than before? hells yeah
  }
  ngOnInit() {
    this.getQuestions();
    this.startTimer();
  }
  onClick(answer: HTMLElement) {
    if (!this.finished){
      if (answer.innerHTML === this.currentQuestion.correctAnswer) { //this scares me because easy to break (w/ spaces eg)
        answer.style.backgroundColor='green'; // should not be modifying DOM - should find a way to do with Angular Animations
        answer.style.pointerEvents='none';
        this.finished = true;
        this.stopTimer();
        if (!this.secondTryAllowed) {
          this.points += 1;
        } else if (this.mseconds < 80) {
          this.points += 4;
        } else if (this.mseconds < 150) {
          this.points += 3;
        } else {
          this.points += 2;
        }
        setTimeout(()=>this.loadQuestion(),1000); // force update?
      } else {
        answer.style.backgroundColor='red'; 
        answer.style.pointerEvents='none';
        if (this.secondTryAllowed) {
          this.secondTryAllowed = false;
          this.stopTimer();
          this.resetTimer();
          this.startTimer();
        } else {
          this.finished = true;

          setTimeout(()=>this.loadQuestion(),1000);
        }
      }
    }
  }
}
