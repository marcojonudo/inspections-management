import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from '../../services/employee.service';
import { InspectionService } from '../../services/inspection.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Constants } from '../../utils/constants';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
	selector: 'app-employee-dialog',
	templateUrl: './employee-dialog.component.html',
	styleUrls: ['./employee-dialog.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeDialogComponent {

	employeeCode: FormControl;

	constructor(
		private dialogRef: MatDialogRef<EmployeeDialogComponent>,
		private translateService: TranslateService,
		private snackBarService: SnackBarService
	) {
		this.employeeCode = new FormControl('');
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
			this.dialogRef.close(employee.code);
		} else if (employeeCode.value.length === Constants.EMPLOYEE_CODE_MAX_LENGTH) {
			this.snackBarService.open(
				Constants.MESSAGE_CODE.EMPLOYEE_NOT_FOUND, Constants.SNACK_BAR.TYPE.WARNING
			);
		}
	}

}
