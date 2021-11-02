import { environment } from '../../environments/environment';

export class Url {

	static orders(): string {
		return `${environment.serverUrl}/inspection/orders`;
	}

	static inspections(): string {
		return `${environment.serverUrl}/inspection/inspections`;
	}

	static savedInspections(): string {
		return `${environment.serverUrl}/inspection/savedInspections`;
	}

	static language(): string {
		return `${environment.serverUrl}/inspection/language`;
	}

	static articleItems(): string {
		return `${environment.serverUrl}/inspection/articleItems`;
	}

	static itemBudgets(): string {
		return `${environment.serverUrl}/inspection/itemBudgets`;
	}

	static budgetNotification(accepted: boolean = undefined): string {
		return `${environment.serverUrl}/inspection/budgetNotification?accepted=${accepted}`;
	}

	static employees(): string {
		return `${environment.serverUrl}/inspection/employees`;
	}

}
