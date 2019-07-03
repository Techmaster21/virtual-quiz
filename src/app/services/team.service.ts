import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { handleError, httpOptionsJSON, URI } from '../constants';
import { Team } from '../models/team';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

/** Provides server functionality related to the team class */
@Injectable({
  providedIn: 'root'
})
export class TeamService {

  /** Team service constructor */
  constructor(private http: HttpClient) { }

  /** The Team object which contains identifying information about the user */
  private team: Team;
  /** Whether or not this is a practice game */
  private practice: boolean;

  /** Sets the [team]{@link #team} */
  setTeam(team: Team) {
    this.team = team;
  }

  /** Gets the [team]{@link #team} from storage */
  getTeam(): Team {
    return this.team;
  }

  /** Sets the value of the [practice]{@link #practice} variable */
  setPractice(practice: boolean) {
    this.practice = practice;
  }

  /** Gets the value of the [practice]{@link #practice} variable. */
  getPractice(): boolean {
    return this.practice;
  }

  /**
   * Gets the value of the authorization token from the currently loaded team
   * @returns
   *  The token if it exists; otherwise an empty string
   */
  getToken(): string {
    const token = this.team.token;
    if (token) {
      return token;
    } else {
      return '';
    }
  }

  /**
   * Requests the server to add a new team
   * @returns
   *  The team with a new _id
   */
  private post(team: Team): Observable<Team> {
    return this.http.post<Team>(URI.TEAM.SAVE, team, httpOptionsJSON).pipe(
      catchError(handleError)
    );
  }

  /** Requests the server to update a team */
  private put(team: Team): Observable<Team> {
    return this.http.put<Team>(URI.TEAM.SAVE, team, httpOptionsJSON).pipe(
      catchError(handleError)
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
  getTeamFromServer(team: Team): Observable<Team> {
    return this.http.put<Team>(URI.TEAM.GET, team, httpOptionsJSON).pipe(
      catchError(handleError)
    );
  }
}
