export class ItemBudget {

	itemCode: string;
	budgetType: string;

	constructor(itemBudget: any) {
		this.itemCode = itemBudget.itemCode;
		this.budgetType = itemBudget.budgetType;
	}

}
