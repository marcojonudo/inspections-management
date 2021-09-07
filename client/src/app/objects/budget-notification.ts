export class BudgetNotification {

	orderNumber: number;
	accepted: boolean;

	constructor(budgetNotifications: any) {
		this.orderNumber = budgetNotifications.orderNumber;
		this.accepted = budgetNotifications.accepted;
	}

}
