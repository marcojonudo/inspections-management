import { Order } from '../../../orders/order';

export class RealTimeOrderUpdateType {

	static all: { [name: string]: RealTimeOrderUpdateType } = {};

	static readonly STATE = new RealTimeOrderUpdateType(
		'STATE',
		(order1: Order, order2: Order) => order1.state !== order2.state,
		(order1: Order, order2: Order) => order1.state = order2.state,
	);
	static readonly CODE = new RealTimeOrderUpdateType(
		'CODE',
		(order1: Order, order2: Order) => order1.code !== order2.code,
		(order1: Order, order2: Order) => order1.code = order2.code
	);
	static readonly SELLER_CODE = new RealTimeOrderUpdateType(
		'SELLER_CODE',
		(order1: Order, order2: Order) => order1.sellerCode !== order2.sellerCode,
		(order1: Order, order2: Order) => order1.sellerCode = order2.sellerCode
	);
	static readonly MECHANIC_CODE = new RealTimeOrderUpdateType(
		'MECHANIC_CODE',
		(order1: Order, order2: Order) => order1.mechanicCode !== order2.mechanicCode,
		(order1: Order, order2: Order) => order1.mechanicCode = order2.mechanicCode
	);
	static readonly KEYS = new RealTimeOrderUpdateType(
		'KEYS',
		(order1: Order, order2: Order) => order1.keys !== order2.keys,
		(order1: Order, order2: Order) => order1.keys = order2.keys
	);
	static readonly VEHICLE_TYPE = new RealTimeOrderUpdateType(
		'VEHICLE_TYPE',
		(order1: Order, order2: Order) => order1.vehicle.type !== order2.vehicle.type,
		(order1: Order, order2: Order) => order1.vehicle.type = order2.vehicle.type
	);
	static readonly VEHICLE_IDENTIFIER = new RealTimeOrderUpdateType(
		'VEHICLE_IDENTIFIER',
		(order1: Order, order2: Order) => order1.vehicle.identifier !== order2.vehicle.identifier,
		(order1: Order, order2: Order) => order1.vehicle.identifier = order2.vehicle.identifier
	);
	static readonly VEHICLE_MODEL = new RealTimeOrderUpdateType(
		'VEHICLE_MODEL',
		(order1: Order, order2: Order) => order1.vehicle.model !== order2.vehicle.model,
		(order1: Order, order2: Order) => order1.vehicle.model = order2.vehicle.model
	);
	static readonly VEHICLE_BRAND = new RealTimeOrderUpdateType(
		'VEHICLE_BRAND',
		(order1: Order, order2: Order) => order1.vehicle.brand !== order2.vehicle.brand,
		(order1: Order, order2: Order) => order1.vehicle.brand = order2.vehicle.brand
	);

	id: string;
	check: ((order1: Order, order2: Order) => any);
	update: ((order1: Order, order2: Order) => void);

	constructor(id: string, check: ((order1: Order, order2: Order) => any), update: ((order1: Order, order2: Order) => any)) {
		this.id = id;
		this.check = check;
		this.update = update;
		RealTimeOrderUpdateType.all[id] = this;
	}

	static parse(id: string): RealTimeOrderUpdateType {
		return RealTimeOrderUpdateType.all[id];
	}

	static findAll(order1: Order, order2: Order): RealTimeOrderUpdateType[] {
		return Object.values(RealTimeOrderUpdateType.all).filter(value => value.check(order1, order2));
	}

}
