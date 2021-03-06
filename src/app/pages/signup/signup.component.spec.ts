// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { SignupComponent } from './signup.component';
// import { MaterialModule } from '../../components/material/material.module';
// import { ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { TeamService } from '../../services/team.service';
// import { TimeService } from '../../services/time.service';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { asyncData } from '../../../testing/async-observable-helpers';
// import { Team } from '../../models/team';

// describe('SignupComponent', () => {
//   let component: SignupComponent;
//   let fixture: ComponentFixture<SignupComponent>;

//   let routerSpy: jasmine.SpyObj<Router>;
//   let teamServiceSpy: jasmine.SpyObj<TeamService>;
//   let timeServiceSpy: jasmine.SpyObj<TimeService>;

//   beforeEach(async(() => {
//     const router = jasmine.createSpyObj('Router', ['navigate']);
//     const teamSpy = jasmine.createSpyObj('TeamService', ['getTeamFromServer']);
//     const timeSpy = jasmine.createSpyObj('TimeService', ['getCanStart']);
//     TestBed.configureTestingModule({
//       imports: [ MaterialModule, ReactiveFormsModule, BrowserAnimationsModule ],
//       declarations: [ SignupComponent ],
//       providers: [
//         {provide: Router, useValue: router},
//         {provide: TeamService, useValue: teamSpy},
//         {provide: TimeService, useValue: timeSpy}]
//     })
//     .compileComponents();

//     routerSpy = TestBed.get(Router);
//     teamServiceSpy = TestBed.get(TeamService);
//     timeServiceSpy = TestBed.get(TimeService);
//     teamServiceSpy.getTeam.and.returnValue(asyncData({} as Team)); // ditto as below
//     timeServiceSpy.getCanStart.and.returnValue(asyncData(true));
//     // required for test to realise is real value not undefined
//     // obviously not ideal
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SignupComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
