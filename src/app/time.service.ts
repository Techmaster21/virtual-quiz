import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { dateNowURL, dateStartURL } from './constants'
import { VQDate } from './vqdate';

@Injectable()
export class TimeService {


  constructor(private http: Http) { }

  // TODO This is an odd way to do this
  /**
   * The current date and time as determined by server
   * @returns {Promise<VQDate>}
   */
  getDateNow() {
    return this.http.get(dateNowURL)
      .toPromise()
      .then(response => response.json() as VQDate)
      .catch(this.handleError);
  }
  /**
   * The date and time that the competition begins
   * @returns {Promise<VQDate>}
   */
  getDateStart() {
    return this.http.get(dateStartURL)
      .toPromise()
      .then(response => response.json() as VQDate)
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
