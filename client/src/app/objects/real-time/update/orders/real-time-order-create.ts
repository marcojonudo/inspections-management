import { Constants } from '../../../../utils/constants';
import { RealTimeOrder } from './real-time-order';
import { Order } from '../../../orders/order';
import { InspectionsColumn } from '../../../../components/inspections/inspections.component';
import { InspectionService } from '../../../../services/inspection.service';
import { InspectionDetailsColumn } from '../../../../components/inspection-details/inspection-details.component';

export class RealTimeOrderCreate extends RealTimeOrder {

	constructor(orders: Order[], syncedOrder: Order) {
		super(Constants.REAL_TIME_UPDATE_TYPE.CREATE, orders, [], undefined, syncedOrder);
	}

	check(): boolean {
		return this.findIndex(this.orders, this.syncedOrder) === -1;
	}

	update(): void {
		this.orders.push(this.syncedOrder);
	}

	updateInspectionsLayout(column: InspectionsColumn, columns: InspectionsColumn[]): InspectionsColumn[] {
		const newColumn = InspectionService.buildInspectionsRow(this.syncedOrder, Constants.INSPECTIONS_COLUMN_DATA);
		columns.push(newColumn);
		return [];
	}

	updateDetailsLayout(columns: InspectionDetailsColumn[]): InspectionDetailsColumn[] {
		return [];
	}

}
