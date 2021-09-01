import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { leaveAnimation } from './animations';
import { InspectionService } from './services/inspection.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [leaveAnimation]
})
export class AppComponent {
	title = 'Gestión de revisiones';

	// showSplashScreen: boolean;
	loading: boolean;

	constructor(
		private inspectionService: InspectionService,
		private translate: TranslateService,
		private cdRef: ChangeDetectorRef) {
		// this.showSplashScreen = true;
		this.loading = true;

		this.inspectionService.findLanguage().subscribe((lang: string) => {
			this.translate.setDefaultLang(lang);
		});

		this.inspectionService.findOrderInspections().subscribe(() => {
			this.loading = false;
			this.cdRef.detectChanges();
		});
	}

	// checkShowSplash(): boolean {
	//     return this.loading || this.showSplashScreen;
	// }

}
