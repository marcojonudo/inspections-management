import { SavedInspection } from '../../../inspections/saved-inspection';
import { RealTimeSavedInspection } from './real-time-saved-inspection';
import { SavedItem } from '../../../inspections/saved-items/saved-item';
import { RealTimeSavedItemCreate } from '../saved-items/real-time-saved-item-create';
import { RealTimeSavedItemUpdate } from '../saved-items/real-time-saved-item-update';
import { RealTimeSavedItem } from '../saved-items/real-time-saved-item';
import { Constants } from '../../../../utils/constants';
import { InspectionService } from '../../../../services/inspection.service';
import { InspectionsColumn } from '../../../../components/inspections/inspections.component';
import { InspectionDetailsColumn } from '../../../../components/inspection-details/inspection-details.component';

export class RealTimeSavedInspectionUpdate extends RealTimeSavedInspection {

	realTimeSavedItems: RealTimeSavedItem[];

	readonly UPDATE_PROPERTIES: ((savedInspection: SavedInspection) => void)[] = [
		(savedInspection: SavedInspection) => savedInspection.sellerCode,
		(savedInspection: SavedInspection) => savedInspection.state,
		(savedInspection: SavedInspection) => savedInspection.saved
	];

	constructor(savedInspections: SavedInspection[], savedInspection: SavedInspection, syncedSavedInspection: SavedInspection) {
		super(Constants.REAL_TIME_UPDATE_TYPE.UPDATE, savedInspections, savedInspection, syncedSavedInspection);
	}

	check(): boolean {
		const updated = this.UPDATE_PROPERTIES.find(updateProperty =>
			updateProperty(this.savedInspection) !== updateProperty(this.syncedSavedInspection)
		) !== undefined;

		this.realTimeSavedItems = this.handleSyncedSavedItems(this.syncedSavedInspection.items, this.savedInspection.items);
		return updated || this.realTimeSavedItems.length !== 0;
	}

	handleSyncedSavedItems(syncedSavedItems: SavedItem[], savedItems: SavedItem[]): RealTimeSavedItem[] {
		const updates = [];
		syncedSavedItems.forEach(syncedSavedItem => {
			const realTimeCreate = new RealTimeSavedItemCreate(savedItems, syncedSavedItems, undefined, syncedSavedItem);
			if (realTimeCreate.check()) {
				updates.push(realTimeCreate);
			} else {
				const savedItem = realTimeCreate.find(syncedSavedItem);
				const realTimeUpdate = new RealTimeSavedItemUpdate(savedItems, syncedSavedItems, savedItem, syncedSavedItem);
				if (realTimeUpdate.check()) {
					updates.push(realTimeUpdate);
				}
			}
		});
		return updates;
	}

	update(): void {
		this.savedInspection.sellerCode = this.syncedSavedInspection.sellerCode;
		this.savedInspection.state = this.syncedSavedInspection.state;
		this.savedInspection.saved = this.syncedSavedInspection.saved;

		if (this.realTimeSavedItems.length) {
			this.realTimeSavedItems.forEach(realTimeSavedItem => realTimeSavedItem.update());
			this.savedInspection.itemBudgets = InspectionService.filterItemBudgets(this.savedInspection.items);
		}
	}

	updateInspectionsLayout(column: InspectionsColumn, columns: InspectionsColumn[]): InspectionsColumn[] {
		return [];
	}

	updateDetailsLayout(columns: InspectionDetailsColumn[]): InspectionDetailsColumn[] {
		if (columns.length > this.savedInspection.itemBudgets.length) {
			const i = columns.findIndex(c => !this.savedInspection.itemBudgets.find(b => b.itemCode === c.item.itemCode));
			columns.splice(i, 1);
		} else if (columns.length < this.savedInspection.itemBudgets.length) {
			const newItemBudget = this.savedInspection.itemBudgets.find(b => !columns.find(c => c.item.itemCode === b.itemCode));
			const newColumn = InspectionService.buildInspectionDetailsRow(newItemBudget);
			columns.push(newColumn);
		}
		return columns.slice();
	}

}
