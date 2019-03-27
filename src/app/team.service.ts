import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { resultsCheckURL, resultsURL } from './constants';
import { Team } from './team';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class TeamService {

  constructor(private http: HttpClient) { }

  /**
   * The Team object which contains identifying information about the user
   */
  private team: Team;
  private practice: boolean;

  /**
   * Sets the team
   * @param team
   *  the team to be stored
   */
  setTeam(team: Team) {
    this.team = team;
  }

  /**
   * Gets the team from storage
   * @returns {Team}
   *  Team to be got
   */
  getTeam() {
    return this.team;
  }

  setPractice(practice: boolean) {
    this.practice = practice;
  }

  getPractice() {
    return this.practice;
  }

  /**
   * Requests server add a new team to the database
   * @param {Team} team
   *  - The team to add
   * @returns {Observable<Team>}
   *  - the team with a new _id
   */
  private post(team: Team): Observable<Team> {
    return this.http.post<Team>(resultsURL, team, httpOptions).pipe(
      catchError(this.handleError<Team>('postTeam'))
    );
  }

  /**
   * Requests server update a team in the database
   * @param {Team} team
   *  - The team data to update
   * @returns {Observable<Team>}
   */
  private put(team: Team): Observable<Team> {
    return this.http.put<Team>(resultsURL, team, httpOptions).pipe(
      catchError(this.handleError<Team>('putTeam'))
    );
  }
  /**
   * Saves the team data to the database
   * @param team
   *  - Team data to save
   * @returns {Observable<Result>}
   *  - The saved team data
   */
  save(team: Team): Observable<Team>  {
    if (team._id) {
      return this.put(team);
    }
    return this.post(team);
  }

  getTeamFromServer(team: Team): Observable<Team> {
    return this.http.put<Team>(resultsCheckURL, team, httpOptions).pipe(
      catchError(this.handleError<Team>('getTeamFromServer'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
