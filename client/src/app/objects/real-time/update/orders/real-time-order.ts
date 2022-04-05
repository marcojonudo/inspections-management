import { RealTimeAction } from '../real-time-action';
import { OrderInspection } from '../../../order-inspection';

export abstract class RealTimeOrder extends RealTimeAction {

	protected orderInspections: OrderInspection[];
	protected syncedOrderInspections: OrderInspection[];
	orderInspection: OrderInspection;
	syncedOrderInspection: OrderInspection;

	protected constructor(
		type: string,
		orderInspections: OrderInspection[],
		syncedOrderInspections: OrderInspection[],
		orderInspection: OrderInspection,
		syncedOrderInspection: OrderInspection
	) {
		super(type);
		this.orderInspections = orderInspections;
		this.syncedOrderInspections = syncedOrderInspections;
		this.orderInspection = orderInspection;
		this.syncedOrderInspection = syncedOrderInspection;
	}

	findOrderNumber(): number {
		return (this.orderInspection || this.syncedOrderInspection).order.number;
	}

	findIndex(orders: OrderInspection[], orderInspection: OrderInspection): number {
		return orders.findIndex(o => o.order.number === orderInspection.order.number);
	}

	find(orderInspection: OrderInspection): OrderInspection {
		return this.orderInspections.find(o => o.order.number === orderInspection.order.number);
	}

}
