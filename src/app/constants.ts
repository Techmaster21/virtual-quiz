// All time is in milliseconds
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export const questionLoadDelay = 2 * 1000;
export const breakTime = 300 * 1000;
export const autoWrongGuess = 60 * 1000;
export const correctColor = '#009900';
export const incorrectColor = '#e50000';

// reexports HTTP request URIs
export { URI } from '../../server/uri';


export function handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  // return an observable with a user-facing error message
  return throwError(
    'Something bad happened; please try again later.');
}
