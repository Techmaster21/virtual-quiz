import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpEventType, HttpHeaders,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { handleError, httpOptionsText, URI } from '../constants';
import { Team } from '../models/team';

/** Provides functionality relevant to administrators */
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  /** Admin service constructor */
  constructor(private http: HttpClient) { }

  /** Whether this client is authorized to access the content on this page */
  private authorized = false;
  /** The token for the admin user */
  private token = '';

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
  login(password: string): Observable<string> {
    return this.http.post<string>(URI.ADMIN.LOGIN, password, {... httpOptionsText, responseType: 'text' as 'json'}).pipe(
      catchError(handleError)
    );
  }

  /** Gets all of the teams from the server */
  getTeams(): Observable<Team[]> {
    const httpOptions = { headers: new HttpHeaders({ authorization: this.getToken() }) };
    return this.http.get<Team[]>(URI.TEAM.GET_ALL, httpOptions).pipe(
      catchError(handleError)
    );
  }

  /** Uploads questions to the server */
  uploadQuestions(questions: File) {
    const httpOptions = { reportProgress: true, headers: new HttpHeaders({ authorization: this.getToken() })  };
    const req = new HttpRequest('POST', URI.QUESTIONS.SAVE, questions, httpOptions);
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
