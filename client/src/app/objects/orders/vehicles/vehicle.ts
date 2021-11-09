export class Vehicle {

	type: string;
	identifier: string;
	brand: string;
	model: string;

	constructor(vehicle: any) {
		this.type = vehicle.type;
		this.identifier = vehicle.identifier;
		this.brand = vehicle.brand;
		this.model = vehicle.model;
	}

}
