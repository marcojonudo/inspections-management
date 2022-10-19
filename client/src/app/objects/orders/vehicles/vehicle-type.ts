import { Vehicle } from './vehicle';
import { Car } from './car';
import { Scooter } from './scooter';
import { Bike } from './bike';

export class VehicleType {

	private static all: { [name: string]: VehicleType } = {};

	static readonly CAR = new VehicleType('CAR', 'car', (vehicle: any) => new Car(vehicle));
	static readonly MOTORBIKE = new VehicleType('MOTORBIKE', 'motorbike', (vehicle: any) => new Car(vehicle));
	static readonly E_BIKE = new VehicleType('E_BIKE', 'bike', (vehicle: any) => new Bike(vehicle));
	static readonly E_SCOOTER = new VehicleType('E_SCOOTER', 'scooter', (vehicle: any) => new Scooter(vehicle));

	id: string;
	backgroundImage: string;
	build: (vehicle: any) => Vehicle;

	constructor(id: string, backgroundImage: string, build: (vehicle: any) => Vehicle) {
		this.id = id;
		this.backgroundImage = backgroundImage;
		this.build = build;
		VehicleType.all[id] = this;
	}

	static parse(id: string): VehicleType {
		return VehicleType.all[id];
	}

}
