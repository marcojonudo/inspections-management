import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MainInfoResolver } from './resolvers/main-info-resolver';

const routes: Routes = [
	{
		path: 'home',
		component: HomeComponent,
		resolve: { mainInfo: MainInfoResolver }
	},
	{ path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})
export class AppRoutingModule {}
