import { TestBed, inject } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';
import { TeamService } from '../services/team.service';
import { AdminService } from '../services/admin.service';

describe('AuthInterceptor', () => {
  let teamServiceSpy: jasmine.SpyObj<TeamService>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;

  beforeEach(() => {
    const teamSpy = jasmine.createSpyObj('TeamService', ['getToken', 'getTeam']);
    const adminSpy = jasmine.createSpyObj('AdminService', ['loggedIn']);

    TestBed.configureTestingModule({
      providers: [AuthInterceptor,
        {provide: TeamService, useValue: teamSpy},
        {provide: AdminService, useValue: adminSpy}]
    });
    teamServiceSpy = TestBed.get(TeamService);
    adminServiceSpy = TestBed.get(AdminService);
  });

  it('should be created', inject([AuthInterceptor], (service: AuthInterceptor) => {
    expect(service).toBeTruthy();
  }));
});
