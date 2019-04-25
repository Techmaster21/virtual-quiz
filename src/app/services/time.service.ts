import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,  of } from 'rxjs';

import { handleError, URI } from '../constants';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TimeService {


  constructor(private http: HttpClient) { }

  /**
   * @deprecated Used to be used to find out if the competition had started. Only keeping on off-chance it becomes useful
   * The current date and time as determined by server
   */
  getDateNow(): Observable<Date> {
    return this.http.get<Date>(URI.DATE.NOW).pipe(
      catchError(handleError)
    );
  }
  /**
   * @deprecated Used to be used to find out if the competition had started. Only keeping on off-chance it becomes useful
   * The date and time that the competition begins
   */
  getDateStart(): Observable<Date> {
    return this.http.get<Date>(URI.DATE.START).pipe(
      catchError(handleError)
    );
  }

  /**
   * Find out if we can start the game using the competition questions (as opposed to the practice ones)
   * @returns an observable which will send true if we can start and false otherwise
   */
  getCanStart(): Observable<boolean> {
    return this.http.get<boolean>(URI.DATE.CAN_START).pipe(
      catchError(handleError)
    );
  }
}
