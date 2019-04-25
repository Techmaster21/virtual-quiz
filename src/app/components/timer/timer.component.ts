import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: 'timer.component.html',
  styleUrls: ['timer.component.css']
})
export class TimerComponent {
  /*
  TODO I actually think the Timer setInterval() function is a setTimeout(), and worse, it may rely on the callback
      function to prevent it from calling the callback function more than once. If so, this is not good.
   */

  /**
   * Emitted when timer is started
   */
  @Output() started = new EventEmitter<any>();
  /**
   * Current milliseconds on timer
   */
  milliseconds = 0;
  /**
   * Holds variable for setInterval()
   */
  timer: number;

  /**
   * Function to call every interval
   */
  private callback: () => void;
  /**
   * Time between intervals
   */
  private millisecondsTimeout: number;

  /**
   * Clears the current interval.
   */
  clearInterval() {
    this.callback = undefined;
    this.millisecondsTimeout = undefined;
  }
  /**
   * Resets the Timer
   */
  reset() {
    this.milliseconds = 0.0;
  }
  /**
   * Stops, resets and starts the Timer
   */
  restart() {
    this.stop();
    this.reset();
    this.start();
  }
  /**
   * After the given interval in milliseconds, calls the given function.
   * @param callback
   *  given function
   * @param mseconds
   *  interval in milliseconds
   */
  setInterval(callback: () => void, mseconds: number) {
    this.callback = callback;
    this.millisecondsTimeout = mseconds;
  }
  /**
   * Starts the Timer.
   */
  start() {
    if (!this.timer) {
      let time = Date.now();
      this.timer = window.setInterval(() => {
        this.milliseconds += Date.now() - time;
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
  stop() {
    window.clearInterval(this.timer);
    this.timer = undefined;
  }

  // find a way to have this return a number instead
  get seconds(): string {
    return (this.milliseconds / 1000).toFixed(1);
  }

  /**
   * Checks if it's time to call the function, and if so, calls it.
   */
  private checkInterval() {
    if (this.milliseconds >= this.millisecondsTimeout) {
      this.callback();
    }
  }
}
