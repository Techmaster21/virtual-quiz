import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { handleError, httpOptionsJSON, URI } from '../constants';
import { Team } from '../models/team';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

/** Provides server functionality related to the team class */
@Injectable({
  providedIn: 'root'
})
export class TeamService {

  /** Team service constructor */
  constructor(private http: HttpClient) { }

  /** The Team object which contains identifying information about the user */
  public team: Team;
  /** Whether or not this is a practice game */
  public practice: boolean;
  /** The token for the user */
  private _token = '';

  /** Gets the value of the [token]{@link #_token} */
  get token() {
    const token = localStorage.getItem('userToken');
    if (token) {
      this._token = token;
    }
    return this._token;
  }

  /** Sets the value of the [token]{@link #_token} */
  set token(givenToken: string) {
    localStorage.setItem('userToken', givenToken);
    this._token = givenToken;
  }

  /**
   * Requests the server to add a new team
   * @returns
   *  The team with a new _id
   */
  private post(team: Team): Observable<Team> {
    return this.http.post<[Team, string]>(URI.TEAM.SAVE, team, httpOptionsJSON).pipe(
      tap(result => this.token = result[1]),
      map(result => result[0]),
      catchError(this.handleErrorUser)
    );
  }

  /** Requests the server to update a team */
  private put(team: Team): Observable<Team> {
    return this.http.put<Team>(URI.TEAM.SAVE, team, httpOptionsJSON).pipe(
      catchError(this.handleErrorUser)
    );
  }
  /** Requests the server to save team data */
  save(team: Team): Observable<Team>  {
    if (this.practice) {
      return of(team);
    }
    if (team._id) {
      return this.put(team);
    }
    return this.post(team);
  }

  /** Retrieves the team from the server */
  getTeamFromServer(team?: Team): Observable<Team> {
    if (team) {
      return this.http.put<Team>(URI.TEAM.GET, team, httpOptionsJSON).pipe(
        catchError(this.handleErrorUser)
      );
    } else {
      const httpOptions = { headers: new HttpHeaders({ authorization: this.token }) };
      return this.http.get<Team>(URI.TEAM.GET, httpOptions).pipe(
        catchError(this.handleErrorUser)
      );
    }
  }
  /** Handles expired tokens */
  private handleErrorUser(error: HttpErrorResponse) {
    if (error.error === 'Expired token') {
      localStorage.removeItem('userToken');
      this._token = '';
      location.reload();
    }
    return handleError(error);
  }
}
