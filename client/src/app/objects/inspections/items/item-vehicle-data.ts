import { GaragePosition } from '../garage-position';
import { VehicleSection } from '../vehicle-section';

export class ItemVehicleData {

	vehicle: string;
	garagePosition: GaragePosition;
	vehicleSection: VehicleSection;

	constructor(item: any) {
		this.vehicle = item.vehicle;
		this.garagePosition = item.garagePosition ? new GaragePosition(item.garagePosition) : undefined;
		this.vehicleSection = item.vehicleSection ? new VehicleSection(item.vehicleSection) : undefined;
	}

}
