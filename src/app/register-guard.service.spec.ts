import { TestBed, inject } from '@angular/core/testing';

import { RegisterGuardService } from './register-guard.service';

describe('RegisterGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegisterGuardService]
    });
  });

  it('should be created', inject([RegisterGuardService], (service: RegisterGuardService) => {
    expect(service).toBeTruthy();
  }));
});
