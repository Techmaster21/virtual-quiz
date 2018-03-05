import { AfterViewInit, Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';

import { questionLoadDelay, autoWrongGuess, breakTime } from '../constants';
import { Question } from '../question';
import { QuestionService } from '../question.service';
import { Team } from '../team';
import { TeamService } from '../team.service';
import { TimerComponent } from '../timer/timer.component';

@Component({
  selector: 'app-game',
  templateUrl: 'game.component.html',
  styleUrls: ['game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit {

  @ViewChild(TimerComponent)
  private timerComponent: TimerComponent;

  /**
   * Whether or not a breakStarted is currently in progress. True if in progress; false otherwise
   * @type {boolean}
   */
  breakStarted = false;
  /**
   * Used to store the setTimeout() variable so that we can later call clearTimeout()
   */
  breakEnd;
  /**
   * The current Question
   */
  currentQuestion: Question;
  /**
   * Whether or not this question has been completed. True when user has either exhauseted both tries,
   * or chose the correct answer; false otherwise
   * @type {boolean}
   */
  finished = false;
  /**
   * Index of the current Question
   * @type {number}
   */
  index = 0;
  /**
   * The user's current point score
   * @type {number}
   */
  points = 0;
  /**
   * Whether or not this is a practice round; True if a practice round; false otherwise
   */
  practice = false;
  /**
   * The Questions to display
   */
  questions: Question[];
  /**
   * The Result object which contains identifying information about the user
   */
  team: Team;
  /**
   * Whether or not the user is allowed a second guess on the current question. True when allowed; false otherwise
   * @type {boolean}
   */
  secondTryAllowed = true;
  pointsGained = 0;

  constructor(private router: Router,
              private questionService: QuestionService,
              private teamService: TeamService) { }

  /**
   * Called when there are no more questions to serve, i.e. when the game is over.
   */
  gameOver() {
    this.team.points = this.points;
    this.team.timeEnded = Date.now();
    this.teamService.setPractice(this.practice);
    this.teamService.setTeam(this.team);
    this.router.navigate(['/gameover']);
  }
  /**
   * Retrieves the practice questions through QuestionService
   */
  getPracticeQuestions() {
    this.questionService.getPracticeQuestions().subscribe(questions => {
      this.questions = questions;
      this.currentQuestion = this.questions[this.index];
    });
  }
  /**
   * Retrieves the questions through QuestionService
   */
  getQuestions() {
    this.questionService.getQuestions().subscribe(questions => {
        this.questions = questions;
        this.currentQuestion = this.questions[this.index];
      });
  }
  /**
   * Loads the next question if it exists, and if not, calls gameOver(). Also in charge of initiating breaks, which
   * occur roughly after 1/3 of the total questions are completed (but only twice).
   */
  loadQuestion() {
    // save result
    this.pointsGained = 0;
    this.team.currentQuestion = this.index + 1;
    this.team.points = this.points;
    if (!this.practice) {
      this.teamService.save(this.team).subscribe(() => console.log('team data saved'));
    }
    ++this.index;
    if (this.questions[this.index]) {
      if (this.index % Math.floor(this.questions.length / 3) === 0 && this.index != Math.floor(this.questions.length / 3) * 3 ) {
        this.breakStarted = true;
        this.restartTimer();
        // Prevents on breakStarted menu from continuing to reset after 60 seconds. Essentially undoes onStarted()
        this.timerComponent.clearInterval();
        this.breakEnd = setTimeout(() => {
          this.breakStarted = false;
          this.questionHelper();
        }, breakTime);
      } else {
        this.questionHelper();
      }
    } else {
      this.gameOver();
    }
  }
  ngAfterViewInit() {
    // sets up the seconds() method to actually get the time from the TimerComponent
    // Dubious if this should actually be in AfterViewInit()
    setTimeout(() => this.seconds = () => this.timerComponent.mseconds / 1000, 0);
    this.startTimer();
  }
  ngOnInit() {
    // Necessarily executed in order?
    this.team = this.teamService.getTeam();
    if (!this.team.timeStarted) {
      this.team.timeStarted = Date.now();
    }
    if (this.team.currentQuestion) {
      this.index = this.team.currentQuestion;
    }
    if (this.team.points) {
      this.points = this.team.points;
    }
    this.practice = this.team._id === 'practice';
    if (!this.practice) {
      this.getQuestions();
    } else {
      this.getPracticeQuestions();
    }
  }
  /**
   * Called when an answer is clicked
   * @param result
   *  Whether or not the clicked answer was 'correct' or 'incorrect'
   */
  onAnswerClicked(result: string) {
    if (result === 'correct') {
      this.finished = true;
      this.stopTimer();
      if (!this.secondTryAllowed) {
        this.pointsGained = 1;
      } else if (this.seconds() < 8) {
        this.pointsGained = 4;
      } else if (this.seconds() < 15) {
        this.pointsGained = 3;
      } else {
        this.pointsGained = 2;
      }
      this.points += this.pointsGained;
      setTimeout(() => this.loadQuestion(), questionLoadDelay);
    } else {
      if (this.secondTryAllowed) {
        this.secondTryAllowed = false;
        this.restartTimer();
      } else {
        this.finished = true;
        this.stopTimer();
        setTimeout(() => this.loadQuestion(), questionLoadDelay);
      }
    }
  }
  /**
   * Called when the current breakStarted ends by the user pressing the End Break button
   */
  onBreakEnd() {
    clearTimeout(this.breakEnd);
    this.breakEnd = undefined;
    this.breakStarted = false;
    this.questionHelper();
  }
  /**
   * Method that runs when the Timer is started. Sets a limit as defined in constants as the maximum time one can take before it's
   * counted as an automatic wrong guess.
   */
  onStarted() {
    this.timerComponent.setInterval(() => {
      if (this.secondTryAllowed) {
        this.secondTryAllowed = false;
        this.restartTimer();
      } else {
        this.finished = true;
        this.stopTimer();
        setTimeout(() => this.loadQuestion(), questionLoadDelay);
      }
    }, autoWrongGuess);
  }
  /**
   * Stops, resets, and then starts the timer
   */
  restartTimer() { this.timerComponent.restartTimer(); }
  /**
   * Resets the timer
   */
  resetTimer() { this.timerComponent.resetTimer(); }
  /**
   * The current number of seconds on the timer
   * @returns {number}
   *  Current number of seconds on timer
   */
  seconds() { return 0; }
  /**
   * Starts the timer
   */
  startTimer() { this.timerComponent.startTimer(); }
  /**
   * Stops the timer but does not reset it
   */
  stopTimer() { this.timerComponent.stopTimer(); }

  /**
   * A little helper that loads the next question.
   */
  private questionHelper() {
    this.currentQuestion = this.questions[this.index];
    this.restartTimer();
    this.secondTryAllowed = true;
    this.finished = false;
  }
}
