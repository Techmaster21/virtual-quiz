import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { TeamService } from './team.service';

@Injectable()
export class RegisterGuard implements CanActivate {

  constructor(private teamService: TeamService, private router: Router) {
  }

  /**
   * Prevents user from accessing game or gameOver pages before signing up
   * @returns {boolean}
   *  whether or not the user is allowed to navigate here
   */
  canActivate() {
    if (this.teamService.getTeam() === undefined) {
      this.router.navigate(['/signup']);
      return false;
    } else {
      return true;
    }
  }
}
