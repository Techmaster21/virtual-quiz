import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'vq-timer',
  templateUrl: 'timer.component.html',
  styleUrls: ['timer.component.css']
})
export class TimerComponent {
  /*TODO I actually think the Timer setInterval() function is a setTimeout(), and worse, it may rely on the callback
   function to prevent it from calling the callback function more than once. If so, this is not good.
   */

  /**
   * Emitted when timer is started
   * @type {EventEmitter<any>}
   */
	@Output() started = new EventEmitter<any>();
  /**
   * Current milliseconds on timer
   * @type {number}
   */
	mseconds: number = 0;
  /**
   * Holds variable for setInterval()
   */
	timer: number;

  /**
   * Function to call every interval
   */
  private callback: Function;
  /**
   * Time between intervals
   */
  private msecondsTimeout: number;

  /**
   * Clears the current interval.
   */
  clearInterval() {
    this.callback = undefined;
    this.msecondsTimeout = undefined;
  }
  /**
   * Resets the Timer
   */
  resetTimer() {
    this.mseconds = 0.0;
  }
  /**
   * Stops, resets and starts the Timer
   */
  restartTimer() {
    this.stopTimer();
    this.resetTimer();
    this.startTimer();
  }
  /**
   * After the given interval in milliseconds, calls the given function.
   * @param callback
   *  given function
   * @param mseconds
   *  interval in milliseconds
   */
  setInterval(callback: Function, mseconds: number) {
    this.callback = callback;
    this.msecondsTimeout = mseconds;
  }
  /**
   * Starts the Timer.
   */
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
		this.started.emit(null);
	}
  /**
   * Stops the Timer
   */
	stopTimer() {
	    window.clearInterval(this.timer);
	    this.timer = undefined;
	}

	get seconds() {
	  return (this.mseconds/1000).toFixed(1);
  }

  /**
   * Checks if it's time to call the function, and if so, calls it.
   */
	private checkInterval() {
		if (this.mseconds >= this.msecondsTimeout) {
			this.callback();
		}
	}
}
