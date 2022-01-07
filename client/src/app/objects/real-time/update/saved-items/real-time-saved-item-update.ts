import { RealTimeSavedItem } from './real-time-saved-item';
import { SavedItem } from '../../../inspections/saved-items/saved-item';
import { Constants } from '../../../../utils/constants';

export class RealTimeSavedItemUpdate extends RealTimeSavedItem {

	constructor(savedItems: SavedItem[], syncedSavedItems: SavedItem[], savedItem: SavedItem, syncedSavedItem: SavedItem) {
		super(Constants.REAL_TIME_UPDATE_TYPE.UPDATE, savedItems, syncedSavedItems, savedItem, syncedSavedItem);
	}

	check(): boolean {
		const updated = !this.savedItem.filled.isSame(this.syncedSavedItem.filled);
		return updated || this.savedItem.isUpdated(this.syncedSavedItem);
	}

	update(): void {
		this.savedItem.update(this.syncedSavedItem.findValue(), this.syncedSavedItem.employeeCode);
	}

}
