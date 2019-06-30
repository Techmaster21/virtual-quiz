import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { handleError, httpOptionsJSON, URI } from '../constants';

/** Provides functionality relevant to administrators */
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  /** @ignore */
  constructor(private http: HttpClient) { }

  /** Whether this client is authorized to access the content on this page */
  private authorized = false;
  /** The token for the admin user */
  private token: string;

  /** Whether or not the admin is logged in */
  loggedIn() {
    return this.authorized;
  }

  /** Sets the value of the [token]{@link #token} */
  setToken(givenToken) {
    this.token = givenToken;
    this.authorized = true;
  }

  /** Gets the value of the [token]{@link #token} */
  getToken() {
    return this.token;
  }

  /** Logs the user in using the provided password */
  login(password): Observable<any> {
    // TODO find a better way to do this - can't handle strings for some reason
    return this.http.post<any>(URI.ADMIN.LOGIN, {password}, httpOptionsJSON).pipe(
      catchError(handleError)
    );
  }

  /** Uploads questions to the server */
  uploadQuestions(questions: File) {
    const req = new HttpRequest('POST', URI.QUESTIONS.SAVE, questions, { reportProgress: true });
    return this.http.request(req).pipe(
      map(event => this.getEventMessage(event, questions)),
      catchError(handleError)
    );
  }

  /** Return distinct message for sent, upload progress, & response events */
  private getEventMessage(event: HttpEvent<any>, file: File) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file "${file.name}" of size ${file.size}.`;

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = Math.round(100 * event.loaded / event.total);
        return `File "${file.name}" is ${percentDone}% uploaded.`;

      case HttpEventType.Response:
        return `File "${file.name}" was completely uploaded!`;

      default:
        return `File "${file.name}" surprising upload event: ${event}.`;
    }
  }
}
