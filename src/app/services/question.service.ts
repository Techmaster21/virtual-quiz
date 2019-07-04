import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { handleError, URI } from '../constants';
import { Question } from '../../shared/question';
import { TeamService } from './team.service';

/** Provides functionality related to the question class */
@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  /** Holds headers for JSON objects, along with an authorization token */
  httpOptionsWithAuth: {};
  /** Question service constructor */
  constructor(private http: HttpClient, private teamService: TeamService) {
    const headers = { 'Content-Type': 'application/json',  authorization: this.teamService.getToken() };
    this.httpOptionsWithAuth = { headers: new HttpHeaders(headers) };
  }

  /** Retrieves questions from the server */
  getQuestions(): Observable<Question[]> {
    if (this.teamService.getPractice()) {
      return this.http.get<Question[]>(URI.PRACTICE_QUESTIONS.GET, this.httpOptionsWithAuth).pipe(
        catchError(handleError)
      );
    } else {
      return this.http.get<Question[]>(URI.QUESTIONS.GET, this.httpOptionsWithAuth).pipe(
        catchError(handleError)
      );
    }
  }

  /** Checks whether the selected answer is the correct one */
  checkAnswer(answerIndex: number, questionIndex: number): Observable<boolean> {
    const body = { answerIndex, questionIndex };
    if (this.teamService.getPractice()) {
      return this.http.put<boolean>(URI.PRACTICE_QUESTIONS.CHECK, body, this.httpOptionsWithAuth).pipe(
        catchError(handleError)
      );
    } else {
      return this.http.put<boolean>(URI.ANSWER.CHECK, body, this.httpOptionsWithAuth).pipe(
        catchError(handleError)
      );
    }
  }
}
