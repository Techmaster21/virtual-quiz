import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { QuestionsComponent } from './questions.component';
import { MaterialModule } from '../material/material.module';
import { QuestionService } from '../../services/question.service';
import { asyncData } from 'src/testing/async-observable-helpers';
import { SimpleChange } from '@angular/core';
import { Question } from 'src/shared/question';

describe('QuestionsComponent (class only)', () => {
  let component: QuestionsComponent;
  let questionServiceSpy: jasmine.SpyObj<QuestionService>;
  const mockQuestion = new Question('testCategory', 'testQuestion', ['testAnswer1', 'testAnswer2', 'testAnswer3']);
  const questionIndex = 3;
  beforeEach(() => {
    const spy = jasmine.createSpyObj('QuestionService', ['getQuestions', 'checkAnswer']);

    TestBed.configureTestingModule({
      imports: [ MaterialModule ],
      providers: [ QuestionsComponent, { provide: QuestionService, useValue: spy } ]
    })
    .compileComponents();

    component = TestBed.inject(QuestionsComponent);
    questionServiceSpy = TestBed.inject(QuestionService) as jasmine.SpyObj<QuestionService>;
    component.currentQuestion = mockQuestion;
    component.index = questionIndex;
    component.ngOnChanges({currentQuestion: new SimpleChange(undefined, mockQuestion, true)});
  });

  describe('Given we are not finished', () => {
    beforeEach(() => {
      component.finished = false;
    });

    it('expect to have initialized state', () => {
      expect(component.state).toEqual(new Array(mockQuestion.answers.length).fill('inactive'));
    });

    describe('and given the answer was correct', () => {
      beforeEach(() => {
        questionServiceSpy.checkAnswer.and.returnValue(asyncData(true));
      });

      it('Then should emit correct and the index of the answer', fakeAsync(() => {
        const answerIndex = mockQuestion.answers.length - 1;
        component.answerClicked.subscribe(([correctness, index]: [string, number]) => {
          expect(correctness).toBe('correct');
          expect(index).toBe(answerIndex);
        });
        component.onClick(answerIndex);
        tick(); // simulate passage of time until async activities finish
        expect(component.state[answerIndex]).toBe('correct');
      }));
    });

    describe('and given the answer was incorrect', () => {
      beforeEach(() => {
        questionServiceSpy.checkAnswer.and.returnValue(asyncData(false));
      });

      it('Then should emit incorrect and the index of the answer', fakeAsync(() => {
        const answerIndex = mockQuestion.answers.length - 1;
        component.answerClicked.subscribe(([correctness, index]: [string, number]) => {
          expect(correctness).toBe('incorrect');
          expect(index).toBe(answerIndex);
        });
        component.onClick(answerIndex);
        tick(); // simulate passage of time until async activities finish
        expect(component.state[answerIndex]).toBe('incorrect');
      }));
    });

  });

  describe('Given we are finished', () => {
    beforeEach(() => {
      component.finished = true;
    });

    it('then if we click on an answer it should not be checked', () => {
      component.onClick(0);
      expect(questionServiceSpy.checkAnswer).not.toHaveBeenCalled();
    });

    describe('and given answerIndex was the correct answer', () => {
      const answerIndex = 1;
      beforeEach(fakeAsync (() => {
        questionServiceSpy.checkAnswer.and.returnValue(asyncData(false));
        questionServiceSpy.checkAnswer.withArgs(answerIndex, questionIndex).and.returnValue(asyncData(true));
        component.ngOnChanges({finished: new SimpleChange(false, true, false)});
        tick(); // required to make sure forkJoin in finishAnimation() finishes before the tests execute
      }));

      it('then finishAnimation should correctly configure state', () => {
        component.state.forEach( (result, i) => {
          if (i === answerIndex) {
            expect(component.state[i]).toEqual('correct');
          } else {
            expect(component.state[i]).toEqual('incorrect');
          }
        });
      });

      it('then calling finishAnimation again should not change anything', fakeAsync(() => {
        // this could easily happen in the code if something else changes. May want to add a check to make sure
        // that it is only called once. Then this test would have to change.
        const oldState: string[] = component.state;
        component.ngOnChanges({finished: new SimpleChange(true, true, false)});
        tick();
        expect(component.state).toEqual(oldState);
      }));
    })
  });
});
