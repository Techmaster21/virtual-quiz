import { Routes, RouterModule } from '@angular/router';

import { GameComponent } from './game.component';
import { SignupComponent } from './signup.component';
import { GameOverComponent } from './game-over.component';

const appRoutes: Routes = [
	{
		path: 'game',
		component: GameComponent
	}, 
	{
		path: 'signup',
		component: SignupComponent
	},  
	{
		path: 'gameover',
		component: GameOverComponent
	},
	{
		path: '',
		redirectTo: '/signup',
		pathMatch: 'full'
	}
];
export const routing = RouterModule.forRoot(appRoutes);