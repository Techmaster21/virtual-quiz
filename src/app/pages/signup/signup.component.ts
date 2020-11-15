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
  get schoolName() {
    return this.signupForm.get('schoolName');
  }
  get teamNumber() {
    return this.signupForm.get('teamNumber');
  }
  get team() {
    return this.teamService.team;
  }
  /** Whether or not users are allowed to register */
  registrationAllowed = false;
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
      this.teamService.getTeam().subscribe(team => {
        // if the team in the token exists on the server, set the values of the form. Otherwise, ignore it.
        if (team) {
          this.schoolName.setValue(team.schoolName);
          this.teamNumber.setValue(team.teamNumber);
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
    const practiceTeam = new Team('School of Practice', 1337);
    this.teamService.practice = true;
    this.teamService.team = practiceTeam;
    this.router.navigate(['/game']);
  }

  /** Called when the Clear Submission button is pressed */
  onClickClear() {
    this.submitted = false;
    this.teamExists = false;
    this.schoolName.enable();
    this.teamNumber.enable();
  }

  /** Called on submission of the form */
  onSubmit() {
    const team = new Team(this.schoolName.value, this.teamNumber.value);
    this.teamService.getTeam(team).subscribe(
      serverTeam => {
        if (!serverTeam) {
          // if a team with such a name and number does not exist on the server currently, save it
          this.submitted = true;
          this.schoolName.disable();
          this.teamNumber.disable();
          this.teamService.save(team).subscribe(
            newTeam => {
              this.teamService.team = newTeam;
            }
          );
        } else if (serverTeam.timeEnded) {
          // else if it exists but has completed the game already
          this.submitted = false;
          this.teamExists = true;
          this.teamService.team = serverTeam;
        } else {
          // else it exists and has not completed the game yet
          this.submitted = true;
          this.teamExists = true;
          this.schoolName.disable();
          this.teamNumber.disable();
          this.teamService.team = serverTeam;
        }
      }
    );
  }
}
