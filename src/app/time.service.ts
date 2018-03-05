import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { dateNowURL, dateStartURL, canStartURL } from './constants';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';


@Injectable()
export class TimeService {


  constructor(private http: HttpClient) { }

  // TODO This is an odd way to do this
  /**
   * The current date and time as determined by server
   * @returns {Observable<Date>}
   */
  getDateNow(): Observable<Date> {
    return this.http.get<Date>(dateNowURL).pipe(
      catchError(this.handleError<Date>('getDateNow'))
    );
  }
  /**
   * The date and time that the competition begins
   * @returns {Observable<Date>}
   */
  getDateStart(): Observable<Date> {
    return this.http.get<Date>(dateStartURL).pipe(
      catchError(this.handleError<Date>('getDateStart'))
    );
  }

  getCanStart(): Observable<boolean> {
    return this.http.get<boolean>(canStartURL).pipe(
      catchError(this.handleError<boolean>('getCanStart'))
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
