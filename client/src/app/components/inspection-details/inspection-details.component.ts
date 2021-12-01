import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { InspectionService } from '../../services/inspection.service';
import { Subscription } from 'rxjs';
import { Column } from '../inspections/inspections.component';
import { ItemBudget } from '../../objects/item-budget';
import { TranslateService } from '@ngx-translate/core';
import { Budget } from '../../objects/orders/budget';
import { Employee } from '../../objects/employee';
import { EmployeeService } from '../../services/employee.service';
import { OrderInspectionVehicle } from '../../objects/order-inspection-vehicle';
import { SavedInspection } from '../../objects/inspections/saved-inspection';
import { SavedItem } from '../../objects/inspections/saved-items/saved-item';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '../../utils/constants';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeDialogComponent } from '../employee-dialog/employee-dialog.component';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';

@Component({
	selector: 'app-inspection-details',
	templateUrl: './inspection-details.component.html',
	styleUrls: ['./inspection-details.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionDetailsComponent {

	private COLUMNS: string[] = ['item', 'image', 'doneBudget', 'acceptedBudget', 'clientContact', 'inspectionButton'];

	private COLUMNS_DATA: any = {
		item: (i: ItemBudget) => i,
		image: (i: ItemBudget, savedItem: SavedItem) => savedItem.image,
		budget: (i: ItemBudget, savedItem: SavedItem, budget: Budget) => budget
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
		private cdRef: ChangeDetectorRef,
		private router: Router,
		private route: ActivatedRoute,
		private dialog: MatDialog
	) {
		this.columnsToDisplay = this.COLUMNS;
		this.mechanics = [];
		this.selectedOrderSubscription = this.inspectionService.selectedOrderInspection$.subscribe(orderInspection => {
			this.orderInspection = orderInspection;
			this.savedInspection = InspectionService.findSavedInspection(this.orderInspection.order.number);
			console.log('Selected order inspection', this.orderInspection);
			console.log('Selected saved inspection', this.savedInspection);
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
				const savedItem = savedInspection.items.find(i => i.item.code === itemBudget.itemCode);
				const budget = InspectionService.findBudget(itemBudget.itemCode, orderInspection.order.budgets);
				allColumns.forEach(key => {
					row[key] = columnsData[key](itemBudget, savedItem, budget);
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

	findItemBudgetType(itemBudget: ItemBudget, orderInspection: OrderInspectionVehicle = this.orderInspection): string {
		return InspectionService.findItemBudgetType(itemBudget, orderInspection.inspection.vehicle, orderInspection.order.budgets);
	}

	checkNotifiedClient(orderNumber: number = this.orderInspection.order.number): boolean {
		return InspectionService.findBudgetNotifications(orderNumber).length > 0;
	}

	checkExistentBudget(itemBudget: ItemBudget, budget: Budget, orderInspection: OrderInspectionVehicle = this.orderInspection): boolean {
		return InspectionService.findExistentBudget(itemBudget.itemCode, orderInspection.inspection.vehicle, [budget]) !== undefined;
	}

	checkAcceptedBudget(budget: Budget): boolean {
		return InspectionService.checkAcceptedBudget(budget);
	}

	openImage(imageId: number): void {
		this.dialog.open(ImageDialogComponent, { data: { imageId } });
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

	openInspection(): void {
		const dialogRef = this.dialog.open(EmployeeDialogComponent);
		dialogRef.afterClosed().subscribe((employeeCode: string) => {
			if (employeeCode) {
				EmployeeService.setEmployee(employeeCode);
				this.router.navigate([`${Constants.PATH.HOME}${Constants.PATH.INSPECTION}`]);
			}
		});
	}

}
