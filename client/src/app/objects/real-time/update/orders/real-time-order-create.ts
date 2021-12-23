import { Constants } from '../../../../utils/constants';
import { RealTimeOrder } from './real-time-order';
import { Order } from '../../../orders/order';
import { InspectionsColumn } from '../../../../components/inspections/inspections.component';
import { InspectionService } from '../../../../services/inspection.service';

export class RealTimeOrderCreate extends RealTimeOrder {

	constructor(orders: Order[], syncedOrders: Order[], order: Order, syncedOrder: Order) {
		super(Constants.REAL_TIME_ORDER_TYPE.CREATE, orders, syncedOrders, order, syncedOrder);
	}

	check(): boolean {
		return this.findIndex(this.orders, this.syncedOrder) === -1;
	}

	update(): void {
		this.orders.push(this.syncedOrder);
	}

	updateInspectionsLayout(column: InspectionsColumn, columns: InspectionsColumn[]): void {
		const newColumn = InspectionService.buildInspectionsRow(this.order, Constants.INSPECTIONS_COLUMN_DATA);
		columns.push(newColumn);
	}

}
