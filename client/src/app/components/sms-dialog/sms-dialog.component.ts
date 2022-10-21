import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface SmsData {
	phoneNumber: string;
}

@Component({
	selector: 'app-sms-dialog',
	templateUrl: './sms-dialog.component.html',
	styleUrls: ['./sms-dialog.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmsDialogComponent {

	smsControl: FormControl;

	constructor(@Inject(MAT_DIALOG_DATA) public data: SmsData, private dialogRef: MatDialogRef<SmsDialogComponent>) {
		this.smsControl = new FormControl(data.phoneNumber, Validators.required);
	}

	accept(smsControl: FormControl = this.smsControl): void {
		if (smsControl.valid) {
			this.dialogRef.close(smsControl.value);
		}
	}

}
