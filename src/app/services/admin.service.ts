import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { handleError, URI } from '../constants';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  private authorized = false;
  private token: string;

  loggedIn() {
    return this.authorized;
  }

  setToken(givenToken) {
    this.token = givenToken;
    this.authorized = true;
  }

  getToken() {
    return this.token;
  }

  login(password): Observable<any> {
    // TODO find a better way to do this - can't handle strings for some reason
    return this.http.post<any>(URI.ADMIN.LOGIN, {password}, httpOptions).pipe(
      catchError(handleError)
    );
  }

  // upload questions to server
  uploadQuestions(questions) {
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
