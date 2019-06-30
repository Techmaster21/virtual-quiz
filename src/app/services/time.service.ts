import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { handleError, URI } from '../constants';
import { catchError } from 'rxjs/operators';

/** Provides functionality related to time */
@Injectable({
  providedIn: 'root'
})
export class TimeService {

  /** @ignore */
  constructor(private http: HttpClient) { }

  /** Find out if we can start the game using the competition questions (as opposed to the practice ones) */
  getCanStart(): Observable<boolean> {
    return this.http.get<boolean>(URI.DATE.CAN_START).pipe(
      catchError(handleError)
    );
  }
}
