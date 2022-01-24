import { Injectable } from '@angular/core';
import { InspectionService } from './inspection.service';
import { Url } from '../utils/url';
import { RealTimeType } from '../objects/real-time/real-time-type';
import { OrderInspectionVehicle } from '../objects/order-inspection-vehicle';
import { Observable, Subject } from 'rxjs';
import { Order } from '../objects/orders/order';
import { SavedInspection } from '../objects/inspections/saved-inspection';
import { RealTimeAction } from '../objects/real-time/update/real-time-action';
import { RealTimeObject } from '../objects/real-time/update/real-time-object';
import { RealTimeOrder } from '../objects/real-time/update/orders/real-time-order';
import { RealTimeOrderDelete } from '../objects/real-time/update/orders/real-time-order-delete';

@Injectable({
	providedIn: 'root'
})
export class RealTimeService {

	static sessionId: string;

	realTimeActionsSubject: Subject<RealTimeAction[]>;
	realTimeActions$: Observable<RealTimeAction[]>;

	constructor() {
		this.connectUpdatePublisher();

		this.realTimeActionsSubject = new Subject<RealTimeAction[]>();
		this.realTimeActions$ = this.realTimeActionsSubject.asObservable();
	}

	static generateRandomId(): void {
		this.sessionId = Math.random().toString(36).slice(2);
	}

	connectUpdatePublisher(): void {
		const eventSource = new EventSource(Url.publisher());
		eventSource.onmessage = event => {
			if (event.lastEventId !== RealTimeService.sessionId) {
				const updateInfo = JSON.parse(event.data);
				console.log('Update info', updateInfo);
				const type = RealTimeType.parse(updateInfo.type);
				type.update(this, updateInfo);
			}
		};
	}

	syncOrders(
		syncedOrderInspections: OrderInspectionVehicle[], orderInspections: OrderInspectionVehicle[] = InspectionService.orderInspections
	): void {
		const syncedOrders = syncedOrderInspections.map(o => o.order);
		const orders = orderInspections.map(o => o.order);
		/* Se obtienen las actualizaciones en tiempo real (creación, actualización y borrado de OR) */
		const updates = this.findOrdersUpdates(RealTimeType.ORDER_INSPECTIONS, syncedOrders, orders);

		if (updates.length) {
			console.log('orders', orders);
			console.log('updates', updates);
			updates.forEach(update => update.update());
			this.realTimeActionsSubject.next(updates);
		}
	}

	findOrdersUpdates(type: RealTimeType, syncedOrders: Order[], orders: Order[]): RealTimeAction[] {
		const updates = [];
		/* Se recorre la lista de órdenes sincronizadas para comprobar si hay creaciones o actualizaciones */
		syncedOrders.forEach(syncedOrder => {
			const update = this.handleCreateOrUpdateAction(type, orders, syncedOrder);
			if (update) {
				updates.push(update);
			}
		});
		/* Para comprobar si se ha borrado una orden, es necesario recorrer la lista de órdenes ya existentes (ya que una OR eliminada
		 * no aparecerá en el nuevo array sincronizado) */
		const deleteUpdates = this.findDeletedOrdersUpdates(syncedOrders, orders);
		return updates.concat(deleteUpdates);
	}

	findDeletedOrdersUpdates(syncedOrders: Order[], orders: Order[]): RealTimeOrder[] {
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

	syncSavedInspection(
		syncedSavedInspection: SavedInspection, savedInspections: SavedInspection[] = InspectionService.savedInspections
	): void {
		/* Se obtienen las acciones para crear o actualizar una revisión. No se comprueba nada relativo a su eliminación, ya que desde la
		 * aplicación de los móvil no se pueden borrar */
		const syncedUpdate = this.handleCreateOrUpdateAction(RealTimeType.SAVED_INSPECTION, savedInspections, syncedSavedInspection);
		if (syncedUpdate) {
			syncedUpdate.update();
			this.realTimeActionsSubject.next([syncedUpdate]);
		}
	}

	handleCreateOrUpdateAction(type: RealTimeType, existentData: RealTimeObject[], syncedObject: RealTimeObject): RealTimeAction {
		let realTimeAction;
		const realTimeCreate = type.buildCreateAction(existentData, syncedObject);
		if (realTimeCreate.check()) {
			realTimeAction = realTimeCreate;
		} else {
			const object = realTimeCreate.find(syncedObject);
			const realTimeUpdate = type.buildUpdateAction(existentData, object, syncedObject);
			if (realTimeUpdate.check()) {
				realTimeAction = realTimeUpdate;
			}
		}
		return realTimeAction;
	}

}
