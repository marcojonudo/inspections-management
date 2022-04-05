import { Constants } from '../../../../utils/constants';
import { RealTimeOrder } from './real-time-order';
import { InspectionsColumn } from '../../../../components/inspections/inspections.component';
import { InspectionService } from '../../../../services/inspection.service';
import { InspectionDetailsColumn } from '../../../../components/inspection-details/inspection-details.component';
import { OrderInspection } from '../../../order-inspection';

export class RealTimeOrderCreate extends RealTimeOrder {

	constructor(orderInspections: OrderInspection[], syncedOrderInspections: OrderInspection) {
		super(Constants.REAL_TIME_UPDATE_TYPE.CREATE, orderInspections, [], undefined, syncedOrderInspections);
	}

	check(): boolean {
		return this.findIndex(this.orderInspections, this.syncedOrderInspection) === -1;
	}

	update(): void {
		this.orderInspections.push(this.syncedOrderInspection);
	}

	updateInspectionsLayout(rows: InspectionsColumn[]): InspectionsColumn[] {
		const newRow = InspectionService.buildInspectionsRow(this.syncedOrderInspection.order, Constants.INSPECTIONS_COLUMN_DATA);
		rows.push(newRow);
		return rows;
	}

	updateDetailsLayout(columns: InspectionDetailsColumn[]): InspectionDetailsColumn[] {
		return [];
	}

}
