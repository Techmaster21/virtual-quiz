import { Component, Input } from '@angular/core';

@Component({
  selector: 'vq-progress-bar',
  templateUrl: 'progress-bar.component.html',
  styleUrls: ['progress-bar.component.css']
})
export class ProgressBarComponent {
  /**
   * The number of actions completed
   */
	@Input() completed: number;
  /**
   * The number of actions to be completed
   */
	@Input() outOf: number;

  /**
   * Returns the progress as a percent
   * @returns {string}
   *  progress as a percent
   */
	percentComplete() {
	  return this.completed/this.outOf*100 + '%';
  }
}
