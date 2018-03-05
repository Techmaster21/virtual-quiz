import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { TimeService } from './time.service';
import { AppRoutingModule } from './app-routing.module';
import { GameComponent } from './game/game.component';
import { GameOverComponent } from './game-over/game-over.component';
import { FormsModule } from '@angular/forms';
import { QuestionsComponent } from './questions/questions.component';
import { TimerComponent } from './timer/timer.component';
import {QuestionService} from './question.service';
import {TeamService} from './team.service';
import {RegisterGuard} from './register-guard.service';
import {MaterialModule} from './material/material.module';


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    GameComponent,
    GameOverComponent,
    QuestionsComponent,
    TimerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [TimeService, QuestionService, TeamService, RegisterGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
