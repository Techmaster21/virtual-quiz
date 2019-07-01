import { TestBed, inject } from '@angular/core/testing';

import { QuestionService } from './question.service';
import { TeamService } from './team.service';
import { URI } from '../constants';
import { asyncData } from '../../testing/async-observable-helpers';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Question } from '../models/question';

describe('QuestionService', () => {
  let questionService: QuestionService;
  let teamServiceSpy: jasmine.SpyObj<TeamService>;
  let httpClientSpy: { get: jasmine.Spy };
  let http: HttpTestingController;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TeamService', ['getPractice', 'getToken']);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [QuestionService, {provide: TeamService, useValue: spy}]
    });

    questionService = TestBed.get(QuestionService);
    teamServiceSpy = TestBed.get(TeamService);
    http = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(questionService).toBeTruthy();
  });

  it('#getQuestions should return practice questions when getPractice returns true', () => {
    const expectedQuestions: Question[] = [{question: 'Why?', category: 'Questions', answers: ['because', 'because']}];
    teamServiceSpy.getPractice.and.returnValue(true);
    teamServiceSpy.getToken.and.returnValue('');
    httpClientSpy.get.and.returnValue(asyncData(expectedQuestions));

    questionService.getQuestions().subscribe(
      questions => expect(questions).toEqual(expectedQuestions, 'expected questions'),
      fail
    );

    http.expectOne(URI.PRACTICE_QUESTIONS.GET);
  });

  it('#getQuestions should return questions when getPractice returns false', () => {
    const expectedQuestions: Question[] = [{question: 'Why?', category: 'Questions', answers: ['because', 'because']}];
    teamServiceSpy.getPractice.and.returnValue(false);
    teamServiceSpy.getToken.and.returnValue('');
    httpClientSpy.get.and.returnValue(asyncData(expectedQuestions));

    questionService.getQuestions().subscribe(
      questions => expect(questions).toEqual(expectedQuestions, 'expected questions'),
      fail
    );

    http.expectOne(URI.QUESTIONS.GET);
  });
});
