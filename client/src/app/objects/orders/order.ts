import { OrderLine } from './order-line';
import { Client } from './client';
import { Budget } from './budget';
import { Vehicle } from './vehicles/vehicle';
import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';
import { VehicleType } from './vehicles/vehicle-type';

export class Order {

	number: number;
	code: string;
	day: Dayjs;
	state: string;
	vehicle: Vehicle;
	client: Client;
	sellerCode: string;
	mechanicCode: string;
	keys: boolean;
	lines: OrderLine[];
	budgets: Budget[];

	constructor(order: any) {
		this.number = order.number;
		this.code = order.code;
		this.day = dayjs(order.day);
		this.state = order.state;
		this.vehicle = order.vehicle ? VehicleType.parse(order.vehicle.type).build(order.vehicle) : undefined;
		this.client = new Client(order.client);
		this.sellerCode = order.sellerCode;
		this.mechanicCode = order.mechanicCode;
		this.keys = order.keys;
		this.lines = order.lines ? order.lines.map(line => new OrderLine(this.number, line)) : [];
		this.budgets = order.budgets.map(budget => new Budget(budget));
	}

}
