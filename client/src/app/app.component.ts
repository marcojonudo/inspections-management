import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { leaveAnimation } from './animations';
import { InspectionService } from './services/inspection.service';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from './services/loading.service';
import { forkJoin } from 'rxjs';
import { EmployeeService } from './services/employee.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [leaveAnimation]
})
export class AppComponent {
	title = 'Gestión de revisiones';

	loading: boolean;

	constructor(
		private inspectionService: InspectionService,
		private employeeService: EmployeeService,
		private loadingService: LoadingService,
		private translate: TranslateService,
		private cdRef: ChangeDetectorRef
	) {
		this.loading = true;

		forkJoin([
			this.inspectionService.findLanguage(),
			this.employeeService.findEmployees()
		]).subscribe(data => {
			this.translate.setDefaultLang(data[0]);
			EmployeeService.setEmployees(data[1]);
		});

		this.loadingService.subscribe(loading => {
			this.loading = loading;
			this.cdRef.detectChanges();
		});
	}

}
