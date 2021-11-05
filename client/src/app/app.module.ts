import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { SummaryComponent } from './components/summary/summary.component';
import { InspectionsComponent } from './components/inspections/inspections.component';
import { InspectionDetailsComponent } from './components/inspection-details/inspection-details.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRippleModule } from '@angular/material/core';
import { ToolsBarComponent } from './components/tools-bar/tools-bar.component';
import { MatButtonModule } from '@angular/material/button';
import * as dayjs from 'dayjs';
import { InspectionComponent } from './components/inspection/inspection.component';
import { OrderPipe } from './pipes/order.pipe';
import { PrintOrderPipe } from './pipes/print-order.pipe';
import { Constants } from './utils/constants';
import { MatDialogModule } from '@angular/material/dialog';
import { InitComponent } from './components/init/init.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
	declarations: [
		AppComponent,
		SplashScreenComponent,
		HomeComponent,
		SummaryComponent,
		InspectionsComponent,
		InspectionDetailsComponent,
		ToolsBarComponent,
		InspectionComponent,
		OrderPipe,
		PrintOrderPipe,
		InitComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		FormsModule,
		HttpClientModule,
		MatCardModule,
		MatIconModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
		MatTableModule,
		MatButtonToggleModule,
		MatSlideToggleModule,
		MatRippleModule,
		MatButtonModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		ReactiveFormsModule,
		MatSnackBarModule
	],
	providers: [OrderPipe],
	bootstrap: [AppComponent]
})
export class AppModule {

	constructor() {
		this.overrideDateToJSON();
	}

	private overrideDateToJSON() {
		dayjs.prototype.toJSON = function() {
			return this.hour() === 0 && this.minute() === 0 && this.second() === 0
				? this.format(Constants.DATE_FORMAT.yyyy_MM_dd)
				: this.format(Constants.DATE_TIME_FORMAT.yyyy_MM_dd_HH_mm_ss);
		};
	}

}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
	return new TranslateHttpLoader(http);
}
