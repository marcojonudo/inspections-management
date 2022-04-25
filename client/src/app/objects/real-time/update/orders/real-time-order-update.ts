import { InspectionsColumn } from '../../../../components/inspections/inspections.component';
import { Constants } from '../../../../utils/constants';
import { RealTimeOrder } from './real-time-order';
import { RealTimeBudget } from '../budgets/real-time-budget';
import { Budget } from '../../../orders/budget';
import { RealTimeBudgetCreate } from '../budgets/real-time-budget-create';
import { RealTimeBudgetDelete } from '../budgets/real-time-budget-delete';
import { RealTimeBudgetUpdate } from '../budgets/real-time-budget-update';
import { InspectionDetailsColumn } from '../../../../components/inspection-details/inspection-details.component';
import { OrderInspection } from '../../../order-inspection';
import { Order } from '../../../orders/order';
import { RealTimeOrderUpdateType } from './real-time-order-update-type';
import { InspectionService } from '../../../../services/inspection.service';

export class RealTimeOrderUpdate extends RealTimeOrder {

	updateTypes: RealTimeOrderUpdateType[];
	realTimeBudgets: RealTimeBudget[];

	readonly ORDER_UPDATE_PROPERTIES: ((order: Order) => void)[] = [
		(order: Order) => order.state,
		(order: Order) => order.code,
		(order: Order) => order.sellerCode,
		(order: Order) => order.mechanicCode,
		(order: Order) => order.keys,
		(order: Order) => order.vehicle.type,
		(order: Order) => order.vehicle.identifier,
		(order: Order) => order.vehicle.model,
		(order: Order) => order.vehicle.brand
	];

	constructor(
		orderInspections: OrderInspection[], orderInspection: OrderInspection, syncedOrderInspection: OrderInspection
	) {
		super(Constants.REAL_TIME_UPDATE_TYPE.UPDATE, orderInspections, undefined, orderInspection, syncedOrderInspection);
		this.updateTypes = [];
	}

	check(): boolean {
		this.updateTypes = RealTimeOrderUpdateType.findAll(this.orderInspection.order, this.syncedOrderInspection.order);
		const updated = this.ORDER_UPDATE_PROPERTIES.find(updateProperty =>
			updateProperty(this.orderInspection.order) !== updateProperty(this.syncedOrderInspection.order)
		);
		/* Al comprobar si se debe actualizar la OR, también se rellena el array de actualizaciones de presupuestos (al formar estos
		 * parte de la OR). De esta forma, cuando se ejecute el update, se llevarán a cabo todas las acciones pendientes */
		const syncedUpdates = this.handleSyncedBudgets(this.syncedOrderInspection.order.budgets, this.orderInspection.order.budgets);
		const existentDataUpdates = this.handleExistentData(this.syncedOrderInspection.order.budgets, this.orderInspection.order.budgets);
		this.realTimeBudgets = syncedUpdates.concat(existentDataUpdates);

		/* Una OR se considera actualizada cuando cambia algún campo, o cuando cambia algún presupuesto */
		return this.updateTypes.length > 0 || this.realTimeBudgets.length !== 0;
	}

	handleSyncedBudgets(syncedBudgets: Budget[], budgets: Budget[]): RealTimeBudget[] {
		const updates = [];
		syncedBudgets.forEach(syncedBudget => {
			const realTimeBudgetCreate = new RealTimeBudgetCreate(budgets, syncedBudgets, undefined, syncedBudget);
			if (realTimeBudgetCreate.check()) {
				updates.push(realTimeBudgetCreate);
			} else {
				const budget = realTimeBudgetCreate.find(syncedBudget);
				const realTimeBudgetUpdate = new RealTimeBudgetUpdate(budgets, syncedBudgets, budget, syncedBudget);
				if (realTimeBudgetUpdate.check()) {
					updates.push(realTimeBudgetUpdate);
				}
			}
		});
		return updates;
	}

	handleExistentData(syncedBudgets: Budget[], budgets: Budget[]): RealTimeBudget[] {
		const updates = [];
		budgets.forEach(budget => {
			const realTimeBudgetDelete = new RealTimeBudgetDelete(budgets, syncedBudgets, budget);
			/* Si no se encuentra la orden entre las obtenidas para la sincronización, es que se ha borrado */
			if (realTimeBudgetDelete.check()) {
				updates.push(realTimeBudgetDelete);
			}
		});
		return updates;
	}

	update(): void {
		this.updateTypes.forEach(updateType => updateType.update(this.orderInspection.order, this.syncedOrderInspection.order));
		this.realTimeBudgets.forEach(realTimeBudget => realTimeBudget.update());
	}

	updateInspectionsLayout(rows: InspectionsColumn[], row: InspectionsColumn): InspectionsColumn[] {
		row.brand = this.orderInspection.order.vehicle.brand;
		row.model = this.orderInspection.order.vehicle.model;

		if (!InspectionService.checkOpenedOrder(this.orderInspection.order)) {
			const i = rows.findIndex(c => c.orderNumber === this.orderInspection.order.number);
			rows.splice(i, 1);
		}
		return rows;
	}

	updateDetailsLayout(columns: InspectionDetailsColumn[]): InspectionDetailsColumn[] {
		return [];
	}

}
