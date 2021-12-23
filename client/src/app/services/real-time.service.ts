import { Injectable } from '@angular/core';
import { InspectionService } from './inspection.service';
import { Url } from '../utils/url';
import { RealTimeType } from '../objects/real-time/real-time-type';
import { OrderInspectionVehicle } from '../objects/order-inspection-vehicle';
import { Observable, Subject } from 'rxjs';
import { RealTimeOrderCreate } from '../objects/real-time/update/orders/real-time-order-create';
import { RealTimeOrderDelete } from '../objects/real-time/update/orders/real-time-order-delete';
import { RealTimeOrder } from '../objects/real-time/update/orders/real-time-order';
import { Order } from '../objects/orders/order';
import { RealTimeOrderUpdate } from '../objects/real-time/update/orders/real-time-order-update';

@Injectable({
	providedIn: 'root'
})
export class RealTimeService {

	realTimeOrdersSubject: Subject<RealTimeOrder[]>;
	realTimeOrders$: Observable<RealTimeOrder[]>;

	constructor() {
		this.connectUpdatePublisher();

		this.realTimeOrdersSubject = new Subject<RealTimeOrder[]>();
		this.realTimeOrders$ = this.realTimeOrdersSubject.asObservable();
	}

	connectUpdatePublisher(): void {
		const eventSource = new EventSource(Url.publisher());
		eventSource.onmessage = event => {
			const updateInfo = JSON.parse(event.data);
			const type = RealTimeType.parse(updateInfo.type);
			type.update(this, updateInfo);
		};
	}

	syncOrders(
		syncedOrderInspections: OrderInspectionVehicle[], orderInspections: OrderInspectionVehicle[] = InspectionService.orderInspections
	): void {
		const syncedOrders = syncedOrderInspections.map(o => o.order);
		const orders = orderInspections.map(o => o.order);
		const syncedUpdates = this.handleSyncedOrders(syncedOrders, orders);
		const existentDataUpdates = this.handleExistentData(syncedOrders, orders);

		const updates = syncedUpdates.concat(existentDataUpdates);
		if (updates.length) {
			updates.forEach(update => update.update());
			this.realTimeOrdersSubject.next(updates);
		}
	}

	handleSyncedOrders(syncedOrders: Order[], orders: Order[]): RealTimeOrder[] {
		const updates = [];
		syncedOrders.forEach(syncedOrder => {
			const realTimeCreate = new RealTimeOrderCreate(orders, syncedOrders, undefined, syncedOrder);
			if (realTimeCreate.check()) {
				updates.push(realTimeCreate);
			} else {
				const order = realTimeCreate.find(syncedOrder);
				const realTimeUpdate = new RealTimeOrderUpdate(orders, syncedOrders, order, syncedOrder);
				if (realTimeUpdate.check()) {
					updates.push(realTimeUpdate);
				}
			}
		});
		return updates;
	}

	handleExistentData(syncedOrders: Order[], orders: Order[]): RealTimeOrder[] {
		const updates = [];
		orders.forEach(order => {
			const realTimeDelete = new RealTimeOrderDelete(orders, syncedOrders, order);
			/* Si no se encuentra la orden entre las obtenidas para la sincronización, es que se ha borrado */
			if (realTimeDelete.check()) {
				updates.push(realTimeDelete);
			}
		});
		return updates;
	}

}
