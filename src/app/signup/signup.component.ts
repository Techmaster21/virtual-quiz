import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TimeService } from '../time.service';
import {TeamService} from '../team.service';
import {Team} from '../team';


@Component({
  selector: 'app-signup',
  templateUrl: 'signup.component.html',
  styleUrls: ['signup.component.css']
})
export class SignupComponent implements OnInit {
  /**
   * True if user registration allowed, False otherwise
   * @type {boolean}
   */
  registrationAllowed = false;
  /**
   * The Result object which contains identifying information about the user
   */
  team: Team = new Team('', undefined);
  /**
   * True if school name and team already exist in the records; false otherwise
   * @type {boolean}
   */
  schoolExists = false;
  /**
   * True if form submitted successfully; false otherwise
   * @type {boolean}
   */
  submitted = false;

  constructor(private router: Router,
              private teamService: TeamService,
              private timeService: TimeService
  ) { }

  ngOnInit() {
    // gets time from server and checks to see if the user is allowed to compete yet
    this.timeService.getCanStart().subscribe(canStart => this.registrationAllowed = canStart);
  }

  /**
   * Called when Start Game button pressed
   */
  onClick() {
    this.router.navigate(['/game']);
  }

  /**
   * Called when Play Practice Set button pressed.
   */
  onClickPractice() {
    this.team.schoolName = 'School of practice';
    this.team.team = 1337;
    this.team._id = 'practice';
    this.teamService.setTeam(this.team);
    this.router.navigate(['/game']);
  }

  /**
   * Called on submission of form
   */
  onSubmit() {
    this.teamService.getTeamFromServer(this.team).subscribe(
      team => {
        if (team._id == null) {
          this.submitted = true;
          this.teamService.save(this.team).subscribe(
            newTeam => {
              this.team = newTeam;
              this.teamService.setTeam(newTeam);
            }
          );
        } else if (team.timeEnded) {
          this.submitted = false;
        } else {
          this.submitted = true;
          this.team = team;
          this.teamService.setTeam(this.team);
        }
      }
    );
  }
}
