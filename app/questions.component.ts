import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Question } from './question'

@Component({
	selector: 'vq-questions',
	template: `
		<div class="w3-panel w3-light-grey w3-border">
			<h5>{{question.question}}</h5>
		</div>
		<div class="questions">
			<button class="w3-btn-block"
				#answerElement *ngFor="let answer of question.answers"
				(click)="onClick(answerElement)"
				[style.backgroundColor]="color(answer)">{{answer}}</button>
		</div>
	`,
	styles: [`
		.questions button {
			color:#000;
			background-color: #f1f1f1;
			margin-top: 0.5rem;
			margin-bottom: 0.5rem;
		}
		.questions {
			margin: 1rem;
		}
	`]
})
export class QuestionsComponent {
	@Input() question: Question;
	@Input() finished: boolean;
	@Output() onAnswerClicked = new EventEmitter<string>();

	onClick(answer: HTMLElement) {
		if (!this.finished){
			if (answer.innerHTML === this.question.correctAnswer) { //this scares me because easy to break (w/ spaces eg)
				this.onAnswerClicked.emit('correct');
				answer.style.backgroundColor='green'; // should not be modifying DOM - should find a way to do with Angular Animations
				answer.style.pointerEvents='none';
			} else {
				this.onAnswerClicked.emit('incorrect');
				answer.style.backgroundColor='red'; 
				answer.style.pointerEvents='none';
			}
		}
	}
	color(answer: string) {
		if (this.finished) {
			if (answer===this.question.correctAnswer) {
				return 'green';
			}
			else {
				return 'red';
			}
		}
	}
}