import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { InspectionService } from '../../services/inspection.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ItemBudget } from '../../objects/item-budget';
import { OrderInspectionVehicle } from '../../objects/order-inspection-vehicle';
import { Order } from '../../objects/orders/order';
import { SavedInspection } from '../../objects/inspections/saved-inspection';
import { Constants } from '../../objects/constants';
import { SavedItem } from '../../objects/inspections/saved-items/saved-item';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../objects/employee';

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

	private COLUMNS: string[] = [
		'order', 'brand', 'model', 'inspectionType', 'inspectionState', 'mechanic', 'budgets', 'clientContact', 'acceptedBudget'
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
		private cdRef: ChangeDetectorRef
	) {
		this.columnsToDisplay = this.COLUMNS;
		this.data = this.buildData(InspectionService.orderInspections);
		this.budgetNotificationsSubscription = this.inspectionService.budgetNotifications$.subscribe(() => {
			/* La lista budgetNotifications ya se ha actualizado en el servicio. Aquí se consume el Observable para poder ejecutar un
			 * ciclo de CD, y refrescar el contenido cuando se actualiza la notificación de cliente */
			this.cdRef.detectChanges();
		});
	}

	ngOnDestroy(): void {
		this.budgetNotificationsSubscription.unsubscribe();
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
		return this.translate.instant(`inspection.type.${code}`);
	}

	findInspectionStateName(state: string): string {
		return this.translate.instant(`inspection.state.${state}`);
	}

	checkRecommendedBudget(itemBudgets: ItemBudget[]): boolean {
		return itemBudgets.length > 0;
	}

	findOrderItemBudgetType(orderNumber: number): string {
		return InspectionService.findOrderItemBudgetType(orderNumber);
	}

	checkNotifiedClient(orderNumber: number): boolean {
		return InspectionService.findBudgetNotifications(orderNumber).length > 0;
	}

	checkAcceptedBudgets(orderNumber: number): boolean {
		const budgetNotifications = InspectionService.findBudgetNotifications(orderNumber);
		return budgetNotifications.find(budgetNotification => !budgetNotification.accepted) === undefined;
	}

	checkSelectedOrder(orderNumber: number): boolean {
		return this.inspectionService.checkSelectedOrder(orderNumber);
	}

	selectOrder(orderNumber: number): void {
		this.inspectionService.selectOrder(orderNumber);
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
