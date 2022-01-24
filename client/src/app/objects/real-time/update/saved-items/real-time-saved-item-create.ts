import { Constants } from '../../../../utils/constants';
import { RealTimeSavedItem } from './real-time-saved-item';
import { SavedItem } from '../../../inspections/saved-items/saved-item';

export class RealTimeSavedItemCreate extends RealTimeSavedItem {

	constructor(savedItems: SavedItem[], syncedSavedItems: SavedItem[], savedItem: SavedItem, syncedSavedItem: SavedItem) {
		super(Constants.REAL_TIME_UPDATE_TYPE.CREATE, savedItems, syncedSavedItems, savedItem, syncedSavedItem);
	}

	check(): boolean {
		return this.findIndex(this.savedItems, this.syncedSavedItem) === -1;
	}

	update(): void {
		this.savedItems.push(this.syncedSavedItem);
	}

}
