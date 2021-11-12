import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MainInfoResolver } from './resolvers/main-info-resolver';
import { InspectionGuard } from './guards/inspection.guard';
import { InspectionHeaderComponent } from './components/inspection/inspection-header/inspection-header.component';
import { InspectionSheetComponent } from './components/inspection/inspection-sheet/inspection-sheet.component';
import { InspectionComponent } from './components/inspection/inspection.component';

const routes: Routes = [
	{
		path: 'home',
		component: HomeComponent,
		resolve: { mainInfo: MainInfoResolver },
		children: [
			{
				path: 'inspection',
				component: InspectionComponent,
				canActivate: [InspectionGuard],
				children: [
					{
						path: 'template',
						outlet: 'template',
						component: InspectionHeaderComponent,
						children: [
							{ path: 'sheet', component: InspectionSheetComponent }
						]
					}
				]
			}
		]
	},
	{ path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})
export class AppRoutingModule {}
