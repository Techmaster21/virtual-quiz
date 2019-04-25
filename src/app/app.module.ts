import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AppRoutingModule } from './app-routing.module';
import { GameComponent } from './pages/game/game.component';
import { GameOverComponent } from './pages/game-over/game-over.component';
import { FormsModule } from '@angular/forms';
import { QuestionsComponent } from './components/questions/questions.component';
import { TimerComponent } from './components/timer/timer.component';
import { MaterialModule } from './components/material/material.module';
import { AdminComponent } from './pages/admin/admin.component';
import { AuthInterceptor } from './interceptors/auth-interceptor.service';


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    GameComponent,
    GameOverComponent,
    QuestionsComponent,
    TimerComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
