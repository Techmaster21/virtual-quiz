import { ApplicationRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { appRoutingProviders, routing  } from './app.routing';
import { GameComponent } from './game/game.component';
import { GameOverComponent } from './game-over/game-over.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { QuestionsComponent } from './questions/questions.component';
import { QuestionService } from './question.service';
import { ResultService } from './result.service';
import { SignupComponent } from './signup/signup.component';
import { TimerComponent } from './timer/timer.component';
import { TimeService } from './time.service';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    GameOverComponent,
    ProgressBarComponent,
    QuestionsComponent,
    SignupComponent,
    TimerComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [
    appRoutingProviders,
    QuestionService,
    ResultService,
    TimeService
  ],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
