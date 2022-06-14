import { RealTimeService } from '../../services/real-time.service';
import { OrderInspection } from '../order-inspection';
import { Builder } from '../../utils/builder';
import { InspectionService } from '../../services/inspection.service';
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
			realTimeService.syncOrders(info.orderInspections.map(d => new OrderInspection(d)).filter(o => o.inspection)),
		(orderInspections: OrderInspection[], syncedOrderInspection: OrderInspection) =>
			new RealTimeOrderCreate(orderInspections, syncedOrderInspection),
		(orderInspections: OrderInspection[], orderInspection: OrderInspection, syncedOrderInspection: OrderInspection) =>
			new RealTimeOrderUpdate(orderInspections, orderInspection, syncedOrderInspection)
	);
	static readonly SAVED_INSPECTION = new RealTimeType(
		'SAVED_INSPECTION',
		(realTimeService: RealTimeService, info: any) =>
			realTimeService.syncSavedInspection(Builder.buildSavedInspection(info.savedInspection)),
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
