import { InspectionType } from './inspection-type';
import { Item } from './items/item';

export class InspectionVehicle {

	inspectionType: InspectionType;
	vehicle: string;
	items: Item[];

	constructor(inspectionVehicle: any) {
		this.inspectionType = new InspectionType(inspectionVehicle.inspectionType);
		this.vehicle = inspectionVehicle.vehicle;
		this.items = inspectionVehicle.items.map(i => new Item(i));
	}

}
