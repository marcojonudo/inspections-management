import { environment } from '../../environments/environment';

export class Url {

	static publisher(): string {
		return `${environment.serverUrl}/inspections/publisher`;
	}

	static orders(): string {
		return `${environment.serverUrl}/orders`;
	}

	static inspections(): string {
		return `${environment.serverUrl}/inspections`;
	}

	static savedInspections(): string {
		return `${environment.serverUrl}/savedInspections`;
	}

	static languages(): string {
		return `${environment.serverUrl}/languages`;
	}

	static articleItems(): string {
		return `${environment.serverUrl}/articleItems`;
	}

	static selectItemOptions(): string {
		return `${environment.serverUrl}/selectItemOptions`;
	}

	static itemBudgets(): string {
		return `${environment.serverUrl}/itemBudgets`;
	}

	static budgetNotification(orderNumber: number = undefined): string {
		return `${environment.serverUrl}/budgetNotifications/${orderNumber ? orderNumber : ''}`;
	}

	static employees(): string {
		return `${environment.serverUrl}/employees`;
	}

	static centres(): string {
		return `${environment.serverUrl}/centres`;
	}

	static itemRelations(): string {
		return `${environment.serverUrl}/itemRelations`;
	}

	static items(): string {
		return `${environment.serverUrl}/items`;
	}

	static images(): string {
		return `${environment.serverUrl}/images`;
	}

	static mails(to: string): string {
		return `${environment.serverUrl}/mails?to=${to}`;
	}

	static sms(to: number, employeeCode: string): string {
		return `${environment.serverUrl}/sms?to=${to}&employeeCode=${employeeCode}`;
	}

	static info(): string {
		return `${environment.serverUrl}/info`;
	}

}
