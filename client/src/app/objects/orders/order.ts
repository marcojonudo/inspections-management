import { OrderLine } from './order-line';
import { Client } from './client';
import { Budget } from './budget';
import { Vehicle } from './vehicles/vehicle';
import { Builder } from '../../utils/builder';

export class Order {

	number: number;
	code: string;
	state: string;
	vehicle: Vehicle;
	client: Client;
	sellerCode: string;
	mechanicCode: string;
	lines: OrderLine[];
	budgets: Budget[];

	constructor(order: any) {
		this.number = order.number;
		this.code = order.code;
		this.state = order.state;
		this.vehicle = Builder.buildVehicle(order.vehicle);
		this.client = new Client(order.client);
		this.sellerCode = order.sellerCode;
		this.mechanicCode = order.mechanicCode;
		this.lines = order.lines ? order.lines.map(line => new OrderLine(this.number, line)) : [];
		this.budgets = order.budgets.map(budget => new Budget(budget));
	}

}
