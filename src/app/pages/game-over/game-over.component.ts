import { Component, OnInit } from '@angular/core';

import { Team } from '../../models/team';
import { TeamService } from '../../services/team.service';

/** Page to which players are sent after the game finishes */
@Component({
  selector: 'app-game-over',
  templateUrl: 'game-over.component.html',
  styleUrls: ['game-over.component.css']
})
export class GameOverComponent implements OnInit {
  /** The Team object which contains identifying information about the user */
  team: Team;
  /** Whether or not we are in the process of saving data to the server */
  saving: boolean;

  /** Game over component constructor */
  constructor(private teamService: TeamService) { }

  /** Converts milliseconds to human readable time */
  msToTime() {
    let s = this.team.timeEnded - this.team.timeStarted;
    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = (s - mins) / 60;

    return hrs + 'h:' + mins + 'm:' + secs + '.' + ms + 's';
  }

  /** Saves the team */
  ngOnInit() {
    this.saving = true;
    this.team = this.teamService.team;
    this.teamService.save(this.team).subscribe(
      // Wipes out copy of team in teamService to prevent user from playing again and modifying their results
      () => {
        this.teamService.token = '';
        this.teamService.team = undefined;
        this.saving = false;
      }
    );
  }
}
