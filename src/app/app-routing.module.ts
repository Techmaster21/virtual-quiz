import { NgModule } from '@angular/core';
import { SignupComponent } from './signup/signup.component';
import {RouterModule, Routes} from '@angular/router';
import {RegisterGuard} from './register-guard.service';
import {GameOverComponent} from './game-over/game-over.component';
import {GameComponent} from './game/game.component';

const routes: Routes = [
  {
    path: 'game',
    component: GameComponent,
    canActivate: [RegisterGuard]
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'gameover',
    component: GameOverComponent,
    canActivate: [RegisterGuard]
  },
  {
    path: '',
    redirectTo: '/signup',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
