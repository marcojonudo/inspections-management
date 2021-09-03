import { Item } from './item';

export class TextAreaItem extends Item {

	ownCategory: boolean;

	constructor(item: any) {
		super(item);
		this.ownCategory = item.ownCategory;
	}

}
