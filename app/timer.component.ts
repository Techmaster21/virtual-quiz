import { Component, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'vq-timer',
	template: `
	{{(mseconds/1000).toFixed(1)}}
	`
})
export class TimerComponent {
	@Output() onStarted = new EventEmitter<boolean>();
	mseconds: number = 0;
	timer: any; // correct class, what is?

	startTimer() {
	if (!this.timer) {
	    let time = Date.now();
	    this.timer = window.setInterval(()=> {
	      this.mseconds += Date.now()-time;
		  time = Date.now();
		  }, 100);
		}
		this.onStarted.emit(true);
	}
	stopTimer() {
	    window.clearInterval(this.timer);
	    this.timer = undefined;
	}
	resetTimer() {
	    this.mseconds = 0.0;
	}
}