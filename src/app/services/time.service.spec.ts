import { TestBed } from '@angular/core/testing';

import { TimeService } from './time.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { URI } from '../constants';

describe('TimeService', () => {
  let timeService: TimeService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ TimeService ]
    });

    // mock out console.error
    spyOn(console, 'error');

    timeService = TestBed.inject(TimeService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('#getCanStart should be able to return true', () => {
    timeService.getCanStart().subscribe(
      result => expect(result).toEqual(true),
      error => fail
    );
    const req = httpTestingController.expectOne(URI.DATE.CAN_START);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('json');

    // bc simply 'true' responds with "automatic conversion to json for response type not allowed" or something
    req.flush(new Boolean(true));
  });

  it('#getCanStart should be able to return false', () => {
    timeService.getCanStart().subscribe(
      result => expect(result).toEqual(false),
      error => fail
    );
    const req = httpTestingController.expectOne(URI.DATE.CAN_START);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('json');

    // bc simply 'false' responds with "automatic conversion to json for response type not allowed" or something
    req.flush(new Boolean(false));
  });

  it('#getCanStart should catch errors', () => {
    timeService.getCanStart().subscribe(
      result => fail,
      error => expect(error).toBe('Something bad happened; please try again later.')
    );
    const req = httpTestingController.expectOne(URI.DATE.CAN_START);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('json');

    req.error(new ErrorEvent('friendlyError', {message: 'im a friendly error'}));
    expect(console.error).toHaveBeenCalledWith('An error occurred: im a friendly error');
  });

});
