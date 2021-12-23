import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { InspectionService } from '../../services/inspection.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ItemBudget } from '../../objects/item-budget';
import { OrderInspectionVehicle } from '../../objects/order-inspection-vehicle';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../objects/employee';
import { Constants } from '../../utils/constants';
import { SnackBarService } from '../../services/snack-bar.service';
import { RealTimeService } from '../../services/real-time.service';
import { RealTimeOrder } from '../../objects/real-time/update/orders/real-time-order';

export interface InspectionsColumn {
	order: number;
	orderNumber: number;
	brand: string;
	model: string;
	inspectionType: string;
	inspectionState: string;
	budgets: ItemBudget[];
	clientContact: number;
	acceptedBudget: boolean;
}

@Component({
	selector: 'app-inspections',
	templateUrl: './inspections.component.html',
	styleUrls: ['./inspections.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionsComponent implements OnDestroy {

	private readonly INSPECTION_NAME = 'Revisión';

	private COLUMNS: string[] = [
		'order', 'brand', 'model', 'inspectionType', 'inspectionState', 'mechanic', 'budgets', 'clientContact'
	];

	private budgetNotificationsSubscription: Subscription;
	private realTimeOrdersSubscription: Subscription;

	columnsToDisplay: string[];
	data: InspectionsColumn[];

	constructor(
		private inspectionService: InspectionService,
		private realTimeService: RealTimeService,
		private translate: TranslateService,
		private cdRef: ChangeDetectorRef,
		private snackBarService: SnackBarService
	) {
		this.columnsToDisplay = this.COLUMNS;
		const orderInspections = this.findOrderInspections();
		this.data = this.buildData(orderInspections);
		this.budgetNotificationsSubscription = this.inspectionService.budgetNotifications$.subscribe(() => {
			/* La lista budgetNotifications ya se ha actualizado en el servicio. Aquí se consume el Observable para poder ejecutar un
			 * ciclo de CD, y refrescar el contenido cuando se actualiza la notificación de cliente */
			this.cdRef.detectChanges();
		});
		this.realTimeOrdersSubscription = this.realTimeService.realTimeOrders$.subscribe(realTimeOrders => {
			if (realTimeOrders.length) {
				console.log('Real time updates', realTimeOrders);
				this.data.forEach(column => {
					realTimeOrders.forEach(realTimeUpdate => {
						const existent = column.orderNumber === realTimeUpdate.order.number;
						if (existent) {
							realTimeUpdate.updateInspectionsLayout(column, this.data);
						}
					});
				});
				this.cdRef.detectChanges();
			}
		});
	}

	ngOnDestroy(): void {
		this.budgetNotificationsSubscription.unsubscribe();
		this.realTimeOrdersSubscription.unsubscribe();
	}

	findOrderInspections(orderInspections: OrderInspectionVehicle[] = InspectionService.orderInspections): OrderInspectionVehicle[] {
		return this.filterInspections(orderInspections).sort((a, b) => {
			let aType = this.findOrderItemBudgetType(a.order.number, false);
			let bType = this.findOrderItemBudgetType(b.order.number, false);
			if (!aType && !bType) {
				aType = this.findOrderItemBudgetType(a.order.number, true);
				bType = this.findOrderItemBudgetType(b.order.number, true);
				if (!aType && !bType) {
					const aState = InspectionService.findSavedInspection(a.order.number)?.state;
					const bState = InspectionService.findSavedInspection(b.order.number)?.state;
					if (aState && bState) {
						const aStateOrder = this.findOrder(aState, Constants.INSPECTION_STATE_ORDER);
						const bStateOrder = this.findOrder(bState, Constants.INSPECTION_STATE_ORDER);
						return aStateOrder < bStateOrder ? -1 : (aStateOrder > bStateOrder ? 1 : 0);
					} else if (aState) {
						return -1;
					} else if (bState) {
						return 1;
					} else {
						const aCodeNumber = this.findCodeNumber(a.order.code);
						const bCodeNumber = this.findCodeNumber(b.order.code);
						return aCodeNumber < bCodeNumber ? -1 : (aCodeNumber > bCodeNumber ? 1 : 0);
					}
				}
			}
			const aOrder = this.findOrder(aType, Constants.BUDGET_TYPE_ORDER);
			const bOrder = this.findOrder(bType, Constants.BUDGET_TYPE_ORDER);
			return aOrder < bOrder ? -1 : (aOrder > bOrder ? 1 : 0);
		});
	}

	findOrder(type: string, orderMap: any): number {
		return orderMap[type] !== undefined ? orderMap[type] : 10;
	}

	findCodeNumber(orderCode: string): number {
		return parseInt(orderCode.startsWith('C') ? orderCode.substring(1) : orderCode, 10);
	}

	filterInspections(orderInspections: OrderInspectionVehicle[]): OrderInspectionVehicle[] {
		return orderInspections.filter(o => o.order.keys && o.order.state !== Constants.ORDER_STATE.V);
	}

	buildData(orderInspections: OrderInspectionVehicle[], columnsData: any = Constants.INSPECTIONS_COLUMN_DATA): InspectionsColumn[] {
		const data = [];
		orderInspections.forEach(orderInspection => {
			const row = InspectionService.buildInspectionsRow(orderInspection.order, columnsData);
			if (row) {
				data.push(row);
			}
		});
		return data;
	}

	findColumnName(code: string): string {
		return this.translate.instant(`inspections.table.${code}`);
	}

	findInspectionTypeName(code: string): string {
		const inspectionType = this.translate.instant(`inspection.type.${code}`);
		/* Si el tipo es distinto a 'Anomalías detectadas', se elimina la palabra 'Revisión' por ser redundante */
		return inspectionType.startsWith(this.INSPECTION_NAME) ? inspectionType.substring(this.INSPECTION_NAME.length + 1) : inspectionType;
	}

	findInspectionStateName(state: string): string {
		return this.translate.instant(`inspection.state.${state}`);
	}

	checkRecommendedBudget(itemBudgets: ItemBudget[]): boolean {
		return itemBudgets.length > 0;
	}

	findOrderItemBudgetType(orderNumber: number, accepted: boolean = undefined): string {
		return InspectionService.findOrderItemBudgetType(orderNumber, accepted);
	}

	checkNotifiedClient(orderNumber: number): boolean {
		return InspectionService.findBudgetNotifications(orderNumber).length > 0;
	}

	checkSelectedOrder(orderNumber: number): boolean {
		return this.inspectionService.checkSelectedOrder(orderNumber);
	}

	selectOrder(orderNumber: number): void {
		const existentSavedInspection = this.inspectionService.selectOrder(orderNumber);
		if (!existentSavedInspection) {
			this.snackBarService.open(Constants.MESSAGE_CODE.ORDER_WITHOUT_SAVED_INSPECTION, Constants.SNACK_BAR.TYPE.WARNING);
		}
	}

	findMechanic(code: string): Employee {
		return EmployeeService.findEmployee(code);
	}

}
