import { TestBed } from '@angular/core/testing';

import { StatsService } from './stats.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('StatsService', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let http: HttpTestingController;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['put']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StatsService]
    });

    http = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: StatsService = TestBed.get(StatsService);
    expect(service).toBeTruthy();
  });
});
