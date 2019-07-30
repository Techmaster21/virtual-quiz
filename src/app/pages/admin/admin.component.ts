import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

/** Page concerned with admin functionality */
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  /** The link to the team CSV file */
  file;
  /** Output to show to the user */
  consoleOutput = ''; // should be a class with an add() method
  /** The login form containing the password */
  loginForm = new FormGroup({
    password: new FormControl('')
  });

  /** Returns the admin service. Used by html to avoid violating private access */
  get admin() {
    return this.adminService;
  }

  /** Admin component constructor */
  constructor(private adminService: AdminService, private sanitizer: DomSanitizer) { }

  /** Checks if token is valid on page init */
  ngOnInit() {
    if (this.adminService.loggedIn()) {
      this.adminService.checkToken().subscribe();
    }
  }

  /** Called when the user attempts to log in */
  onSubmit() {
    this.adminService.login(this.loginForm.value.password).subscribe( token => {
      if (token !== 'err') {
        this.adminService.token = token;
      } else {
        // todo incorrect password state somewhere
      }
    });
  }

  /** Gets the teams from the server, sorts them by points, and outputs in a nice csv format */
  getTeams(link: HTMLAnchorElement) {
    this.adminService.getTeams().subscribe(teams => {
      if (!teams) {
        return;
      }
      const data = teams
        .filter(team => team.points) // remove teams with no points
        .sort((a, b) => a.points - b.points) // sort teams according to points in ascending order
        .map(team => `${team.schoolName},${team.teamNumber},${team.points}`) // map to strings
        .concat(['School,Team Number,Points']) // add header
        .reverse() // change to descending order
        .join('\n');
      const blob = new Blob([data], {type: 'text/csv'});
      const url = window.URL.createObjectURL(blob);
      this.file = this.sanitizer.bypassSecurityTrustUrl(url);
      // in case it doesn't get set in time (which it often doesn't)
      link.href = url;
      link.click();
      window.URL.revokeObjectURL(url);
    });

  }

  /** Upload the questions to the server */
  fileUpload(file: HTMLInputElement): void {
    this.adminService.uploadQuestions(file.files[0]).subscribe(
      res =>  {
        this.consoleOutput += res + '\n';
      }, err => {
        this.consoleOutput += err + '\n';
      });
  }
}
