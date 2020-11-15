import { TestBed } from '@angular/core/testing';

import { TeamService } from './team.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { asyncData } from '../../testing/async-observable-helpers';
import { URI } from '../constants';
import { Team } from '../models/team';
import { HttpRequest } from '@angular/common/http';

describe('TeamService', () => {
  let teamService: TeamService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ TeamService ]
    });

    // mock out console.error
    spyOn(console, 'error');
    // mock out localstorage and reset for every test
    const store = {};
    spyOn(localStorage, 'getItem').and.callFake( (key) => {
      if (store[key] === undefined) {
        return null;
      }
      return store[key];
    });
    spyOn(localStorage, 'setItem').and.callFake( (key, value) => {
      return store[key] = value + '';
    });
    spyOn(localStorage, 'removeItem').and.callFake( (key) => {
      store[key] = null;
    });

    teamService = TestBed.inject(TeamService);
    httpTestingController = TestBed.inject(HttpTestingController);

    // mock out reloadWindow
    spyOn(teamService, 'reloadWindow');
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('setting token should put token in local storage', () => {
    const testToken = 'testToken';
    teamService.token = testToken;
    expect(localStorage.getItem('userToken')).toBe(testToken);
  });

  it('if token is in local storage then getting token should retrieve it', () => {
    const testToken = 'testToken';
    localStorage.setItem('userToken', testToken);
    expect(teamService.token).toBe(testToken);
  });

  describe('Given this is a practice round', () => {
    beforeEach(() => {
      teamService.practice = true;
    });

    it('#save should return the team and not send any requests to server', () => {
      const testTeam = new Team('testSchool', 1);
      teamService.save(testTeam).subscribe(
        team => expect(team).toEqual(testTeam),
        error => fail
      );
      httpTestingController.expectNone(URI.TEAM.SAVE);
    });

    describe('#getTeam should', () => {
      it('return the stored team given no team is provided', () => {
        const testTeam = new Team('testSchool', 1);
        // TODO I don't know if I like using another method to do this, but if I want team to be private, I don't have another choice
        teamService.save(testTeam).subscribe(() => {
          teamService.getTeam().subscribe(
            team => expect(team).toEqual(testTeam),
            error => fail
          );
        }, error => fail);
        httpTestingController.expectNone(URI.TEAM.GET);
      });

      it('save the team locally and return it, given a team is provided', () => {
        const testTeam = new Team('testSchool', 1);
        teamService.getTeam(testTeam).subscribe(
          team => {
            expect(team).toEqual(testTeam);
          },
          error => fail
        );
        httpTestingController.expectNone(URI.TEAM.GET);
      });
    });
  });

  describe('Given this is not a practice round', () => {
    describe('Given we dont have a user token', () => {
      describe('all methods that require authorization should return an error', () => {
        const forbidden = '403 Forbidden';
        const forbiddenError = { status: 403, statusText: 'Forbidden' };
        const expectedConsoleError = `Backend returned code ${forbiddenError.status}, body was: ${forbidden}`;
        const expectedObservableErrorMessage = 'Something bad happened; please try again later.';
        // TODO save should save the team if its a post, but return an error if its a put
        xit('#save should return an error', () => {
          const testTeam = new Team('testSchool', 1);
          teamService.save(testTeam).subscribe(
            teams => fail,
            error => expect(error).toBe(expectedObservableErrorMessage)
          );
          const req = httpTestingController.expectOne(URI.TEAM.SAVE);
          req.flush(forbidden, forbiddenError);
          expect(console.error).toHaveBeenCalledWith(expectedConsoleError);
        });
        it('#getTeam should return an error', () => {
          teamService.getTeam().subscribe(
            team => fail,
            error => expect(error).toBe(expectedObservableErrorMessage)
          );
          const req = httpTestingController.expectOne(URI.TEAM.GET);
          req.flush(forbidden, forbiddenError);
          expect(console.error).toHaveBeenCalledWith(expectedConsoleError);
        });
      });
    });

    describe('Given we have an invalid user token', () => {
      const invalidUserToken = 'invalidUserToken';
      const expired = 'Expired token';
      const forbiddenError = { status: 403, statusText: 'Forbidden' };
      const expectedConsoleError = `Backend returned code ${forbiddenError.status}, body was: ${expired}`;
      beforeEach(() => {
        teamService.token = invalidUserToken;
      });
      // TODO save should save the team if its a post, but return an error if its a put
      xit('#save should return an error', () => {
        const testTeam = new Team('testSchool', 1);
        teamService.save(testTeam).subscribe(
          teams => fail,
          error => {
            expect(error).toBe('Something bad happened; please try again later.');
            expect(localStorage.removeItem).toHaveBeenCalledWith('userToken');
            expect(localStorage.getItem('userToken')).toBeNull();
            expect(teamService.token).toBe('');
            expect(teamService.reloadWindow).toHaveBeenCalled();
        });
        const req = httpTestingController.expectOne(URI.TEAM.SAVE);
        req.flush(expired, forbiddenError);
        expect(console.error).toHaveBeenCalledWith(expectedConsoleError);
      });

      it('#getTeam should return an error', () => {
        teamService.getTeam().subscribe(
          teams => fail,
          error => {
            expect(error).toBe('Something bad happened; please try again later.');
            expect(localStorage.removeItem).toHaveBeenCalledWith('userToken');
            expect(localStorage.getItem('userToken')).toBeNull();
            expect(teamService.token).toBe('');
            expect(teamService.reloadWindow).toHaveBeenCalled();
        });
        const req = httpTestingController.expectOne(URI.TEAM.GET);
        req.flush(expired, forbiddenError);
        expect(console.error).toHaveBeenCalledWith(expectedConsoleError);
      });
    });

    describe('Given we have a valid user token', () => {
      const validUserToken = 'validUserToken';
      beforeEach(() => {
        teamService.token = validUserToken;
      });
      // TODO should this require authorization? The team already exists so it should authorize the user before updating
      xit('#save should update the team if it already exists', () => {
        const testTeam = new Team('testSchool', 1);
        testTeam._id = 'testId';
        teamService.save(testTeam).subscribe(
          team => expect(team).toEqual(testTeam),
          error => fail
        );
        const req = httpTestingController.expectOne(URI.TEAM.SAVE);
        expect(req.request.method).toBe('PUT');
        expect(req.request.headers.get('Authorization')).toBe(validUserToken);
        expect(req.request.responseType).toBe('json');
        req.flush(testTeam);
      });
      xit('#save should add the team if it does not exist', () => {
          // TODO complete
      });
    });
  });
});
