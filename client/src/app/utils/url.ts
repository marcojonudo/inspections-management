import { environment } from '../../environments/environment';
import { Dayjs } from 'dayjs';
import { Constants } from './constants';

export class Url {

	static publisher(): string {
		return `${environment.serverUrl}/inspection/publisher`;
	}

	static orders(): string {
		return `${environment.serverUrl}/inspection/orders`;
	}

	static inspections(): string {
		return `${environment.serverUrl}/inspection/inspections`;
	}

	static savedInspections(): string {
		return `${environment.serverUrl}/savedInspections`;
	}

	static savedInspection(): string {
		return `${environment.serverUrl}/inspection/savedInspection`;
	}

	static language(): string {
		return `${environment.serverUrl}/inspection/language`;
	}

	static articleItems(): string {
		return `${environment.serverUrl}/inspection/articleItems`;
	}

	static selectItemOptions(): string {
		return `${environment.serverUrl}/selectItemOptions`;
	}

	static itemBudgets(): string {
		return `${environment.serverUrl}/inspection/itemBudgets`;
	}

	static budgetNotification(): string {
		return `${environment.serverUrl}/inspection/budgetNotification`;
	}

	static employees(): string {
		return `${environment.serverUrl}/inspection/employees`;
	}

	static centre(): string {
		return `${environment.serverUrl}/inspection/centre`;
	}

	static images(): string {
		return `${environment.serverUrl}/images`;
	}

	static mails(orderNumber: number, to: string, employeeCode: string): string {
		return `${environment.serverUrl}/mails?orderNumber=${orderNumber}&to=${to}&employeeCode=${employeeCode}`;
	}

}
