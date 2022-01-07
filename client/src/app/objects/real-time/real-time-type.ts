import { RealTimeService } from '../../services/real-time.service';
import { OrderInspectionVehicle } from '../order-inspection-vehicle';
import { Builder } from '../../utils/builder';
import { InspectionService } from '../../services/inspection.service';
import { Order } from '../orders/order';
import { RealTimeOrderCreate } from './update/orders/real-time-order-create';
import { SavedInspection } from '../inspections/saved-inspection';
import { RealTimeSavedInspectionCreate } from './update/saved-inspections/real-time-saved-inspection-create';
import { RealTimeOrderUpdate } from './update/orders/real-time-order-update';
import { RealTimeSavedInspectionUpdate } from './update/saved-inspections/real-time-saved-inspection-update';

export class RealTimeType {

	private static all: { [name: string]: RealTimeType } = {};

	static readonly ORDER_INSPECTIONS = new RealTimeType(
		'ORDER_INSPECTIONS',
		(realTimeService: RealTimeService, info: any) =>
			realTimeService.syncOrders(info.orderInspections.map(d => new OrderInspectionVehicle(d)).filter(o => o.inspection)),
		(orders: Order[], syncedOrder: Order) => new RealTimeOrderCreate(orders, syncedOrder),
		(orders: Order[], order: Order, syncedOrder: Order) => new RealTimeOrderUpdate(orders, order, syncedOrder)
	);
	static readonly SAVED_INSPECTION = new RealTimeType(
		'SAVED_INSPECTION',
		(realTimeService: RealTimeService, info: any) =>
			realTimeService.syncSavedInspection(Builder.buildSavedInspection(info.savedInspection, InspectionService.itemBudgets)),
		(savedInspections: SavedInspection[], synced: SavedInspection) => new RealTimeSavedInspectionCreate(savedInspections, synced),
		(savedInspections: SavedInspection[], savedInspection: SavedInspection, syncedInspection: SavedInspection) =>
			new RealTimeSavedInspectionUpdate(savedInspections, savedInspection, syncedInspection)
	);

	id: string;
	update: any;
	buildCreateAction: any;
	buildUpdateAction: any;

	constructor(id: string, update: any, buildCreateAction: any, buildUpdateAction: any) {
		this.id = id;
		this.update = update;
		this.buildCreateAction = buildCreateAction;
		this.buildUpdateAction = buildUpdateAction;
		RealTimeType.all[id] = this;
	}

	static parse(id: string): RealTimeType {
		return RealTimeType.all[id];
	}

}
