import { RealTimeService } from '../../services/real-time.service';
import { OrderInspectionVehicle } from '../order-inspection-vehicle';

export class RealTimeType {

	private static all: { [name: string]: RealTimeType } = {};

	static readonly ORDER_INSPECTIONS = new RealTimeType(
		'ORDER_INSPECTIONS', (realTimeService: RealTimeService, info: any) => {
			realTimeService.syncOrders(info.orderInspections.map(d => new OrderInspectionVehicle(d)).filter(o => o.inspection));
		}
	);

	update: any;

	constructor(id: string, update: any) {
		this.update = update;
		RealTimeType.all[id] = this;
	}

	static parse(id: string): RealTimeType {
		return RealTimeType.all[id];
	}

}
