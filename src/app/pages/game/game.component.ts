import { AfterViewInit, Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';

import { questionLoadDelay, autoWrongGuess, breakTime } from '../../constants';
import { Question } from '../../models/question';
import { QuestionService } from '../../services/question.service';
import { Team } from '../../models/team';
import { TeamService } from '../../services/team.service';
import { TimerComponent } from '../../components/timer/timer.component';

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

  /** @ignore */
  constructor(private router: Router,
              private questionService: QuestionService,
              private teamService: TeamService) { }

  /** Called when there are no more questions to serve, i.e. when the game is over */
  gameOver() {
    this.team.points = this.points;
    this.team.timeEnded = Date.now();
    this.teamService.setTeam(this.team);
    this.router.navigate(['/gameover']);
  }
  /** Retrieves the questions */
  getQuestions() {
    this.questionService.getQuestions().subscribe(questions => {
        this.questions = questions;
        this.currentQuestion = this.questions[this.index];
      });
  }
  /**
   * Loads the next question if it exists, and if not, calls gameOver(). Also in charge of initiating breaks, which
   * occur after roughly 1/3 of the total questions are completed (but only twice)
   */
  loadQuestion() {
    // save result
    this.pointsGained = 0;
    this.team.currentQuestion = this.index + 1;
    this.team.points = this.points;
    this.teamService.save(this.team).subscribe();
    ++this.index;
    if (this.questions[this.index]) {
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
    // sets up the seconds() method to actually get the time from the TimerComponent
    // Dubious if this should actually be in AfterViewInit()
    setTimeout(() => this.seconds = () => this.timer.milliseconds / 1000, 0);
    this.timer.start();
  }
  /** Perform various actions necessary to start up the game */
  ngOnInit() {
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
    this.getQuestions();
  }
  /**
   * Called when an answer is clicked
   * @param result
   *  Whether or not the clicked answer was 'correct' or 'incorrect'
   */
  onAnswerClicked(result: string) {
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
  /** Called when the current breakStarted ends by the user pressing the End Break button */
  onBreakEnd() {
    clearTimeout(this.breakEnd);
    this.breakEnd = undefined;
    this.breakStarted = false;
    this.questionHelper();
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
  seconds() { return 0; }

  /** A little helper that loads the next question */
  private questionHelper() {
    this.currentQuestion = this.questions[this.index];
    this.timer.restart();
    this.secondTryAllowed = true;
    this.finished = false;
  }
}
