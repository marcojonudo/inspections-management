import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EmployeesResolver } from './resolvers/employees-resolver';


const routes: Routes = [
	{
		path: 'home',
		component: HomeComponent,
		resolve: { employees: EmployeesResolver }
	},
	{ path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
