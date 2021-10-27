import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { InspectionService } from '../../services/inspection.service';
import { Subscription } from 'rxjs';
import { Order } from '../../objects/orders/order';
import { Column } from '../inspections/inspections.component';
import { ItemBudget } from '../../objects/item-budget';
import { TranslateService } from '@ngx-translate/core';
import { Budget } from '../../objects/orders/budget';
import { Employee } from '../../objects/employee';
import { EmployeeService } from '../../services/employee.service';
import { OrderInspectionVehicle } from '../../objects/order-inspection-vehicle';
import { SavedInspection } from '../../objects/inspections/saved-inspection';
import { SavedItem } from '../../objects/inspections/saved-items/saved-item';

@Component({
	selector: 'app-inspection-details',
	templateUrl: './inspection-details.component.html',
	styleUrls: ['./inspection-details.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionDetailsComponent {

	private COLUMNS: string[] = ['item', 'image', 'doneBudget', 'clientContact', 'acceptedBudget'];

	private COLUMNS_DATA: any = {
		item: (i: ItemBudget) => i,
		image: (i: ItemBudget, savedItem: SavedItem) => savedItem.image,
		orderNumber: (i: ItemBudget, savedItem: SavedItem, o: Order) => o.number
	};

	private selectedOrderSubscription: Subscription;

	columnsToDisplay: string[];
	orderInspection: OrderInspectionVehicle;
	savedInspection: SavedInspection;
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
			this.savedInspection = InspectionService.findSavedInspection(this.orderInspection.order.number);
			this.data = this.buildData(this.orderInspection, this.savedInspection);
			this.mechanics = this.savedInspection ? this.savedInspection.items.map(i => i.employeeCode).filter(
				(value, index, self) => self.indexOf(value) === index
			).map(employeeCode => EmployeeService.findEmployee(employeeCode)) : [];
			this.cdRef.detectChanges();
		});
	}

	buildData(orderInspection: OrderInspectionVehicle, savedInspection: SavedInspection, columnsData: any = this.COLUMNS_DATA): Column[] {
		const data = [];
		const allColumns = Object.keys(columnsData);
		if (savedInspection) {
			savedInspection.itemBudgets.forEach(itemBudget => {
				const row = {};
				allColumns.forEach(key => {
					const savedItem = savedInspection.items.find(i => i.item.code === itemBudget.itemCode);
					row[key] = columnsData[key](itemBudget, savedItem, orderInspection.order);
				});
				data.push(row);
			});
		}
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
		return budgetNotification && budgetNotification.accepted !== undefined;
	}

	openImage(a): void {
		console.log(a);
	}

	updateNotifiedClient(
		notified: boolean,
		orderInspection: OrderInspectionVehicle = this.orderInspection,
		savedInspection: SavedInspection = this.savedInspection
	): void {
		let observable;
		if (notified) {
			const itemCodes = savedInspection.itemBudgets.map(i => i.itemCode);
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
