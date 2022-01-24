import { Constants } from '../../../../utils/constants';
import { RealTimeOrder } from './real-time-order';
import { Order } from '../../../orders/order';
import { InspectionsColumn } from '../../../../components/inspections/inspections.component';
import { InspectionDetailsColumn } from '../../../../components/inspection-details/inspection-details.component';

export class RealTimeOrderDelete extends RealTimeOrder {

	constructor(orders: Order[], syncedOrders: Order[], order: Order) {
		super(Constants.REAL_TIME_UPDATE_TYPE.DELETE, orders, syncedOrders, order, undefined);
	}

	check(): boolean {
		return this.findIndex(this.syncedOrders, this.order) === -1;
	}

	update(): void {
		const i = this.findIndex(this.orders, this.order);
		this.orders.splice(i, 1);
	}

	updateInspectionsLayout(column: InspectionsColumn, columns: InspectionsColumn[]): InspectionsColumn[] {
		const i = columns.findIndex(c => c.orderNumber === this.order.number);
		columns.splice(i, 1);
		return [];
	}

	updateDetailsLayout(columns: InspectionDetailsColumn[]): InspectionDetailsColumn[] {
		return [];
	}

}
