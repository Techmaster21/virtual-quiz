import { Component, OnInit } from '@angular/core';

import { Result } from '../result';
import { ResultService } from '../result.service';

@Component({
  selector: 'vq-game-over',
  templateUrl: 'game-over.component.html',
  styleUrls: ['game-over.component.css']
})
export class GameOverComponent implements OnInit {
  /**
   * The Result object which contains identifying information about the user
   */
  result: Result;
  saving: boolean;

  constructor(private resultService: ResultService) { }

  /**
   * Converts miliseconds to human readable time
   * @returns {string}
   *  human readable time string
   */
  msToTime() {
    let s = this.result.timeEnded-this.result.timeStarted;
    let ms = s % 1000;
    s = (s - ms) / 1000;
    let secs = s % 60;
    s = (s - secs) / 60;
    let mins = s % 60;
    let hrs = (s - mins) / 60;

    return hrs + ':' + mins + ':' + secs + '.' + ms;
  }
  ngOnInit() {
    this.saving = true;
    this.result = this.resultService.getResult();
    if (!this.resultService.getPractice()) {
      this.resultService.save(this.result).then(
        // Wipes out copy of result in resultService to prevent user from playing again and modifying their results
        () => {
          this.resultService.setResult(undefined);
          this.saving = false;
        }
      );
    }
    if (this.resultService.getPractice()) {
      this.saving = false;
    }
  }
}
