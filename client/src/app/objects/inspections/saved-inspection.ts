import { SavedItem } from './saved-items/saved-item';
import { Builder } from '../builder';

export class SavedInspection {

	code: string;
	name: string;
	items: SavedItem[];

	constructor(savedInspection: any) {
		this.code = savedInspection.code;
		this.name = savedInspection.name;
		this.items = savedInspection.items.map(i => Builder.buildSavedItem(i));
	}

}
