// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { GameComponent } from './game.component';
// import { Component, Input } from '@angular/core';
// import { MaterialModule } from '../../components/material/material.module';
// import { TeamService } from '../../services/team.service';
// import { QuestionService } from '../../services/question.service';
// import { Router } from '@angular/router';
// import { asyncData } from '../../../testing/async-observable-helpers';
// import { TimerComponent } from '../../components/timer/timer.component';
// import { Team } from '../../models/team';
// import { Question } from '../../../shared/question';
// import { StatsService } from '../../services/stats.service';

// @Component({selector: 'app-questions', template: ''})
// class QuestionsStubComponent {
//   @Input() finished; @Input() currentQuestion; @Input() index; @Input() pointsGained;
// }

// @Component({selector: 'app-timer', template: '',
//   // necessary for testing to realize its not undefined
//   providers: [{ provide: TimerComponent, useClass: TimerStubComponent }]})
// class TimerStubComponent { start() {}}


// describe('GameComponent', () => {
//   let component: GameComponent;
//   let fixture: ComponentFixture<GameComponent>;

//   let teamServiceSpy: jasmine.SpyObj<TeamService>;
//   let questionServiceSpy: jasmine.SpyObj<QuestionService>;
//   let statsServiceSpy: jasmine.SpyObj<QuestionService>;
//   let routerSpy: jasmine.SpyObj<Router>;

//   beforeEach(async(() => {
//     const teamSpy = jasmine.createSpyObj('TeamService', ['save']);
//     const questionSpy = jasmine.createSpyObj('QuestionService', ['getQuestions']);
//     const statsSpy = jasmine.createSpyObj('StatsService', ['saveStats']);
//     const router = jasmine.createSpyObj('Router', ['navigate']);
//     TestBed.configureTestingModule({
//       imports: [ MaterialModule ],
//       declarations: [ GameComponent, QuestionsStubComponent, TimerStubComponent ],
//       providers: [
//         {provide: TeamService, useValue: teamSpy},
//         {provide: QuestionService, useValue: questionSpy},
//         {provide: StatsService, useValue: statsSpy},
//         {provide: Router, useValue: router}]
//     })
//     .compileComponents();
//     teamServiceSpy = TestBed.get(TeamService);
//     questionServiceSpy = TestBed.get(QuestionService);
//     statsServiceSpy = TestBed.get(StatsService);
//     routerSpy = TestBed.get(Router);
//     questionServiceSpy.getQuestions.and.returnValue(asyncData({} as Question[])); // ditto but observable
//     teamServiceSpy.team = new Team('', 1);
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(GameComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
