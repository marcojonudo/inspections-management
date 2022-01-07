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
	order: string;
	orderNumber: number;
	brand: string;
	model: string;
	inspectionType: string;
	inspectionState: string;
	mechanic: string;
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
	private realTimeActionsSubscription: Subscription;

	columnsToDisplay: string[];
	rows: InspectionsColumn[];

	constructor(
		private inspectionService: InspectionService,
		private realTimeService: RealTimeService,
		private translate: TranslateService,
		private cdRef: ChangeDetectorRef,
		private snackBarService: SnackBarService
	) {
		this.columnsToDisplay = this.COLUMNS;
		const orderInspections = this.filterInspections();
		const rows = this.buildRows(orderInspections);
		this.rows = InspectionService.sortInspectionsRows(rows);
		this.budgetNotificationsSubscription = this.inspectionService.budgetNotifications$.subscribe(() => {
			/* La lista budgetNotifications ya se ha actualizado en el servicio. Aquí se consume el Observable para poder ejecutar un
			 * ciclo de CD, y refrescar el contenido cuando se actualiza la notificación de cliente */
			this.cdRef.detectChanges();
		});
		this.realTimeActionsSubscription = this.realTimeService.realTimeActions$.subscribe(realTimeActions => {
			if (realTimeActions.length) {
				console.log('Inspections real time updates', realTimeActions);
				let newRows = [];
				this.rows.forEach(column => {
					realTimeActions.forEach(realTimeUpdate => {
						const existent = column.orderNumber === realTimeUpdate.findOrderNumber();
						if (existent) {
							newRows = realTimeUpdate.updateInspectionsLayout(column, this.rows);
						}
					});
				});
				if (newRows.length) {
					this.rows = newRows;
				}
				this.cdRef.detectChanges();
			}
		});
	}

	ngOnDestroy(): void {
		this.budgetNotificationsSubscription.unsubscribe();
		this.realTimeActionsSubscription.unsubscribe();
	}

	filterInspections(orderInspections: OrderInspectionVehicle[] = InspectionService.orderInspections): OrderInspectionVehicle[] {
		return orderInspections.filter(o => o.order.keys && o.order.state !== Constants.ORDER_STATE.V);
	}

	buildRows(orderInspections: OrderInspectionVehicle[], columnsData: any = Constants.INSPECTIONS_COLUMN_DATA): InspectionsColumn[] {
		const rows = [];
		orderInspections.forEach(orderInspection => {
			const row = InspectionService.buildInspectionsRow(orderInspection.order, columnsData);
			if (row) {
				rows.push(row);
			}
		});
		return rows;
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

	checkRecommendedBudget(itemBudgets: ItemBudget[], a, b): boolean {
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
