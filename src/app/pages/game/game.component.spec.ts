import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../components/material/material.module';
import { TeamService } from '../../services/team.service';
import { QuestionService } from '../../services/question.service';
import { Router } from '@angular/router';
import { asyncData } from '../../../testing/async-observable-helpers';
import { TimerComponent } from '../../components/timer/timer.component';

@Component({selector: 'app-questions', template: ''})
class QuestionsStubComponent {
  @Input() finished; @Input() currentQuestion; @Input() index; @Input() pointsGained;
}

@Component({selector: 'app-timer', template: '',
  // necessary for testing to realize its not undefined
  providers: [{ provide: TimerComponent, useClass: TimerStubComponent }]})
class TimerStubComponent { start() {}}


describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  let teamServiceSpy: jasmine.SpyObj<TeamService>;
  let questionServiceSpy: jasmine.SpyObj<QuestionService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async(() => {
    const teamSpy = jasmine.createSpyObj('TeamService', ['save', 'getTeam', 'setTeam']);
    const questionSpy = jasmine.createSpyObj('QuestionService', ['getQuestions']);
    const router = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      imports: [ MaterialModule ],
      declarations: [ GameComponent, QuestionsStubComponent, TimerStubComponent ],
      providers: [
        {provide: TeamService, useValue: teamSpy},
        {provide: QuestionService, useValue: questionSpy},
        {provide: Router, useValue: router}]
    })
    .compileComponents();
    teamServiceSpy = TestBed.get(TeamService);
    questionServiceSpy = TestBed.get(QuestionService);
    routerSpy = TestBed.get(Router);
    teamServiceSpy.getTeam.and.returnValue({}); // doesn't seem to realize without this that getTeam will
    // return a team synchronously.
    questionServiceSpy.getQuestions.and.returnValue(asyncData({})); // ditto but observable
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
