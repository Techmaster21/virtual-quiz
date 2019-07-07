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
    this.teamService.setPractice(true);
    this.teamService.setTeam(this.team);
    this.router.navigate(['/game']);
  }

  /** Called on submission of the form */
  onSubmit() {
    this.team.schoolName = this.signupForm.value.schoolName;
    this.team.teamNumber = this.signupForm.value.teamNumber;
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
