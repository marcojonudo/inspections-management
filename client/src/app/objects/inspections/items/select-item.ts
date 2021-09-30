import { SelectItemOption } from './select-item-option';
import { Item } from './item';

export class SelectItem extends Item {

	options: SelectItemOption[];

	constructor(item: any) {
		super(item);
		this.options = item.options.map(o => new SelectItemOption(o));
	}

}
