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

}
