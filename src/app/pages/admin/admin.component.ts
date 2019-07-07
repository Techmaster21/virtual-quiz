import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FormControl, FormGroup } from '@angular/forms';

/** Page concerned with admin functionality */
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  /** Output to show to the user */
  consoleOutput = ''; // should be a class that with an add() method

  /** Admin component constructor */
  constructor(private adminService: AdminService) { }

  /** Returns the admin service. Used by html to avoid violating private access */
  get admin() {
    return this.adminService;
  }

  /** The login form containing the password */
  loginForm = new FormGroup({
    password: new FormControl('')
  });

  /** Called when the user attempts to log in */
  onSubmit() {
    this.adminService.login(this.loginForm.value.password).subscribe( token => {
      if (token !== 'err') {
        this.adminService.setToken(token);
      } else {
        // todo incorrect password state somewhere
      }
    });
  }

  /** Upload the questions to the server */
  // todo rewrite as template reference variable as better practice
  //  https://angular.io/guide/user-input#get-user-input-from-a-template-reference-variable
  //   if possible (not sure that it is)
  fileUpload($event): void {
    const input = $event.target;
    this.adminService.uploadQuestions(input.files[0]).subscribe(
      res =>  {
        this.consoleOutput += res + '\n';
      }, err => {
        this.consoleOutput += err + '\n';
      });
  }
}
