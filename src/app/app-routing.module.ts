import { NgModule } from '@angular/core';
import { SignupComponent } from './pages/signup/signup.component';
import { RouterModule, Routes} from '@angular/router';
import { RegisterGuard } from './register-guard.service';
import { GameOverComponent } from './pages/game-over/game-over.component';
import { GameComponent } from './pages/game/game.component';
import { AdminComponent } from './pages/admin/admin.component';

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
    path: 'admin',
    component: AdminComponent
  },
  {
    path: '',
    redirectTo: '/signup',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/signup',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
