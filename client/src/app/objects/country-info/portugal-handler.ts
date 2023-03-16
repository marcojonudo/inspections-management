import { CountryHandler } from './country-handler';

export class PortugalHandler implements CountryHandler {

	findEmployeeCodeInputType(): string {
		return 'text';
	}

	findEmployeeCodePlaceholder(): string {
		return 'mg';
	}

}
