import { Vehicle } from './vehicle';

export class Car extends Vehicle {

	cylinder: string;
	engineCode: string;
	power: string;
	registrationYear: number;

	constructor(car: any) {
		super(car);
		this.cylinder = car.cylinder;
		this.engineCode = car.engineCode;
		this.power = car.power !== '0.00' ? car.power : undefined;
		this.registrationYear = car.registrationYear;
	}

}
