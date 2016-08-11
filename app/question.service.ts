import { Injectable } from '@angular/core';

import { QUESTIONS } from './questions';

@Injectable()
export class QuestionService {
	getQuestions() {
		return Promise.resolve(QUESTIONS);
	}
}