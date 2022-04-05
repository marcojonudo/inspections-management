import { SelectItemOption } from './select-item-option';

export class GroupedItemOptions {

	itemCode: string;
	options: SelectItemOption[];

	constructor(itemCode: string, option: SelectItemOption) {
		this.itemCode = itemCode;
		this.options = [option];
	}

	add(option: SelectItemOption): void {
		this.options.push(option);
	}

}
