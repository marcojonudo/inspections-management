import { InspectionsColumn } from '../../../components/inspections/inspections.component';
import { InspectionDetailsColumn } from '../../../components/inspection-details/inspection-details.component';

export abstract class RealTimeAction {

	private type: string;

	protected constructor(type: string) {
		this.type = type;
	}

	abstract findOrderNumber(): number;

	abstract check(): boolean;

	abstract update(): void;

	abstract updateInspectionsLayout(column: InspectionsColumn, columns: InspectionsColumn[]): InspectionsColumn[];

	abstract updateDetailsLayout(columns: InspectionDetailsColumn[]): InspectionDetailsColumn[];

}
