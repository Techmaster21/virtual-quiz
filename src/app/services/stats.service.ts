import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { URI } from '../../shared/uri';
import { catchError } from 'rxjs/operators';
import { handleError } from '../constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TeamService } from './team.service';

/** @ignore */
@Injectable({
  providedIn: 'root'
})
export class StatsService {
/* most useful metric would be showing percentage that picked each potential answer for each question on their first try
 * May also be interesting to know the time it took and how many got it on the second try.
 * Question, Answer 1, Percentage answer 1, Answer 2, Percentage Answer 2, Answer 3, Percentage answer 3, Answer 4,
 * Percentage answer 4, Correct Answer
 *
 * how to store in database? Separate collection called stats, contains multiple records, one per question (to allow them
 * to be easily found and changed). Indexed based on question number. Needs to be changed whenever new questions are uploaded.
 * Initially entries are the same as "questions" but with "correctAnswer" included, plus an array of zeroes called "firstTry"
 * (Could also include a second one called "secondTry")
 * Timing would also be useful. For this to be interesting however, need to store the time for each team (anonymously ofc)
 * so that you can perform meaningful statistics on it.
 * In order to enable these need a function with the following arguments: questionIndex, answerIndex, firstTryTime,
 * secondTryTime, points. These arguments should be sent to the server and the server will handle from there.
 **/
  /** Holds headers for JSON objects, along with an authorization token */
  httpOptionsWithAuth: {};
  /** Question service constructor */
  constructor(private http: HttpClient, private teamService: TeamService) {
    const headers = { 'Content-Type': 'application/json',  authorization: this.teamService.token };
    this.httpOptionsWithAuth = { headers: new HttpHeaders(headers) };
  }

  saveStats(questionIndex: number, firstTryIndex: number, firstTryTime: number, secondTryIndex: number, secondTryTime: number,
            points: number): Observable<any> {
    if (this.teamService.practice) {
      return of(true);
    } else {
      const body = { questionIndex, firstTryIndex, firstTryTime, secondTryIndex, secondTryTime, points };
      return this.http.put<boolean>(URI.STATS.SAVE, body, this.httpOptionsWithAuth).pipe(
        catchError(handleError)
      );
    }
  }
}
