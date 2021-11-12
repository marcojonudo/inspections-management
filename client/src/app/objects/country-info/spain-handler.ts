import { CountryHandler } from './country-handler';
import { ValidatorFn, Validators } from '@angular/forms';
import { Constants } from '../../utils/constants';

export class SpainHandler implements CountryHandler {

	findEmployeeCodeLength(): number {
		return Constants.EMPLOYEE_CODE_MAX_LENGTH;
	}

	findEmployeeCodeInputType(): string {
		return 'tel';
	}

	findEmployeeCodePlaceholder(): string {
		return '1234567';
	}

}
