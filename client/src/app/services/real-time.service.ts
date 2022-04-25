import { Injectable } from '@angular/core';
import { InspectionService } from './inspection.service';
import { Url } from '../utils/url';
import { RealTimeType } from '../objects/real-time/real-time-type';
import { OrderInspection } from '../objects/order-inspection';
import { Observable, Subject } from 'rxjs';
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
		syncedOrderInspections: OrderInspection[], orderInspections: OrderInspection[] = InspectionService.orderInspections
	): void {
		/* Se obtienen las actualizaciones en tiempo real (creación, actualización y borrado de OR) */
		const updates = this.findOrdersUpdates(RealTimeType.ORDER_INSPECTIONS, syncedOrderInspections, orderInspections);

		if (updates.length) {
			updates.forEach(update => update.update());
			this.realTimeActionsSubject.next(updates);
		}
	}

	findOrdersUpdates(
		type: RealTimeType, syncedOrderInspections: OrderInspection[], orderInspections: OrderInspection[]
	): RealTimeAction[] {
		const updates = [];
		/* Se recorre la lista de órdenes sincronizadas para comprobar si hay creaciones o actualizaciones */
		syncedOrderInspections.forEach(syncedOrderInspection => {
			const update = this.handleCreateOrUpdateAction(type, orderInspections, syncedOrderInspection);
			if (update) {
				updates.push(update);
			}
		});
		/* Para comprobar si se ha borrado una orden, es necesario recorrer la lista de órdenes ya existentes (ya que una OR eliminada
		 * no aparecerá en el nuevo array sincronizado) */
		const deleteUpdates = this.findDeletedOrdersUpdates(syncedOrderInspections, orderInspections);
		return updates.concat(deleteUpdates);
	}

	findDeletedOrdersUpdates(syncedOrderInspections: OrderInspection[], orderInspections: OrderInspection[]): RealTimeOrder[] {
		const updates = [];
		orderInspections.forEach(orderInspection => {
			const realTimeDelete = new RealTimeOrderDelete(orderInspections, syncedOrderInspections, orderInspection);
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
