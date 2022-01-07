import { Order } from '../../../orders/order';
import { InspectionsColumn } from '../../../../components/inspections/inspections.component';
import { RealTimeAction } from '../real-time-action';

export abstract class RealTimeOrder extends RealTimeAction {

	protected orders: Order[];
	protected syncedOrders: Order[];
	order: Order;
	syncedOrder: Order;

	protected constructor(type: string, orders: Order[], syncedOrders: Order[], order: Order, syncedOrder: Order) {
		super(type);
		this.orders = orders;
		this.syncedOrders = syncedOrders;
		this.order = order;
		this.syncedOrder = syncedOrder;
	}

	findOrderNumber(): number {
		return this.order.number;
	}

	findIndex(orders: Order[], order: Order): number {
		return orders.findIndex(o => o.number === order.number);
	}

	find(order: Order): Order {
		return this.orders.find(o => o.number === order.number);
	}

}
