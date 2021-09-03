import { Item } from './item';

export class TextItem extends Item {

	placeholder: string;

	constructor(item: any) {
		super(item);
		this.placeholder = item.placeholder;
	}

}
