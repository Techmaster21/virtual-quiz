import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GameOverComponent } from './game-over.component';
import { MaterialModule } from '../../components/material/material.module';
import { TeamService } from '../../services/team.service';
import { asyncData } from '../../../testing/async-observable-helpers';
import { Team } from '../../models/team';

describe('GameOverComponent', () => {
  let component: GameOverComponent;
  let fixture: ComponentFixture<GameOverComponent>;
  let teamServiceSpy: jasmine.SpyObj<TeamService>;

  beforeEach(waitForAsync(() => {
    const teamSpy = jasmine.createSpyObj('TeamService', ['save']);
    TestBed.configureTestingModule({
      imports: [ MaterialModule ],
      declarations: [ GameOverComponent ],
      providers: [ {provide: TeamService, useValue: teamSpy} ]
    })
    .compileComponents();
    teamServiceSpy = TestBed.get(TeamService);
    teamServiceSpy.save.and.returnValue(asyncData({} as Team)); // doesn't seem to realize without this that save will
    // return an observable synchronously.
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameOverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
