import { CountryHandler } from './country-handler';

export class SpainHandler implements CountryHandler {

	findEmployeeCodeInputType(): string {
		return 'tel';
	}

	findEmployeeCodePlaceholder(): string {
		return '1234567';
	}

}
