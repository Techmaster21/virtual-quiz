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
  consoleOutput = ''; // should be a class that with an add() method

  /** Admin component constructor */
  constructor(private adminService: AdminService, private sanitizer: DomSanitizer) { }

  /** Checks if token is valid on page init */
  ngOnInit() {
    if (this.adminService.loggedIn()) {
      this.adminService.checkToken().subscribe();
    }
  }

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
        this.adminService.token = token;
      } else {
        // todo incorrect password state somewhere
      }
    });
  }

  /** Gets the teams from the server, sorts them by points, and outputs in a nice csv format */
  getTeams(link: HTMLAnchorElement) {
    this.adminService.getTeams().subscribe(teams => {
      console.log(teams);
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
      // todo this would be funny if it weren't so sad (i have no idea why this is needed but it fails with
      //   'Failed - no file' on chrome on the first click if this isn't here soooo)
      // i thought it might have something to do with href not getting set fast enough but console.log doesn't support
      // this - works on safari just fine
      // everything here should be synchronous so the file should exist by the time the link is clicked
      // unless link isn't actually a reference, but rather a copied value. console.log doesnt support this.
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
