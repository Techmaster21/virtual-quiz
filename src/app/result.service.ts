import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { resultsCheckURL, resultsURL } from './constants';
import { Result } from './result'

@Injectable()
export class ResultService {

  constructor(private http: Http) { }

  // TODO Better Names? Another way to do?
  /**
   * The Result object which contains identifying information about the user
   */
  private result: Result;

  /**
   * Sets the result
   * @param result
   *  the result to be stored
   */
  setResult(result: Result) {
    this.result = result;
  }

  /**
   * Gets the result from storage
   * @returns {Result}
   *  Result to be got
   */
  getResult() {
    return this.result;
  }

  /**
   * Requests server add a new result to the database
   * @param result
   *  - The Result to add
   * @returns {Promise<Result>}
   *  - the Result with a new _id
   */
  private post(result: Result): Promise<Result> {
    let headers = new Headers({
      'Content-Type': 'application/json'});

    return this.http
      .post(resultsURL, JSON.stringify(result), {headers: headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  /**
   * Requests server update a result in the database
   * @param result
   *  - The Result to update
   */
  private put(result: Result) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http
      .put(resultsURL, JSON.stringify(result), {headers: headers})
      .toPromise()
      .then(() => result)
      .catch(this.handleError);
  }
  /**
   * Saves the result to the database
   * @param result
   *  - Result to save
   * @returns {Promise<Result>}
   *  - The saved result
   */
  save(result: Result): Promise<Result>  {
    if (result._id) {
      return this.put(result);
    }
    return this.post(result);
  }
  getResultFromServer(result: Result): Promise<Result> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http
      .put(resultsCheckURL, JSON.stringify(result), {headers: headers})
      .toPromise()
      .then (res => res.json())
      .then((res)=> new Result(res.schoolName, res.team, res.timeStarted, res.timeEnded, res.points, res.currentQuestion, res._id))
      .catch(this.handleError);
  }
  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }


}
