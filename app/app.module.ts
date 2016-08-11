import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { routing } from './app.routing';
import { AppComponent }  from './app.component';
import { QuestionsComponent } from './questions.component';
import { SignupComponent } from './signup.component';
import { GameOverComponent } from './game-over.component';
import { TimerComponent } from './timer.component';

@NgModule({
  imports: [ BrowserModule, routing ],
  declarations: [ 
  AppComponent,
  QuestionsComponent,
  SignupComponent,
  GameOverComponent,
  TimerComponent
   ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
