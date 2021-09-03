import { environment } from '../../environments/environment';

export class Url {

	static orders(): string {
		return `${ environment.serverUrl }/inspection/orders`;
	}

	static orderInspections(): string {
		return `${ environment.serverUrl }/inspection/orderInspection`;
	}

	static language(): string {
		return `${ environment.serverUrl }/inspection/language`;
	}

	static articleItems(): string {
		return `${ environment.serverUrl }/inspection/articleItems`;
	}

	static itemBudgets(): string {
		return `${ environment.serverUrl }/inspection/itemBudgets`;
	}

	static clientBudgetNotifications(): string {
		return `${ environment.serverUrl }/inspection/clientBudgetNotifications`;
	}

}
