// All time is in milliseconds
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';

/** The amount of time to wait between loading each question, in milliseconds */
export const questionLoadDelay = 2 * 1000;
/** The amount of time each break lasts, in milliseconds */
export const breakTime = 300 * 1000;
/** The amount of time before no answer is counted as an automatic incorrect guess, in milliseconds */
export const autoWrongGuess = 60 * 1000;
/** The color of a correct answer */
export const correctColor = '#009000';
/** The color of an incorrect answer */
export const incorrectColor = '#D00000';

// reexports HTTP request URIs
export { URI } from '../shared/uri';

/** The default error handling method for HTTP requests */
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
  return throwError('Something bad happened; please try again later.');
}

/** Default json headers for put and post requests */
export const httpOptionsJSON = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/** Default text headers for put and post requests */
export const httpOptionsText = {
  headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
};
