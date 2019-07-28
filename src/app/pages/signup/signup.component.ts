import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TimeService } from '../../services/time.service';
import { TeamService } from '../../services/team.service';
import { Team } from '../../models/team';
import { FormGroup, FormControl, Validators } from '@angular/forms';

/** Page on which users sign up and initiate game play */
@Component({
  selector: 'app-signup',
  templateUrl: 'signup.component.html',
  styleUrls: ['signup.component.css']
})
export class SignupComponent implements OnInit {
  /** The signup form that contains the school name and team number */
  signupForm = new FormGroup({
    schoolName: new FormControl('', Validators.required),
    teamNumber: new FormControl('', Validators.required)
  });
  /** Whether or not users are allowed to register */
  registrationAllowed = false;
  /** The Team object which contains identifying information about the user */
  team: Team = new Team('', undefined);
  /** Whether or not the given team already exists */
  teamExists = false;
  /** Whether or not the form has been successfully submitted */
  submitted = false;

  /** Signup component constructor */
  constructor(private router: Router,
              private teamService: TeamService,
              private timeService: TimeService
  ) { }

  /** Checks to see if the user is allowed to compete yet */
  ngOnInit() {
    this.timeService.getCanStart().subscribe(canStart => this.registrationAllowed = canStart);
    if (this.teamService.token !== '') {
      this.teamService.getTeamFromServer().subscribe(team => {
        if (team) {
          const schoolNameControl = this.signupForm.get('schoolName');
          const teamNumberControl = this.signupForm.get('teamNumber');
          schoolNameControl.setValue(team.schoolName);
          teamNumberControl.setValue(team.teamNumber);
          this.team = team;
        }
      });
    }
  }

  /** Called when Start Game button is pressed */
  onClick() {
    this.router.navigate(['/game']);
  }

  /** Called when Play Practice Set button is pressed */
  onClickPractice() {
    this.team.schoolName = 'School of practice';
    this.team.teamNumber = 1337;
    this.team._id = 'practice';
    this.teamService.practice = true;
    this.teamService.team = this.team;
    this.router.navigate(['/game']);
  }

  /** Called on submission of the form */
  onSubmit() {
    const schoolNameControl = this.signupForm.get('schoolName');
    const teamNumberControl = this.signupForm.get('teamNumber');
    this.team.schoolName = schoolNameControl.value;
    this.team.teamNumber = teamNumberControl.value;
    this.teamService.getTeamFromServer(this.team).subscribe(
      team => {
        if (!team) {
          this.submitted = true;
          schoolNameControl.disable();
          teamNumberControl.disable();
          this.teamService.save(this.team).subscribe(
            newTeam => {
              this.team = newTeam;
              this.teamService.team = newTeam;
            }
          );
        } else if (team.timeEnded) {
          this.submitted = false;
          this.teamExists = true;
        } else {
          this.submitted = true;
          this.teamExists = true;
          schoolNameControl.disable();
          teamNumberControl.disable();
          this.team = team;
          this.teamService.team = this.team;
        }
      }
    );
  }
}
