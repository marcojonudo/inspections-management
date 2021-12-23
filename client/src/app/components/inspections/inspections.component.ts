import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { InspectionService } from '../../services/inspection.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ItemBudget } from '../../objects/item-budget';
import { OrderInspectionVehicle } from '../../objects/order-inspection-vehicle';
import { Order } from '../../objects/orders/order';
import { SavedInspection } from '../../objects/inspections/saved-inspection';
import { SavedItem } from '../../objects/inspections/saved-items/saved-item';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../objects/employee';
import { Constants } from '../../utils/constants';
import { SnackBarService } from '../../services/snack-bar.service';

export interface Column {
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

	private COLUMNS_DATA: any = {
		order: (o: Order) => o.code,
		orderNumber: (o: Order) => o.number,
		brand: (o: Order) => o.vehicle.brand,
		model: (o: Order) => o.vehicle.model,
		inspectionType: (o: Order, inspection: OrderInspectionVehicle) =>
			inspection.inspection?.inspectionType?.code || Constants.DETECTED_ANOMALIES_CODE,
		inspectionState: (o: Order, inspection: OrderInspectionVehicle, savedInspection: SavedInspection) =>
			savedInspection ? savedInspection.state : Constants.INSPECTION_STATE.PENDING,
		mechanic: (o: Order, inspection: OrderInspectionVehicle, savedInspection: SavedInspection) =>
			this.findMechanicCode(o, savedInspection),
		budgets: (o: Order, inspection: OrderInspectionVehicle, savedInspection: SavedInspection) =>
			savedInspection ? savedInspection.itemBudgets : []
	};

	private budgetNotificationsSubscription: Subscription;

	columnsToDisplay: string[];
	data: Column[];

	constructor(
		private inspectionService: InspectionService,
		private translate: TranslateService,
		private cdRef: ChangeDetectorRef,
		private snackBarService: SnackBarService
	) {
		this.columnsToDisplay = this.COLUMNS;
		const orderInspections = this.filterInspections(InspectionService.orderInspections).sort((a, b) => {
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
		this.data = this.buildData(orderInspections);
		this.budgetNotificationsSubscription = this.inspectionService.budgetNotifications$.subscribe(() => {
			/* La lista budgetNotifications ya se ha actualizado en el servicio. Aquí se consume el Observable para poder ejecutar un
			 * ciclo de CD, y refrescar el contenido cuando se actualiza la notificación de cliente */
			this.cdRef.detectChanges();
		});
	}

	ngOnDestroy(): void {
		this.budgetNotificationsSubscription.unsubscribe();
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

	buildData(orderInspections: OrderInspectionVehicle[], columnsData: any = this.COLUMNS_DATA): Column[] {
		const data = [];
		const allColumns = Object.keys(columnsData);
		orderInspections.forEach(orderInspection => {
			const inspection = InspectionService.findOrderInspection(orderInspection.order.number);
			/* Se obtienen únicamente aquellas OR que tengan revisión */
			if (inspection) {
				const savedInspection = InspectionService.findSavedInspection(orderInspection.order.number);
				const row = {};
				allColumns.forEach(key => {
					const handler = columnsData[key];
					if (handler) {
						row[key] = handler(orderInspection.order, inspection, savedInspection);
					}
				});
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

	findMechanicCode(order: Order, savedInspection: SavedInspection): string {
		let mechanicCode;
		if (savedInspection) {
			mechanicCode = savedInspection.employeeCode || this.findItemsMechanicCode(savedInspection.items);
		}
		return mechanicCode ? mechanicCode : order.mechanicCode;
	}

	findMechanic(code: string): Employee {
		return EmployeeService.findEmployee(code);
	}

	findItemsMechanicCode(items: SavedItem[]): string {
		const maxFilled = Math.max(...items.map(i => i.filled.valueOf()));
		const maxFilledItem = items.find(i => i.filled.valueOf() === maxFilled);
		return maxFilledItem.employeeCode;
	}

}
