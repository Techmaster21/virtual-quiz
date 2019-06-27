import { TestBed } from '@angular/core/testing';

import { AdminService } from './admin.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AdminService', () => {
  let adminService: AdminService;
  let httpClientSpy: { get: jasmine.Spy };
  let http: HttpTestingController;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ AdminService ]
    });

    adminService = TestBed.get(AdminService);
    http = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(adminService).toBeTruthy();
  });
});
