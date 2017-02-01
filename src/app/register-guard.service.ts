import { Injectable } from '@angular/core';
import { CanActivate, Router }    from '@angular/router';

import { ResultService } from './result.service';

@Injectable()
export class RegisterGuard implements CanActivate{

  constructor(private resultService: ResultService, private router: Router) { }

  /**
   * Prevents user from accessing game or gameOver pages before signing up
   * @returns {boolean}
   *  whether or not the user is allowed to navigate here
   */
  canActivate() {
    if (this.resultService.getResult() == undefined) {
      this.router.navigate(['/signup']);
      return false;
    }
    else {
      return true;
    }
  }
}
