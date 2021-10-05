import { InspectionType } from './inspection-type';

export class InspectionVehicle {

	inspectionType: InspectionType;
	vehicle: string;

	constructor(inspectionVehicle: any) {
		this.inspectionType = new InspectionType(inspectionVehicle.inspectionType);
		this.vehicle = inspectionVehicle.vehicle;
	}

}
