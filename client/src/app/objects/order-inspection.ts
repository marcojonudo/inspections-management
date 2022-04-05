import { InspectionVehicle } from './inspections/inspection-vehicle';
import { Order } from './orders/order';
import { RealTimeObject } from './real-time/update/real-time-object';

export class OrderInspection implements RealTimeObject {

	order: Order;
	inspection: InspectionVehicle;

	constructor(orderInspectionVehicle: any) {
		this.order = new Order(orderInspectionVehicle.order);
		if (orderInspectionVehicle.inspectionVehicle) {
			this.inspection = new InspectionVehicle(orderInspectionVehicle.inspectionVehicle);
		}
	}

}
