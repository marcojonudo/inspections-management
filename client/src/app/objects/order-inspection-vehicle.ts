import { InspectionVehicle } from './inspections/inspection-vehicle';
import { Order } from './orders/order';

export class OrderInspectionVehicle {

	order: Order;
	inspection: InspectionVehicle;

	constructor(orderInspectionVehicle: any) {
		this.order = new Order(orderInspectionVehicle.order);
		this.order = orderInspectionVehicle.order;
		if (orderInspectionVehicle.inspectionVehicle) {
			this.inspection = new InspectionVehicle(orderInspectionVehicle.inspectionVehicle);
		}
	}

}
