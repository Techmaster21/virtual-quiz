import { Component, OnInit } from '@angular/core';

import { Team } from '../team';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-game-over',
  templateUrl: 'game-over.component.html',
  styleUrls: ['game-over.component.css']
})
export class GameOverComponent implements OnInit {
  /**
   * The Result object which contains identifying information about the user
   */
  team: Team;
  saving: boolean;

  constructor(private teamService: TeamService) { }

  /**
   * Converts miliseconds to human readable time
   * @returns {string}
   *  human readable time string
   */
  msToTime() {
    let s = this.team.timeEnded - this.team.timeStarted;
    let ms = s % 1000;
    s = (s - ms) / 1000;
    let secs = s % 60;
    s = (s - secs) / 60;
    let mins = s % 60;
    let hrs = (s - mins) / 60;

    return hrs + ':' + mins + ':' + secs + '.' + ms;
  }
  ngOnInit() {
    this.saving = true;
    this.team = this.teamService.getTeam();
    if (!this.teamService.getPractice()) {
      this.teamService.save(this.team).subscribe(
        // Wipes out copy of result in resultService to prevent user from playing again and modifying their results
        () => {
          this.teamService.setTeam(undefined);
          this.saving = false;
        }
      );
    }
    if (this.teamService.getPractice()) {
      this.saving = false;
    }
  }
}
