import { SavedItem } from '../../../inspections/saved-items/saved-item';

export abstract class RealTimeSavedItem {

	private type: string;
	protected savedItems: SavedItem[];
	protected syncedSavedItems: SavedItem[];
	savedItem: SavedItem;
	syncedSavedItem: SavedItem;

	protected constructor(
		type: string, savedItems: SavedItem[], syncedSavedItems: SavedItem[], savedItem: SavedItem, syncedSavedItem: SavedItem
	) {
		this.type = type;
		this.savedItems = savedItems;
		this.syncedSavedItems = syncedSavedItems;
		this.savedItem = savedItem;
		this.syncedSavedItem = syncedSavedItem;
	}

	abstract check(): boolean;

	abstract update(): void;

	findIndex(savedItems: SavedItem[], savedItem: SavedItem): number {
		return savedItems.findIndex(i => i.item.code === savedItem.item.code);
	}

	find(savedItem: SavedItem): SavedItem {
		return this.savedItems.find(i => i.item.code === savedItem.item.code);
	}

}
