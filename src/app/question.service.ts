import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Answer } from './answer';
import { key, practiceQuestionsUrl, questionsUrl, answerCheckURL } from './constants';
import { Question } from './question';

/**
 * Serves Questions and adds and updates Results
 */
@Injectable()
export class QuestionService {

  constructor(private http: Http) { }

  /**
   * Requests practice questions from the server
   * @returns {Promise<Question[]>}
   *  - A Promise to return the Questions
   */
  getPracticeQuestions() {
    return this.http.get(practiceQuestionsUrl)
      .toPromise()
      .then(response => response.json()
        .map(question => new Question(question.question, question.category, question.answers.map(text=> new Answer(text)))))
      .catch(this.handleError);
  }
  /**
   * Requests questions from the server
   * @returns {Promise<Question[]>}
   *  - A Promise to return the Questions
   */
  getQuestions() {
    return this.http.get(questionsUrl)
      .toPromise()
      .then(response => response.json()
        .map(question => new Question(question.question, question.category, question.answers.map(text=> new Answer(text)))))
      .catch(this.handleError);
  }

  checkAnswer(answer: Answer, index): Promise<boolean> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http
      .put(answerCheckURL, JSON.stringify({"answer": answer.text, "index": index}), {headers: headers})
      .toPromise()
      .then(res => res.json().correct)
      .catch(this.handleError);
  }

	private handleError(error: any) {
	  console.error('An error occurred', error);
	  return Promise.reject(error.message || error);
	}
}
