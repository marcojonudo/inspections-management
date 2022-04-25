import { Constants } from '../../../../utils/constants';
import { RealTimeOrder } from './real-time-order';
import { InspectionsColumn } from '../../../../components/inspections/inspections.component';
import { InspectionDetailsColumn } from '../../../../components/inspection-details/inspection-details.component';
import { OrderInspection } from '../../../order-inspection';

export class RealTimeOrderDelete extends RealTimeOrder {

	constructor(orderInspections: OrderInspection[], syncedOrderInspections: OrderInspection[], orderInspection: OrderInspection) {
		super(Constants.REAL_TIME_UPDATE_TYPE.DELETE, orderInspections, syncedOrderInspections, orderInspection, undefined);
	}

	check(): boolean {
		return this.findIndex(this.syncedOrderInspections, this.orderInspection) === -1;
	}

	update(): void {
		const i = this.findIndex(this.orderInspections, this.orderInspection);
		this.orderInspections.splice(i, 1);
	}

	updateInspectionsLayout(rows: InspectionsColumn[], row: InspectionsColumn): InspectionsColumn[] {
		const i = rows.findIndex(c => c.orderNumber === this.orderInspection.order.number);
		rows.splice(i, 1);
		return rows;
	}

	updateDetailsLayout(columns: InspectionDetailsColumn[]): InspectionDetailsColumn[] {
		return [];
	}

}
