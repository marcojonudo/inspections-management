import { InspectionsColumn } from '../../../../components/inspections/inspections.component';
import { Constants } from '../../../../utils/constants';
import { Order } from '../../../orders/order';
import { RealTimeOrder } from './real-time-order';
import { RealTimeBudget } from '../budgets/real-time-budget';
import { Budget } from '../../../orders/budget';
import { RealTimeBudgetCreate } from '../budgets/real-time-budget-create';
import { RealTimeBudgetDelete } from '../budgets/real-time-budget-delete';
import { RealTimeBudgetUpdate } from '../budgets/real-time-budget-update';

export class RealTimeOrderUpdate extends RealTimeOrder {

	realTimeBudgets: RealTimeBudget[];

	readonly ORDER_UPDATE_PROPERTIES: ((order: Order) => void)[] = [
		(order: Order) => order.code,
		(order: Order) => order.sellerCode,
		(order: Order) => order.mechanicCode,
		(order: Order) => order.keys,
		(order: Order) => order.vehicle.type,
		(order: Order) => order.vehicle.identifier,
		(order: Order) => order.vehicle.model,
		(order: Order) => order.vehicle.brand
	];

	constructor(orders: Order[], syncedOrders: Order[], order: Order, syncedOrder: Order) {
		super(Constants.REAL_TIME_ORDER_TYPE.UPDATE, orders, syncedOrders, order, syncedOrder);
	}

	check(): boolean {
		const updated = this.ORDER_UPDATE_PROPERTIES.find(updateProperty =>
			updateProperty(this.order) !== updateProperty(this.syncedOrder)
		) !== undefined;
		/* Al comprobar si se debe actualizar la OR, también se rellena el array de actualizaciones de presupuestos (al formar estos
		 * parte de la OR). De esta forma, cuando se ejecute el update, se llevarán a cabo todas las acciones pendientes */
		const syncedUpdates = this.handleSyncedBudgets(this.syncedOrder.budgets, this.order.budgets);
		const existentDataUpdates = this.handleExistentData(this.syncedOrder.budgets, this.order.budgets);
		this.realTimeBudgets = syncedUpdates.concat(existentDataUpdates);

		/* Una OR se considera actualizada cuando cambia algún campo, o cuando cambia algún presupuesto */
		return updated || this.realTimeBudgets.length !== 0;
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
		this.order.code = this.syncedOrder.code;
		this.order.sellerCode = this.syncedOrder.sellerCode;
		this.order.mechanicCode = this.syncedOrder.mechanicCode;
		this.order.keys = this.syncedOrder.keys;
		this.order.vehicle.type = this.syncedOrder.vehicle.type;
		this.order.vehicle.identifier = this.syncedOrder.vehicle.identifier;
		this.order.vehicle.model = this.syncedOrder.vehicle.model;
		this.order.vehicle.brand = this.syncedOrder.vehicle.brand;

		this.realTimeBudgets.forEach(realTimeBudget => realTimeBudget.update());
	}

	updateInspectionsLayout(column: InspectionsColumn): void {
		console.log('upading', this.order);
		column.brand = this.order.vehicle.brand;
		column.model = this.order.vehicle.model;
	}

}
