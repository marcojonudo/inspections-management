import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';

export class BudgetNotification {

	orderNumber: number;
	itemCode: string;
	accepted: Dayjs;
	notified: Dayjs;

	constructor(budgetNotifications: any) {
		this.orderNumber = budgetNotifications.orderNumber;
		this.itemCode = budgetNotifications.itemCode;
		this.accepted = budgetNotifications.accepted ? dayjs(budgetNotifications.accepted) : undefined;
		this.notified = budgetNotifications.notified ? dayjs(budgetNotifications.notified) : undefined;
	}

}
