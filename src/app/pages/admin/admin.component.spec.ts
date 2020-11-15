import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminComponent } from './admin.component';
import { MaterialModule } from '../../components/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;

  beforeEach(waitForAsync(() => {
    const adminSpy = jasmine.createSpyObj('AdminService', ['login', 'uploadQuestions', 'loggedIn']);

    TestBed.configureTestingModule({
      imports: [ MaterialModule, ReactiveFormsModule, BrowserAnimationsModule ],
      declarations: [ AdminComponent ],
      providers: [{provide: AdminService, useValue: adminSpy}]
    })
    .compileComponents();
    adminServiceSpy = TestBed.get(AdminService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
