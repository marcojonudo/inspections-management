import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order } from '../../objects/orders/order';

export interface OrdersData {
	orders: Order[];
}

@Component({
	selector: 'app-pending-contacts-dialog',
	templateUrl: './pending-contacts-dialog.component.html',
	styleUrls: ['./pending-contacts-dialog.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PendingContactsDialogComponent {

	private COLUMNS: string[] = ['number', 'code'];

	columnsToDisplay: string[];
	rows: Order[];

	constructor(@Inject(MAT_DIALOG_DATA) private data: OrdersData) {
		this.columnsToDisplay = this.COLUMNS;
		this.rows = data.orders;
	}

}
