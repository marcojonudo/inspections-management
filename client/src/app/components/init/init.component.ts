import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { InspectionService } from '../../services/inspection.service';
import { Constants } from '../../utils/constants';
import { FormControl, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-init',
	templateUrl: './init.component.html',
	styleUrls: ['./init.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InitComponent {

	employeeCode: FormControl;

	constructor(
		private router: Router,
		private snackBarService: SnackBarService,
		private translateService: TranslateService
	) {
		this.employeeCode = new FormControl(
			'',
			[Validators.required].concat(InspectionService.countryHandler.findEmployeeCodeCustomValidations())
		);
	}

	get employeeCodeMaxLength(): number {
		return Constants.EMPLOYEE_CODE_MAX_LENGTH;
	}

	findEmployeeCodeInputType(): string {
		return InspectionService.countryHandler.findEmployeeCodeInputType();
	}

	findEmployeeCodePlaceholder(): string {
		return InspectionService.countryHandler.findEmployeeCodePlaceholder();
	}

	getEmployeeCodeErrorMessage(employeeCode: FormControl = this.employeeCode): Observable<string> {
		const messageCode = employeeCode.hasError(Constants.VALIDATION_ERROR.REQUIRED) ?
			Constants.TRANSLATION_CODE.REQUIRED_EMPLOYEE_CODE : Constants.TRANSLATION_CODE.EMPLOYEE_CODE_MIN_LENGTH;
		return this.translateService.get(`init.${messageCode}`);
	}

	searchEmployee(employeeCode: FormControl = this.employeeCode): void {
		const employee = EmployeeService.setEmployee(employeeCode.value);
		if (employee) {
			this.router.navigate([Constants.PATH.INSPECTION]);
		} else if (employeeCode.value.length === Constants.EMPLOYEE_CODE_MAX_LENGTH) {
			this.snackBarService.open(
				Constants.MESSAGE_CODE.EMPLOYEE_NOT_FOUND, Constants.SNACK_BAR.TYPE.WARNING
			);
		}
	}

}
