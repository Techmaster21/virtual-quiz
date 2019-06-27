import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsComponent } from './questions.component';
import { MaterialModule } from '../material/material.module';
import { QuestionService } from '../../services/question.service';

describe('QuestionsComponent', () => {
  let component: QuestionsComponent;
  let fixture: ComponentFixture<QuestionsComponent>;
  let questionServiceSpy: jasmine.SpyObj<QuestionService>;

  beforeEach(async(() => {
    const spy = jasmine.createSpyObj('QuestionService', ['getQuestions, CheckAnswer']);

    TestBed.configureTestingModule({
      imports: [ MaterialModule ],
      declarations: [ QuestionsComponent ],
      providers: [ {provide: QuestionService, useValue: spy} ]
    })
    .compileComponents();

    questionServiceSpy = TestBed.get(QuestionService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
