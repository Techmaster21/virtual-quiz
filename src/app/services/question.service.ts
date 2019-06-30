import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { handleError, httpOptionsJSON, URI } from '../constants';
import { Question } from '../models/question';
import { TeamService } from './team.service';

/** Provides functionality related to the question class */
@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  /** @ignore */
  constructor(private http: HttpClient, private teamService: TeamService) { }

  /** Retrieves questions from the server */
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

  /**
   * Checks whether the selected answer is the correct one
   * @param answer
   *  The selected answer
   * @param index
   *  The index of the current question
   */
  checkAnswer(answer: string, index: number): Observable<boolean> {
    if (this.teamService.getPractice()) {
      return this.http.put<boolean>(URI.PRACTICE_QUESTIONS.CHECK, {answer, index}, httpOptionsJSON).pipe(
        catchError(handleError)
      );
    } else {
      return this.http.put<boolean>(URI.ANSWER.CHECK, {answer, index}, httpOptionsJSON).pipe(
        catchError(handleError)
      );
    }
  }
}
