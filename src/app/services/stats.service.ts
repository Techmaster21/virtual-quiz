import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
/** @ignore */
@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor() { }

  questions(points: number, index: number): Observable<any> {
    return of(true);
  }
}
