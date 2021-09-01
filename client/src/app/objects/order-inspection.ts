import { Order } from './orders/order';
import { Inspection } from './inspections/inspection';
import { ItemBudget } from './item-budget';

export class OrderInspection {

	order: Order;
	inspection: Inspection;
	state: string;
	itemBudgets: ItemBudget[];

	constructor(orderInspection: any) {
		this.order = new Order(orderInspection.order);
		this.inspection = new Inspection(orderInspection.inspection);
		this.state = orderInspection.state;
		this.itemBudgets = orderInspection.itemBudgets.map(i => new ItemBudget(i));
	}

}
