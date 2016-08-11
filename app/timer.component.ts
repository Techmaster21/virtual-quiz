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
	timer: number;

	callback: Function;
	msecondsTimeout: number;

	startTimer() {
		if (!this.timer) {
		    let time = Date.now();
		    this.timer = window.setInterval(()=> {
				this.mseconds += Date.now()-time;
				time = Date.now();
				if (this.callback) {
					this.checkInterval();
				}
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
	restartTimer() {
		this.stopTimer();
		this.resetTimer();
		this.startTimer();
	}
	setInterval(callback: Function, mseconds: number) {
		this.callback = callback;
		this.msecondsTimeout = mseconds;
	}
	checkInterval() {
		if (this.mseconds >= this.msecondsTimeout) {
			this.callback();
		}
	}
	clearInterval() {
		this.callback = undefined;
		this.msecondsTimeout = undefined;
	}
}