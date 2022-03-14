import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface EmailData {
	email: string;
}

@Component({
	selector: 'app-email-dialog',
	templateUrl: './email-dialog.component.html',
	styleUrls: ['./email-dialog.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailDialogComponent {

	emailControl: FormControl;

	constructor(@Inject(MAT_DIALOG_DATA) public data: EmailData, private dialogRef: MatDialogRef<EmailDialogComponent>) {
		this.emailControl = new FormControl(data.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'));
	}

	accept(emailControl: FormControl = this.emailControl): void {
		if (emailControl.valid) {
			this.dialogRef.close(emailControl.value);
		}
	}

}
