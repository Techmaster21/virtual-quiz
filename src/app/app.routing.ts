import { Routes, RouterModule } from '@angular/router';

import { GameComponent } from './game/game.component';
import { SignupComponent } from './signup/signup.component';
import { GameOverComponent } from './game-over/game-over.component';

import { RegisterGuard } from './register-guard.service';

const appRoutes: Routes = [
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
export const appRoutingProviders: any[] = [
  RegisterGuard
];
export const routing = RouterModule.forRoot(appRoutes);
