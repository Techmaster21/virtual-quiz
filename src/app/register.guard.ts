import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { TeamService } from './services/team.service';

/** Prevents user from accessing game or game-over pages before signing up */
@Injectable({
  providedIn: 'root',
})
export class RegisterGuard implements CanActivate {

  /** Register guard constructor */
  constructor(private teamService: TeamService, private router: Router) {
  }

  /** Whether or not the user is allowed to activate this route */
  canActivate(): boolean {
    if (this.teamService.getTeam() === undefined) {
      this.router.navigate(['/signup']);
      return false;
    } else {
      return true;
    }
  }
}
