import { Component, Input } from '@angular/core';

@Component({
	selector: 'vq-progress-bar',
	template: `
		<div class="w3-progress-container">
	        <div id="myBar" class="w3-progressbar w3-red" [style.width]="percentComplete()">
	        	<div class="w3-center w3-text-black">{{completed}}/{{outOf}}</div>
	        </div>
	    </div>
	`
})
export class ProgressBarComponent {
	@Input() completed: number;
	@Input() outOf: number;

	percentComplete() {
    	return this.completed/this.outOf*100 + '%';
  	}
}