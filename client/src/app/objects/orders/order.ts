import { OrderLine } from './order-line';
import { Vehicle } from './vehicle';
import { Client } from './client';

export class Order {

	number: number;
	code: string;
	vehicle: Vehicle;
	client: Client;
	sellerCode: string;
	lines: OrderLine[];

	constructor(order: any) {
		this.number = order.number;
		this.code = order.code;
		this.vehicle = new Vehicle(order.vehicle);
		this.client = new Client(order.client);
		this.sellerCode = order.sellerCode;
		this.lines = order.lines.map(line => new OrderLine(this.number, line));
	}

}
