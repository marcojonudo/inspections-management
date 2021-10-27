import { SavedItem } from './saved-items/saved-item';
import { Builder } from '../builder';
import { ItemBudget } from '../item-budget';
import { Constants } from '../constants';

export class SavedInspection {

	orderNumber: number;
	employeeCode: string;
	state: string;
	items: SavedItem[];
	itemBudgets: ItemBudget[];

	constructor(savedInspection: any, itemBudgets: ItemBudget[]) {
		this.orderNumber = savedInspection.orderNumber;
		this.employeeCode = savedInspection.employeeCode;
		this.state = savedInspection.state;
		this.items = savedInspection.items.map(i => Builder.buildSavedItem(i));
		this.itemBudgets = itemBudgets.filter(itemBudget => {
			const item = this.items.find(savedItem =>
				savedItem.item.type === Constants.ITEM_TYPE.SELECT && savedItem.item.code === itemBudget.itemCode
			);
			return item && item.filled && item.findValue() !== Constants.SELECT_ITEM_OPTION_CODE.C;
		});
	}

}
