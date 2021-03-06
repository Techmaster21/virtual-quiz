import { AfterViewInit, Component, HostListener, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';

import { questionLoadDelay, autoWrongGuess, breakTime } from '../../constants';
import { Question } from '../../../shared/question';
import { QuestionService } from '../../services/question.service';
import { Team } from '../../models/team';
import { TeamService } from '../../services/team.service';
import { TimerComponent } from '../../components/timer/timer.component';
import { StatsService } from '../../services/stats.service';

/** The main page of the game. Contains the game logic */
@Component({
  selector: 'app-game',
  templateUrl: 'game.component.html',
  styleUrls: ['game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit {

  /** A reference to the timer portion of the game page */
  @ViewChild(TimerComponent, { static: true })
  private timer: TimerComponent;

  /** Whether or not a breakStarted is currently in progress */
  breakStarted = false;
  /** Used to store the setTimeout() variable so that we can later call clearTimeout() */
  breakEnd;
  /** The current question */
  currentQuestion: Question;
  /** Whether or not this question has been completed */
  finished = false;
  /** Index of the current question */
  index = 0;
  /** The user's current point score */
  points = 0;
  /** The questions to display */
  questions: Question[];
  /** The Team object which contains identifying information about the user */
  team: Team;
  /** Whether or not the user is allowed a second guess on the current question */
  secondTryAllowed = true;
  /** How many points the user gained from this question */
  pointsGained = 0;
  /** How long it took to answer for the first try */
  firstTryIndex = null;
  /** How long it took to answer for the second try */
  secondTryIndex = null;
  /** How long it took to answer for the first try */
  firstTryTime = null;
  /** How long it took to answer for the second try */
  secondTryTime = null;

  /** Game component constructor */
  constructor(private router: Router,
              private questionService: QuestionService,
              private teamService: TeamService,
              private statsService: StatsService) { }

  /** Called when there are no more questions to serve, i.e. when the game is over */
  gameOver() {
    this.timer.clearInterval();
    this.team.points = this.points;
    this.team.timeEnded = Date.now();
    this.teamService.team = this.team;
    this.router.navigate(['/gameover']);
  }
  /** Retrieves the questions */
  getQuestions() {
    this.questionService.getQuestions().subscribe(questions => {
        this.questions = questions;
        if (this.index < this.questions.length) {
          this.currentQuestion = this.questions[this.index];
        } else {
          this.gameOver();
        }
      });
  }
  /**
   * Loads the next question if it exists, and if not, calls gameOver(). Also in charge of initiating breaks, which
   * occur after roughly 1/3 of the total questions are completed (but only twice)
   */
  loadQuestion() {
    // save stats and reset values
    this.statsService.saveStats(this.index, this.firstTryIndex, this.firstTryTime, this.secondTryIndex,
      this.secondTryTime, this.pointsGained).subscribe();
    // todo i'd like a nicer looking way to do this
    [this.firstTryIndex, this.secondTryIndex, this.firstTryTime, this.secondTryTime] = [null, null, null, null];
    // save team
    this.pointsGained = 0;
    this.team.currentQuestion = this.index + 1;
    this.team.points = this.points;
    this.teamService.save(this.team).subscribe();
    ++this.index;
    if (this.index < this.questions.length && this.questions[this.index]) {
      if (this.index % Math.floor(this.questions.length / 3) === 0 && this.index !== Math.floor(this.questions.length / 3) * 3 ) {
        this.breakStarted = true;
        this.timer.restart();
        // Prevents on breakStarted menu from continuing to reset after 60 seconds. Essentially undoes onStarted()
        this.timer.clearInterval();
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
  /** Starts the timer */
  ngAfterViewInit() {
    this.timer.start();
  }
  /** Perform various actions necessary to start up the game */
  ngOnInit() {
    this.team = this.teamService.team;
    if (!this.team.timeStarted) {
      this.team.timeStarted = Date.now();
    }
    if (this.team.currentQuestion) {
      this.index = this.team.currentQuestion;
    }
    if (this.team.points) {
      this.points = this.team.points;
    }
    this.getQuestions();
  }
  /**
   * Called when an answer is clicked
   * @param result
   *  Whether or not the clicked answer was 'correct' or 'incorrect'
   */
  onAnswerClicked([result, answerIndex]: [string, number]) {
    // if we have already finished, ignore new clicks
    if (this.finished) {
      return;
    }
    // if this is first try
    if (this.secondTryAllowed) {
      this.firstTryIndex = answerIndex;
      this.firstTryTime = this.seconds();
    } else {
      this.secondTryIndex = answerIndex;
      this.secondTryTime = this.seconds();
    }
    if (result === 'correct') {
      this.finished = true;
      this.timer.stop();
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
        this.timer.restart();
      } else {
        this.finished = true;
        this.timer.stop();
        setTimeout(() => this.loadQuestion(), questionLoadDelay);
      }
    }
  }

  /** Called when the current break ends by the user pressing the End Break button */
  onBreakEnd() {
    clearTimeout(this.breakEnd);
    this.breakEnd = undefined;
    this.breakStarted = false;
    this.questionHelper();
  }

  /** Called when the back button or forward button is pressed */
  // TODO should be same behavior on refresh. Adding @HostListener('window:beforeunload', ['$event'])\
  //  almost works, but also registers when router is redirecting to new page.
  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent) {
    // back button will force an advance to the next question and will not save stats to avoid cheating and spoiled stats
    this.team.currentQuestion = this.index + 1;
    this.teamService.save(this.team).subscribe();
    this.timer.clearInterval();
  }

  /**
   * Method that runs when the Timer is started. Sets a limit as defined in constants as the maximum time one can take
   * before it's counted as an automatic wrong guess
   */
  onStarted() {
    this.timer.setInterval(() => {
      if (this.secondTryAllowed) {
        this.secondTryAllowed = false;
        this.timer.restart();
      } else {
        this.finished = true;
        this.timer.stop();
        setTimeout(() => this.loadQuestion(), questionLoadDelay);
      }
    }, autoWrongGuess);
  }

  /** The current number of seconds on the timer */
  seconds() {
    if (this.timer) {
      return this.timer.milliseconds / 1000;
    } else {
      return 0;
    }
  }

  /** A little helper that loads the next question */
  private questionHelper() {
    this.currentQuestion = this.questions[this.index];
    this.timer.restart();
    this.secondTryAllowed = true;
    this.finished = false;
  }
}
