import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  consoleOutput = ''; // should be a class that with an add() method

  constructor(private adminService: AdminService) { }

  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;

  get admin() {
    return this.adminService;
  }

  password: string;

  onSubmit() {
    this.adminService.login(this.password).subscribe( token => {
      if (token !== 'err') {
        this.adminService.setToken(token.token);
      } else {
        // todo incorrect password state somewhere
      }
    });
  }

  ngOnInit() {
  }

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
