import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable ,  of , from} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { practiceQuestionsUrl, questionsUrl, answerCheckURL } from './constants';
import { Question } from './question';
import {Answer} from './answer';





const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/**
 * Serves Questions and adds and updates Results
 */
@Injectable()
export class QuestionService {

  constructor(private http: HttpClient) { }

  /**
   * Retrieves practice questions from the server
   * @returns {Observable<Question[]>}
   */
  getPracticeQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(practiceQuestionsUrl).pipe(
      map(questions => questions
        .map(question =>
          new Question(question.question, question.category, question.answers.map(answer => new Answer(answer.text)))
        )),
      catchError(this.handleError('getPracticeQuestions', []))
    );
  }
  /**
   * Retrieves questions from the server
   * @returns {Observable<Question[]>}
   */
  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(questionsUrl).pipe(
        map(questions => questions
          .map(question =>
            new Question(question.question, question.category, question.answers.map(answer => new Answer(answer.text)))
          )),
        catchError(this.handleError('getQuestions', []))
    );
  }

  checkAnswer(answer: Answer, index: number): Observable<boolean> {
    return this.http.put<boolean>(answerCheckURL, {answer: answer.text, index: index}, httpOptions).pipe(
      catchError(this.handleError<boolean>('checkAnswer'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
