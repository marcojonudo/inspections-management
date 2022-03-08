import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
	selector: 'app-email-dialog',
	templateUrl: './email-dialog.component.html',
	styleUrls: ['./email-dialog.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailDialogComponent {

	emailControl: FormControl;

	constructor(
		private dialogRef: MatDialogRef<EmailDialogComponent>,
		private translateService: TranslateService,
		private snackBarService: SnackBarService
	) {
		this.emailControl = new FormControl('', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'));
	}

	accept(emailControl: FormControl = this.emailControl): void {
		if (emailControl.valid) {
			this.dialogRef.close(emailControl.value);
		}
	}

}
