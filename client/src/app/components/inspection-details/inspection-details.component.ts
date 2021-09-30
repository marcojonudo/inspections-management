import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { InspectionService } from '../../services/inspection.service';
import { OrderInspection } from '../../objects/order-inspection';
import { Subscription } from 'rxjs';
import { Order } from '../../objects/orders/order';
import { Column } from '../inspections/inspections.component';
import { ItemBudget } from '../../objects/item-budget';
import { TranslateService } from '@ngx-translate/core';
import { Budget } from '../../objects/orders/budget';
import { Employee } from '../../objects/employee';
import { EmployeeService } from '../../services/employee.service';

@Component({
	selector: 'app-inspection-details',
	templateUrl: './inspection-details.component.html',
	styleUrls: ['./inspection-details.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionDetailsComponent {

	private COLUMNS: string[] = ['item', 'doneBudget', 'acceptedBudget'];

	private COLUMNS_DATA: any = {
		item: (i: ItemBudget) => i,
		orderNumber: (i: ItemBudget, o: Order) => o.number
	};

	private selectedOrderSubscription: Subscription;

	columnsToDisplay: string[];
	orderInspection: OrderInspection;
	mechanics: Employee[];
	data: any;

	constructor(
		private inspectionService: InspectionService,
		private translate: TranslateService,
		private cdRef: ChangeDetectorRef
	) {
		this.columnsToDisplay = this.COLUMNS;
		this.mechanics = [];
		this.selectedOrderSubscription = this.inspectionService.selectedOrderInspection$.subscribe(orderInspection => {
			this.orderInspection = orderInspection;
			this.data = this.buildData();
			this.mechanics = this.orderInspection.savedInspection.items.map(i => i.employeeCode).filter(
				(value, index, self) => self.indexOf(value) === index
			).map(employeeCode => EmployeeService.findEmployee(employeeCode));
			this.cdRef.detectChanges();
		});
	}

	buildData(orderInspection: OrderInspection = this.orderInspection, columnsData: any = this.COLUMNS_DATA): Column[] {
		const data = [];
		const allColumns = Object.keys(columnsData);
		orderInspection.itemBudgets.forEach(itemBudget => {
			const row = {};
			allColumns.forEach(key => {
				row[key] = columnsData[key](itemBudget, orderInspection.order);
			});
			data.push(row);
		});
		return data;
	}

	findColumnName(code: string): string {
		return this.translate.instant(`inspections.table.${code}`);
	}

	findItemName(code: string): string {
		return this.translate.instant(`inspection.item.${code}`);
	}

	findItemBudgetType(itemBudget: ItemBudget, budgets: Budget[] = this.orderInspection.order.budgets): string {
		return InspectionService.findItemBudgetType(itemBudget, budgets);
	}

	checkNotifiedClient(orderNumber: number = this.orderInspection.order.number): boolean {
		return InspectionService.findBudgetNotifications(orderNumber).length > 0;
	}

	checkAcceptedBudget(orderNumber: number, itemCode: string): boolean {
		const budgetNotification = InspectionService.findBudgetNotification(orderNumber, itemCode);
		return budgetNotification && budgetNotification.accepted;
	}

	updateNotifiedClient(notified: boolean, orderInspection: OrderInspection = this.orderInspection): void {
		let observable;
		if (notified) {
			const itemCodes = orderInspection.itemBudgets.map(i => i.itemCode);
			observable = this.inspectionService.createBudgetNotification(orderInspection.order.number, itemCodes);
		} else {
			observable = this.inspectionService.deleteBudgetNotification(orderInspection.order.number);
		}
		observable.subscribe(() => this.cdRef.detectChanges());
	}

	updateAcceptedBudget(orderNumber: number, itemCode: string, accepted: boolean): void {
		const budgetNotification = InspectionService.findBudgetNotification(orderNumber, itemCode);
		this.inspectionService.updateAcceptedBudget(budgetNotification, accepted).subscribe();
	}

}
