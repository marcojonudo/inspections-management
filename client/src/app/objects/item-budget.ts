import { Image } from './inspections/image';

export class ItemBudget {

	itemCode: string;
	budgetType: string;
	image: Image;

	constructor(itemBudget: any) {
		this.itemCode = itemBudget.itemCode;
		this.budgetType = itemBudget.budgetType;
	}

}
