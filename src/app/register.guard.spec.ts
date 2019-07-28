import { TestBed, inject } from '@angular/core/testing';

import { RegisterGuard } from './register.guard';
import { TeamService } from './services/team.service';
import { Router } from '@angular/router';

describe('RegisterGuard', () => {
  let teamServiceSpy: jasmine.SpyObj<TeamService>;
  let routerSpy: jasmine.SpyObj<Router>;
  beforeEach(() => {
    const teamSpy = jasmine.createSpyObj('TeamService', ['save']);
    const router = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        RegisterGuard,
        {provide: TeamService, useValue: teamSpy},
        {provide: Router, useValue: router}]
    });
    teamServiceSpy = TestBed.get(TeamService);
    routerSpy = TestBed.get(Router);
  });

  it('should be created', inject([RegisterGuard], (service: RegisterGuard) => {
    expect(service).toBeTruthy();
  }));
});
