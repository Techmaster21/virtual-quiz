import { HttpEventType, HttpUploadProgressEvent, HttpDownloadProgressEvent, HttpSentEvent } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SHA3 } from 'crypto-js';
import { URI } from '../constants';
import { Team } from '../models/team';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let adminService: AdminService;
  let httpTestingController: HttpTestingController;
  const reader = new FileReader();
  const fakeFileData = 'Im some fake data';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ AdminService ]
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
    // mock out file reader since its method of asynchronous io isn't compatible with testing
    spyOn(reader, 'readAsText').and.callFake( (file) => {
      // TODO how to make it actually use passed in file data?
      reader.onloadend({ target: { result: fakeFileData } as FileReader } as ProgressEvent<FileReader>) ;
    });

    adminService = TestBed.inject(AdminService);
    httpTestingController = TestBed.inject(HttpTestingController);

    // mock out reloadWindow
    spyOn(adminService, 'reloadWindow');
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('setting token should put token in local storage', () => {
    const testToken = 'testToken';
    adminService.token = testToken;
    expect(localStorage.getItem('adminToken')).toBe(testToken);
  });

  it('if token is in local storage then getting token should retrieve it', () => {
    const testToken = 'testToken';
    localStorage.setItem('adminToken', testToken);
    expect(adminService.token).toBe(testToken);
  });

  describe('Given we dont have an admin token', () => {
    it('#loggedIn should return false', () => {
      expect(adminService.loggedIn()).toBe(false);
    });

    it('#login should login', () => {
      const testAdminToken = 'testAdminToken';
      const testPassword = 'testPassword';
      adminService.login(testPassword).subscribe(
        token => expect(token).toBe(testAdminToken),
        error => fail
      );
      const req = httpTestingController.expectOne(URI.ADMIN.LOGIN);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Content-Type')).toBe('text/plain');
      expect(req.request.responseType).toBe('text');
      expect(req.request.body).toBe(SHA3(testPassword).toString());

      // Respond with the mock token
      req.flush(testAdminToken);
    });

    describe('all methods that require authorization should return an error', () => {
      const forbidden = '403 Forbidden';
      const forbiddenError = { status: 403, statusText: 'Forbidden' };
      const expectedConsoleError = `Backend returned code ${forbiddenError.status}, body was: ${forbidden}`;
      const expectedObservableErrorMessage = 'Something bad happened; please try again later.';
      it('#getTeams should return an error', () => {
        adminService.getTeams().subscribe(
          teams => fail,
          error => expect(error).toBe(expectedObservableErrorMessage)
        );
        const req = httpTestingController.expectOne(URI.TEAM.GET_ALL);
        req.flush(forbidden, forbiddenError);
        expect(console.error).toHaveBeenCalledWith(expectedConsoleError);
      });
      it('#uploadQuestions should return an error', () => {
        const testFile = new File([new Blob([fakeFileData])], 'testFile');
        adminService.uploadQuestions(testFile, reader).subscribe(
          progress => expect(progress).toBe(`Uploading file "${testFile.name}" of size ${testFile.size}.`),
          error => expect(error).toBe(expectedObservableErrorMessage)
        );
        const req = httpTestingController.expectOne(URI.QUESTIONS.SAVE);
        req.flush(forbidden, forbiddenError);
        expect(console.error).toHaveBeenCalledWith(expectedConsoleError);
      });
      it('#checkToken should return an error', () => {
        adminService.checkToken().subscribe(
          token => fail,
          error => expect(error).toBe(expectedObservableErrorMessage)
        );
        const req = httpTestingController.expectOne(URI.ADMIN.CHECK_TOKEN);
        req.flush(forbidden, forbiddenError);
        expect(console.error).toHaveBeenCalledWith(expectedConsoleError);
      });
    });
  });

  describe('Given we have an invalid admin token', () => { // expired vs invalid?
    const invalidAdminToken = 'invalidAdminToken';
    const expired = 'Expired token';
    const forbiddenError = { status: 403, statusText: 'Forbidden' };
    const expectedConsoleError = `Backend returned code ${forbiddenError.status}, body was: ${expired}`;

    beforeEach(() => {
      adminService.token = invalidAdminToken;
    });

    it('#loggedIn should return true', () => {
      expect(adminService.loggedIn()).toBe(true);
    });

    it('#login should log in and return a valid token', () => {
      const testValidPassword = 'testPassword';
      const validAdminToken = 'validAdminToken';
      adminService.login(testValidPassword).subscribe(
        token => expect(token).toBe(validAdminToken),
        error => fail
      );
      const req = httpTestingController.expectOne(URI.ADMIN.LOGIN);
      req.flush(validAdminToken);
    });

    it('#getTeams should return an error', () => {
      adminService.getTeams().subscribe(
        teams => fail,
        error => {
          expect(error).toBe('Something bad happened; please try again later.');
          expect(localStorage.removeItem).toHaveBeenCalledWith('adminToken');
          expect(localStorage.getItem('adminToken')).toBeNull();
          expect(adminService.token).toBe('');
          expect(adminService.reloadWindow).toHaveBeenCalled();
      });
      const req = httpTestingController.expectOne(URI.TEAM.GET_ALL);
      req.flush(expired, forbiddenError);
      expect(console.error).toHaveBeenCalledWith(expectedConsoleError);
    });

    it('#uploadQuestions should return an error', () => {
      const testFile = new File([new Blob([fakeFileData])], 'testFile');
      adminService.uploadQuestions(testFile, reader).subscribe(
        teams => fail,
        error => {
          expect(error).toBe('Something bad happened; please try again later.');
          expect(localStorage.removeItem).toHaveBeenCalledWith('adminToken');
          expect(localStorage.getItem('adminToken')).toBeNull();
          expect(adminService.token).toBe('');
          expect(adminService.reloadWindow).toHaveBeenCalled();
      });
      const req = httpTestingController.expectOne(URI.QUESTIONS.SAVE);
      req.flush(expired, forbiddenError);
      expect(console.error).toHaveBeenCalledWith(expectedConsoleError);
    });

    it('#checkToken should return an error', () => {
      adminService.checkToken().subscribe(
        teams => fail,
        error => {
          expect(error).toBe('Something bad happened; please try again later.');
          expect(localStorage.removeItem).toHaveBeenCalledWith('adminToken');
          expect(localStorage.getItem('adminToken')).toBeNull();
          expect(adminService.token).toBe('');
          expect(adminService.reloadWindow).toHaveBeenCalled();
      });
      const req = httpTestingController.expectOne(URI.ADMIN.CHECK_TOKEN);
      req.flush(expired, forbiddenError);
      expect(console.error).toHaveBeenCalledWith(expectedConsoleError);
    });

  });


  describe('Given we have a valid admin token', () => {
    const testTeams = [new Team('testSchool1', 1), new Team('testSchool2', 2)];
    const validAdminToken = 'validAdminToken';
    beforeEach(() => {
      adminService.token = validAdminToken;
    });

    it('#loggedIn should return true', () => {
      expect(adminService.loggedIn()).toBe(true);
    });

    // TODO pended because this is the desired behavior but not the current behavior
    xit('#login should not login and should return valid token', () => {
      const testPassword = 'testPassword';
      adminService.login(testPassword).subscribe(
        token => expect(token).toBe(validAdminToken),
        error => fail
      );
      httpTestingController.expectNone(URI.ADMIN.LOGIN);
    });

    it('#getTeams should get Teams', () => {
      adminService.getTeams().subscribe(
        teams => expect(teams).toEqual(testTeams),
        error => fail
      );
      const req = httpTestingController.expectOne(URI.TEAM.GET_ALL);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(validAdminToken);
      expect(req.request.responseType).toBe('json');

      // Respond with the mock team
      req.flush(testTeams);
    });

    it('#checkToken should be able to check if admin token is valid', () => {
      adminService.checkToken().subscribe(
        valid => expect(valid).toEqual(true),
        error => fail
      );
      const req = httpTestingController.expectOne(URI.ADMIN.CHECK_TOKEN);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(validAdminToken);
      expect(req.request.responseType).toBe('json');
      // bc simply 'true' responds with "automatic conversion to json for response type not allowed" or something
      req.flush(new Boolean(true));
    });

    it('#uploadQuestions should be able to upload questions', () => {
      const testFile = new File([new Blob([fakeFileData])], 'testFile');
      const testSentEvent = {type: HttpEventType.Sent} as HttpSentEvent;
      const testUploadProgressEvent = {type: HttpEventType.UploadProgress, loaded: 10, total: testFile.size} as HttpUploadProgressEvent;
      const testUnexpectedEvent = {type: HttpEventType.DownloadProgress} as HttpDownloadProgressEvent;
      const percentDone = Math.round(100 * testUploadProgressEvent.loaded / testUploadProgressEvent.total);
      const expectedObservableValues =
          [`Uploading file "${testFile.name}" of size ${testFile.size}.`,
          `File "${testFile.name}" is ${percentDone}% uploaded.`,
          `File "${testFile.name}" surprising upload event: ${testUnexpectedEvent}.`,
          `File "${testFile.name}" was completely uploaded!`
          ];
      let index = 0;
      adminService.uploadQuestions(testFile, reader).subscribe(
        progress => expect(progress).toEqual(expectedObservableValues[index++]),
        error => fail
      );
      const req = httpTestingController.expectOne(URI.QUESTIONS.SAVE);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(validAdminToken);
      expect(req.request.responseType).toBe('json');
      req.event(testSentEvent);
      req.event(testUploadProgressEvent);
      req.event(testUnexpectedEvent);
      req.flush('completely uploaded');
    });
  });
});
