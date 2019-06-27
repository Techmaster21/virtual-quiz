import { TestBed, inject } from '@angular/core/testing';

import { TimeService } from './time.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('TimeService', () => {
  let timeService: TimeService;
  let httpClientSpy: { get: jasmine.Spy };
  let http: HttpTestingController;
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ TimeService ]
    });
    timeService = TestBed.get(TimeService);
    http = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(timeService).toBeTruthy();
  });
});
