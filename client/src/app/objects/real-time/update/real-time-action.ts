import { InspectionsColumn } from '../../../components/inspections/inspections.component';
import { InspectionDetailsColumn } from '../../../components/inspection-details/inspection-details.component';

export abstract class RealTimeAction {

	type: string;

	protected constructor(type: string) {
		this.type = type;
	}

	abstract findOrderNumber(): number;

	abstract check(): boolean;

	abstract update(): void;

	abstract updateInspectionsLayout(rows: InspectionsColumn[], row: InspectionsColumn): InspectionsColumn[];

	abstract updateDetailsLayout(columns: InspectionDetailsColumn[]): InspectionDetailsColumn[];

}
