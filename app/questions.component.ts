import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { Question } from './question';
import { QuestionService } from './question.service';

import { TimerComponent } from './timer.component';


@Component({
    selector: 'my-questions',
    template: `
      <vq-timer
      (onStarted)="onStarted($event)"></vq-timer>
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
    `]
})
export class QuestionsComponent implements OnInit, AfterViewInit {

  @ViewChild(TimerComponent)
  private timerComponent: TimerComponent;

	questions: Question[];
  currentQuestion: Question;
  index = 0;
  subscription: any;
  secondTryAllowed: boolean = true;
  finished: boolean = false;
  points: number = 0;

	constructor(private router: Router,
    private questionService: QuestionService) { }

  seconds() { return 0; }
  startTimer() { this.timerComponent.startTimer() }
  stopTimer() { this.timerComponent.stopTimer() }
  resetTimer() { this.timerComponent.resetTimer() }
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
  onStarted(b: boolean) {
    setTimeout(()=>{
        if (this.secondTryAllowed) {
          this.secondTryAllowed = false;
          this.stopTimer();
          this.resetTimer();
          this.startTimer();
        } else {
          this.loadQuestion();
        }
    }, 60000);
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
  ngAfterViewInit() {
    setTimeout(() => this.seconds = () => this.timerComponent.mseconds/1000, 0);
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
        } else if (this.seconds() < 8) {
          this.points += 4;
        } else if (this.seconds() < 15) {
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
          this.stopTimer();
          setTimeout(()=>this.loadQuestion(),1000);
        }
      }
    }
  }
}
