import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { Question } from './question';

import { QuestionService } from './question.service';

import { TimerComponent } from './timer.component';
import { ProgressBarComponent } from './progress-bar.component';
import { QuestionsComponent } from './questions.component';


@Component({
	selector: 'vq-game',
	template: `
		<vq-timer (onStarted)="onStarted($event)"></vq-timer>
		{{points}}
		<button (click)="stopTimer()">Rest</button>
		<button (click)="startTimer()">UnRest</button>
		<div *ngIf="questions">
			<vq-questions (onAnswerClicked)="onAnswerClicked($event)"
				[finished]="finished"
				[question]="currentQuestion"></vq-questions>
			<vq-progress-bar [completed]="index"
				[outOf]="questions.length"></vq-progress-bar>
		</div>
	`,
	styles: [`
	`]
})
export class GameComponent implements OnInit, AfterViewInit {

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
	restartTimer() { this.timerComponent.restartTimer() }
	onStarted(b: boolean) {
		this.timerComponent.setInterval(()=>{
			if (this.secondTryAllowed) {
				this.secondTryAllowed = false;
				this.restartTimer();
			} else {
				this.loadQuestion();
			}
		}, 60000);
	}
	loadQuestion() {
		++this.index;
		if (this.questions[this.index]) {
			this.currentQuestion = this.questions[this.index];
			this.restartTimer();
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
	this.questionService.getQuestions()
						.then(questions => this.questions = questions)
						.then(() => this.currentQuestion = this.questions[0]); // proper? dunno. Better than before? hells yeah
	}
	ngOnInit() {
		this.getQuestions();
	}
	ngAfterViewInit() {
		setTimeout(() => this.seconds = () => this.timerComponent.mseconds/1000, 0);
		this.startTimer();
	}
	onAnswerClicked(result: string) {
		if (result === 'correct') {
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
			if (this.secondTryAllowed) {
				this.secondTryAllowed = false;
				this.restartTimer();
			} else {
				this.finished = true;
				this.stopTimer();
				setTimeout(()=>this.loadQuestion(),1000);
			}
		}
	}
}
