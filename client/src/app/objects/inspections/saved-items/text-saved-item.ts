import {SavedItem} from './saved-item';

export class TextSavedItem extends SavedItem {

	text: string;

	constructor(savedItem: TextSavedItem) {
		super(savedItem);
		this.text = savedItem?.text;
	}

	findValue(): string {
		return this.text;
	}

}
