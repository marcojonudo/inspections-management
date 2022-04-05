import { Constants } from '../../../../utils/constants';
import { RealTimeSavedInspection } from './real-time-saved-inspection';
import { SavedInspection } from '../../../inspections/saved-inspection';
import { InspectionsColumn } from '../../../../components/inspections/inspections.component';
import { InspectionDetailsColumn } from '../../../../components/inspection-details/inspection-details.component';
import { InspectionService } from '../../../../services/inspection.service';

export class RealTimeSavedInspectionCreate extends RealTimeSavedInspection {

	constructor(savedInspections: SavedInspection[], syncedSavedInspection: SavedInspection) {
		super(Constants.REAL_TIME_UPDATE_TYPE.CREATE, savedInspections, undefined, syncedSavedInspection);
	}

	check(): boolean {
		return this.findIndex(this.savedInspections, this.syncedSavedInspection) === -1;
	}

	update(): void {
		this.savedInspections.push(this.syncedSavedInspection);
	}

	updateInspectionsLayout(rows: InspectionsColumn[], row: InspectionsColumn): InspectionsColumn[] {
		row.inspectionState = this.syncedSavedInspection.state;
		const orderInspection = InspectionService.findOrderInspection(this.syncedSavedInspection.orderNumber);
		row.mechanic = InspectionService.findMechanicCode(orderInspection.order, this.syncedSavedInspection);
		row.budgets = this.syncedSavedInspection.itemBudgets;
		return rows;
	}

	updateDetailsLayout(columns: InspectionDetailsColumn[]): InspectionDetailsColumn[] {
		return [];
	}

}
