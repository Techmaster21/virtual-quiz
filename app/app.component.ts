import { Component } from '@angular/core';

import { QuestionService } from './question.service';

@Component({
    selector: 'my-app',
    template: `
    	<div class="w3-container">
    		<h1>VirtualQuiz</h1>
    	</div>
    	<router-outlet></router-outlet>
    `,
    styles: [`
	    .w3-container {
	    	color: white;
	    	background-color: #CC0000;
	    }
    `
    ],
    providers: [QuestionService]
})
export class AppComponent {
}
