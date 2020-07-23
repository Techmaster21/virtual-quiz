import { Injectable } from '@angular/core';
import {
  HttpClient, HttpErrorResponse,
  HttpEvent,
  HttpEventType, HttpHeaders,
  HttpRequest
} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SHA3 } from 'crypto-js';

import { handleError, httpOptionsText, URI } from '../constants';
import { Team } from '../models/team';

/** Provides functionality relevant to administrators */
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  /** Admin service constructor */
  constructor(private http: HttpClient) { }

  /** The token for the admin user */
  private _token = '';

  /** Gets the value of the [token]{@link #_token} */
  get token() {
    const token = localStorage.getItem('adminToken');
    if (token) {
      this._token = token;
    }
    return this._token;
  }

  /** Sets the value of the [token]{@link #_token} */
  set token(givenToken: string) {
    localStorage.setItem('adminToken', givenToken);
    this._token = givenToken;
  }

  /** Whether or not the admin is logged in */
  loggedIn() {
    return this.token !== '';
  }

  /** Logs the user in using the provided password */
  login(password: string): Observable<string> {
    return this.http.post<string>(URI.ADMIN.LOGIN, SHA3(password).toString(), {... httpOptionsText, responseType: 'text' as 'json'}).pipe(
      catchError(this.handleErrorAdmin)
    );
  }

  /** Gets all of the teams from the server */
  getTeams(): Observable<Team[]> {
    const httpOptions = { headers: new HttpHeaders({ authorization: this.token }) };
    return this.http.get<Team[]>(URI.TEAM.GET_ALL, httpOptions).pipe(
      catchError(this.handleErrorAdmin)
    );
  }

  /** Uploads questions to the server */
  uploadQuestions(questions: File): Observable<string> {
    const reader: FileReader = new FileReader();

    const observable = new Subject<string>();
    // TODO is there a better way to do this that doesnt involve making a whole new observable, subscribing to the http request and just reemiting the values it already emitted?
    // https://stackoverflow.com/questions/42237909/angular2-return-inner-observable-of-nested-observables
    // https://stackoverflow.com/questions/46326446/return-observable-from-inside-nested-callbacks-functions
    reader.onloadend = (e: ProgressEvent<FileReader>) => {
      const csv: string = e.target.result as string;
      const httpOptions = { reportProgress: true, headers: new HttpHeaders({ Authorization: this.token, 'Content-Type': 'text/csv' }) };
      const req = new HttpRequest('POST', URI.QUESTIONS.SAVE, csv, httpOptions);
      this.http.request(req).pipe(
      map(event => this.getEventMessage(event, questions)),
      catchError(this.handleErrorAdmin)
      ).subscribe(s => {
        observable.next(s);
      }, err => {
        observable.error(err);
      }, () => {
        observable.complete();
      });
    };

    reader.readAsText(questions);

    return observable;
  }

  /** Checks that the current admin token is valid */
  checkToken() {
    const httpOptions = { headers: new HttpHeaders({ authorization: this.token }) };
    return this.http.get<boolean>(URI.ADMIN.CHECK_TOKEN, httpOptions).pipe(
      catchError(this.handleErrorAdmin)
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
  /** Handles expired tokens */
  private handleErrorAdmin(error: HttpErrorResponse) {
    if (error.error === 'Expired token' || error.error === 'Invalid token') {
      localStorage.removeItem('adminToken');
      this._token = '';
      location.reload();
    }
    return handleError(error);
  }
}
