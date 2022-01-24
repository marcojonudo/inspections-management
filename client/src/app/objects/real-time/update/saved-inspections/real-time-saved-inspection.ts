import { SavedInspection } from '../../../inspections/saved-inspection';
import { RealTimeAction } from '../real-time-action';

export abstract class RealTimeSavedInspection extends RealTimeAction {

	protected savedInspections: SavedInspection[];
	savedInspection: SavedInspection;
	syncedSavedInspection: SavedInspection;

	protected constructor(
		type: string,
		savedInspections: SavedInspection[],
		savedInspection: SavedInspection,
		syncedSavedInspection: SavedInspection
	) {
		super(type);
		this.savedInspections = savedInspections;
		this.savedInspection = savedInspection;
		this.syncedSavedInspection = syncedSavedInspection;
	}

	findOrderNumber(): number {
		return (this.savedInspection || this.syncedSavedInspection).orderNumber;
	}

	findIndex(savedInspections: SavedInspection[], savedInspection: SavedInspection): number {
		return savedInspections.findIndex(i => i.orderNumber === savedInspection.orderNumber);
	}

	find(savedInspection: SavedInspection): SavedInspection {
		return this.savedInspections.find(i => i.orderNumber === savedInspection.orderNumber);
	}

}
