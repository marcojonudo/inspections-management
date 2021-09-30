import {SavedItem} from './saved-item';

export class SelectSavedItem extends SavedItem {

	value: string;

	constructor(savedItem: SelectSavedItem) {
		super(savedItem);
		this.value = savedItem.value;
	}

	findValue(): string {
		return this.value;
	}

}
