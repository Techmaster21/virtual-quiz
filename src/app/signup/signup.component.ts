import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Result } from '../result';
import { ResultService } from '../result.service';
import { TimeService } from '../time.service';


@Component({
  selector: 'vq-signup',
  templateUrl: 'signup.component.html',
  styleUrls: ['signup.component.css']
})
export class SignupComponent implements OnInit {
  /**
   * True if user registration allowed, False otherwise
   * @type {boolean}
   */
  registrationAllowed: boolean = false;
  /**
   * The Result object which contains identifying information about the user
   */
  result: Result = new Result('', undefined);
  /**
   * True if school name and team already exist in the records; false otherwise
   * @type {boolean}
   */
  schoolExists: boolean = false;
  /**
   * True if form submitted successfully; false otherwise
   * @type {boolean}
   */
  submitted: boolean = false;

  constructor(private router: Router, private resultService: ResultService, private timeService: TimeService) { }

  ngOnInit() {
    // gets time from server and checks to see if the user is allowed to compete yet
    this.timeService.getDateNow().then(dateNow=>{
      this.timeService.getDateStart().then(dateStart=>{
        let now = new Date(dateNow.year, dateNow.month, dateNow.day, dateNow.hour);
        let start = new Date(dateStart.year, dateStart.month, dateStart.day, dateStart.hour);
        if (now.getTime() >= start.getTime()) {
          this.registrationAllowed = true;
        }
      });
    });
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
    this.result.schoolName = 'School of practice';
    this.result.team = 1337;
    this.result._id='practice';
    this.resultService.setResult(this.result);
    this.router.navigate(['/game']);
  }
  // TODO More forgiving - checkResult now checks if timeStarted. Is that its job though or should it leave that to this?
  /**
   * Called on submission of form
   */
  onSubmit() {
    this.resultService.getResultFromServer(this.result)
      .then((result)=> {
        if (result._id == null) {
          this.submitted = true;
          this.resultService.save(this.result)
            .then((result)=>this.result=result)
            .then(()=> this.resultService.setResult(this.result));
        }
        else if (result.timeEnded) {
          this.submitted = false;
        }
        else {
          this.submitted = true;
          this.result = result;
          this.resultService.setResult(this.result);
        }
      })
  }
}
