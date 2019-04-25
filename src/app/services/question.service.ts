import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { handleError, URI } from '../constants';
import { Question } from '../models/question';
import { TeamService } from './team.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/**
 * Serves Questions and adds and updates Results
 */
@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient, private teamService: TeamService) { }

  /**
   * Retrieves questions from the server
   */
  getQuestions(): Observable<Question[]> {
    if (this.teamService.getPractice()) {
      return this.http.get<Question[]>(URI.PRACTICE_QUESTIONS.GET).pipe(
        catchError(handleError)
      );
    } else {
      return this.http.get<Question[]>(URI.QUESTIONS.GET).pipe(
        catchError(handleError)
      );
    }
  }

  checkAnswer(answer: string, index: number): Observable<boolean> {
    if (this.teamService.getPractice()) {
      return this.http.put<boolean>(URI.PRACTICE_QUESTIONS.CHECK, {answer, index}, httpOptions).pipe(
        catchError(handleError)
      );
    } else {
      return this.http.put<boolean>(URI.ANSWER.CHECK, {answer, index}, httpOptions).pipe(
        catchError(handleError)
      );
    }
  }
}
