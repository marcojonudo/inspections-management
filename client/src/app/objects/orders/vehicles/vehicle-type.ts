export class VehicleType {

	private static all: { [name: string]: VehicleType } = {};

	static readonly CAR = new VehicleType('CAR', 'car');
	static readonly MOTORBIKE = new VehicleType('MOTORBIKE', 'motorbike');
	static readonly E_BIKE = new VehicleType('E_BIKE', 'bike');
	static readonly E_SCOOTER = new VehicleType('E_SCOOTER', 'scooter');

	id: string;
	backgroundImage: string;

	constructor(id: string, backgroundImage: string) {
		this.id = id;
		this.backgroundImage = backgroundImage;
		VehicleType.all[id] = this;
	}

	static parse(id: string): VehicleType {
		return VehicleType.all[id];
	}

}
