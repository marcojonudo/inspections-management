import { Constants } from '../../../../utils/constants';
import { RealTimeSavedItem } from './real-time-saved-item';
import { SavedItem } from '../../../inspections/saved-items/saved-item';

export class RealTimeSavedItemDelete extends RealTimeSavedItem {

	constructor(savedItems: SavedItem[], syncedSavedItems: SavedItem[], savedItem: SavedItem) {
		super(Constants.REAL_TIME_UPDATE_TYPE.DELETE, savedItems, syncedSavedItems, savedItem, undefined);
	}

	check(): boolean {
		return this.findIndex(this.syncedSavedItems, this.savedItem) === -1;
	}

	update(): void {
		const i = this.findIndex(this.savedItems, this.savedItem);
		this.savedItems.splice(i, 1);
	}

}
