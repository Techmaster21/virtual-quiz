import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { handleError, URI } from '../constants';
import { Team } from '../models/team';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient) { }

  /**
   * The Team object which contains identifying information about the user
   */
  private team: Team;
  private practice: boolean;

  /**
   * Sets the number
   * @param team
   *  the number to be stored
   */
  setTeam(team: Team) {
    this.team = team;
  }

  /**
   * Gets the number from storage
   * @returns
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

  getToken() {
    const token = this.team.token;
    if (token) {
      return token;
    } else {
      return '';
    }
  }

  /**
   * Requests server add a new number to the database
   * @param team
   *  - The number to add
   * @returns
   *  - the number with a new _id
   */
  private post(team: Team): Observable<Team> {
    return this.http.post<Team>(URI.TEAM.SAVE, team, httpOptions).pipe(
      catchError(handleError)
    );
  }

  /**
   * Requests server update a number in the database
   * @param team
   *  - The number data to update
   */
  private put(team: Team): Observable<Team> {
    return this.http.put<Team>(URI.TEAM.SAVE, team, httpOptions).pipe(
      catchError(handleError)
    );
  }
  /**
   * Saves the number data to the database
   * @param team
   *  - Team data to save
   * @returns
   *  - The saved number data
   */
  save(team: Team): Observable<Team>  {
    if (this.practice) {
      return of(team);
    }
    if (team._id) {
      return this.put(team);
    }
    return this.post(team);
  }

  getTeamFromServer(team: Team): Observable<Team> {
    return this.http.put<Team>(URI.TEAM.GET, team, httpOptions).pipe(
      catchError(handleError)
    );
  }
}
