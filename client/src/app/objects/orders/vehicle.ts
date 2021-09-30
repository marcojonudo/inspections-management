export class Vehicle {

	numberPlate: string;
	brand: string;
	model: string;
	cylinder: string;
	engineCode: string;
	power: string;
	registrationYear: number;

	constructor(vehicle: any) {
		this.numberPlate = vehicle.numberPlate;
		this.brand = vehicle.brand;
		this.model = vehicle.model;
		this.cylinder = vehicle.cylinder;
		if (vehicle.extraInfo) {
			this.engineCode = vehicle.extraInfo.engineCode;
			this.power = vehicle.extraInfo.power !== '0.00' ? vehicle.extraInfo.power : undefined;
		}
		this.registrationYear = vehicle.registrationYear;
	}

}
