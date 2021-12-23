import { Order } from '../../../orders/order';
import { InspectionsColumn } from '../../../../components/inspections/inspections.component';

export abstract class RealTimeOrder {

	private type: string;
	protected orders: Order[];
	protected syncedOrders: Order[];
	order: Order;
	syncedOrder: Order;

	protected constructor(type: string, orders: Order[], syncedOrders: Order[], order: Order, syncedOrder: Order) {
		this.type = type;
		this.orders = orders;
		this.syncedOrders = syncedOrders;
		this.order = order;
		this.syncedOrder = syncedOrder;
	}

	abstract check(): boolean;

	abstract update(): void;

	abstract updateInspectionsLayout(column: InspectionsColumn, columns: InspectionsColumn[]): void;

	findIndex(orders: Order[], order: Order): number {
		return orders.findIndex(o => o.number === order.number);
	}

	find(order: Order): Order {
		return this.orders.find(o => o.number === order.number);
	}

}
