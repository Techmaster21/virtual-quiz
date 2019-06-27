import { TestBed, inject } from '@angular/core/testing';

import { TeamService } from './team.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('TeamService', () => {
  let teamService: TeamService;
  let httpClientSpy: { get: jasmine.Spy };
  let http: HttpTestingController;
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [TeamService]
    });

    teamService = TestBed.get(TeamService);
    http = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(teamService).toBeTruthy();
  });
});
