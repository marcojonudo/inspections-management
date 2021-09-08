export class BudgetNotification {

	orderNumber: number;
	itemCode: string;
	accepted: boolean;

	constructor(budgetNotifications: any) {
		this.orderNumber = budgetNotifications.orderNumber;
		this.itemCode = budgetNotifications.itemCode;
		this.accepted = budgetNotifications.accepted;
	}

}
