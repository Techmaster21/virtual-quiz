import { TestBed } from '@angular/core/testing';

import { TeamService } from './team.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { asyncData } from '../../testing/async-observable-helpers';
import { URI } from '../constants';
import { Team } from '../models/team';
import { HttpRequest } from '@angular/common/http';

describe('TeamService', () => {
  let teamService: TeamService;
  let httpClientSpy: { get: jasmine.Spy, put: jasmine.Spy, post: jasmine.Spy };
  let http: HttpTestingController;
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'put', 'post']);
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

  it('#setTeam should set the team', () => {
    const expectedTeam: Team = new Team('name', 1);

    teamService.setTeam(expectedTeam);
    expect(teamService.getTeam()).toEqual(expectedTeam);
  });

  it('#setPractice should set the value of practice', () => {
    teamService.setPractice(true);
    expect(teamService.getPractice()).toEqual(true);
  });

  it('#getToken should return an empty string when the team has no token', () => {
    const team: Team = new Team('name', 1);

    teamService.setTeam(team);
    expect(teamService.getToken()).toEqual('');
  });

  it('#getToken should return a token when the team has a token', () => {
    const team: Team = { schoolName: 'name', teamNumber: 1, token: 'abcdefg123@4' };

    teamService.setTeam(team);
    expect(teamService.getToken()).toEqual(team.token);
  });

  it('#save should not save to server when practice is true', () => {
    const expectedTeam: Team = new Team('name', 1);

    teamService.setTeam(expectedTeam);
    teamService.setPractice(true);
    teamService.save(expectedTeam).subscribe(
      team => expect(team).toEqual(expectedTeam, 'expected team'),
      fail
    );
    http.expectNone(URI.TEAM.SAVE, 'expected no save');
  });

  it('#save should save using put to server when practice is false and team has an id', () => {
    const expectedTeam: Team = { schoolName: 'name', teamNumber: 1, _id: '1' };
    httpClientSpy.put.and.returnValue(asyncData(expectedTeam));

    teamService.setTeam(expectedTeam);
    teamService.setPractice(false);
    teamService.save(expectedTeam).subscribe(
      team => expect(team).toEqual(expectedTeam, 'expected team'),
      fail
    );

    http.expectOne((req: HttpRequest<any>) => {
      expect(req.body).toEqual(expectedTeam, 'expected team in request');
      return req.method === 'PUT' && req.url === URI.TEAM.SAVE;
    }, 'expected put');
  });

  it('#save should save using post to server when practice is false and team has no id', () => {
    const expectedTeam: Team = new Team('name', 1);
    httpClientSpy.post.and.returnValue(asyncData(expectedTeam));

    teamService.setTeam(expectedTeam);
    teamService.setPractice(false);
    teamService.save(expectedTeam).subscribe(
      team => expect(team).toEqual(expectedTeam, 'expected team'),
      fail
    );

    http.expectOne((req: HttpRequest<any>) => {
      expect(req.body).toEqual(expectedTeam, 'expected team in request');
      return req.method === 'POST' && req.url === URI.TEAM.SAVE;
    }, 'expected post');
  });

  it('#getTeam should get the provided team from the server', () => {
    const expectedTeam: Team = new Team('name', 1);
    httpClientSpy.put.and.returnValue(asyncData(expectedTeam));

    teamService.getTeamFromServer(expectedTeam).subscribe(
      team => expect(team).toEqual(expectedTeam, 'expected team'),
      fail
    );

    http.expectOne((req: HttpRequest<any>) => {
      expect(req.body).toEqual(expectedTeam, 'expected team in request');
      return req.method === 'PUT' && req.url === URI.TEAM.GET;
    }, 'expected put');
  });
});
