import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { InspectionService } from '../../services/inspection.service';
import { Subscription } from 'rxjs';
import { ItemBudget } from '../../objects/item-budget';
import { TranslateService } from '@ngx-translate/core';
import { Budget } from '../../objects/orders/budget';
import { Employee } from '../../objects/employee';
import { EmployeeService } from '../../services/employee.service';
import { OrderInspectionVehicle } from '../../objects/order-inspection-vehicle';
import { SavedInspection } from '../../objects/inspections/saved-inspection';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '../../utils/constants';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeDialogComponent } from '../employee-dialog/employee-dialog.component';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { Image } from '../../objects/inspections/image';
import { RealTimeService } from '../../services/real-time.service';
import { RealTimeOrder } from '../../objects/real-time/update/orders/real-time-order';

export interface InspectionDetailsColumn {
	item: ItemBudget;
	image: Image;
	budget: Budget;
}

@Component({
	selector: 'app-inspection-details',
	templateUrl: './inspection-details.component.html',
	styleUrls: ['./inspection-details.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionDetailsComponent implements OnDestroy {

	private COLUMNS: string[] = ['item', 'image', 'seller', 'doneBudget', 'acceptedBudget', 'clientContact', 'inspectionButton'];

	private selectedOrderSubscription: Subscription;
	private realTimeActionsSubscription: Subscription;

	columnsToDisplay: string[];
	orderInspection: OrderInspectionVehicle;
	savedInspection: SavedInspection;
	mechanics: Employee[];
	data: InspectionDetailsColumn[];

	constructor(
		private inspectionService: InspectionService,
		private realTimeService: RealTimeService,
		private translate: TranslateService,
		private cdRef: ChangeDetectorRef,
		private router: Router,
		private route: ActivatedRoute,
		private dialog: MatDialog
	) {
		this.columnsToDisplay = this.COLUMNS;
		this.mechanics = [];
		this.data = [];
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

		this.realTimeActionsSubscription = this.realTimeService.realTimeActions$.subscribe(realTimeActions => {
			if (realTimeActions.length && this.orderInspection) {
				console.log('real time actions', realTimeActions);
				const selectedOrderUpdate = realTimeActions.find(update => update.findOrderNumber() === this.orderInspection.order.number);
				if (selectedOrderUpdate) {
					const newRows = selectedOrderUpdate.updateDetailsLayout(this.data);
					if (newRows.length) {
						this.data = newRows;
					}
					console.log('details data', this.data);
					this.cdRef.detectChanges();
				}
			}
		});
	}

	ngOnDestroy(): void {
		this.selectedOrderSubscription.unsubscribe();
		this.realTimeActionsSubscription.unsubscribe();
	}

	buildData(
		orderInspection: OrderInspectionVehicle,
		savedInspection: SavedInspection,
		columnsData: any = Constants.INSPECTION_DETAILS_COLUMN_DATA
	): InspectionDetailsColumn[] {
		const data = [];
		if (savedInspection) {
			savedInspection.itemBudgets.forEach(itemBudget => {
				const row = InspectionService.buildInspectionDetailsRow(itemBudget, orderInspection, savedInspection.items, columnsData);
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

	findEmployee(code: string): Employee {
		return EmployeeService.findEmployee(code);
	}

	checkNotifiedClient(orderInspection: OrderInspectionVehicle = this.orderInspection): boolean {
		return orderInspection ? InspectionService.findBudgetNotifications(orderInspection.order.number).length > 0 : false;
	}

	checkExistentBudget(itemBudget: ItemBudget, orderInspection: OrderInspectionVehicle = this.orderInspection): boolean {
		return InspectionService.findExistentBudget(
			itemBudget.itemCode, orderInspection.inspection.vehicle, orderInspection.order.budgets
		) !== undefined;
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
		console.log('dialog ref', dialogRef);
		dialogRef.afterClosed().subscribe((employeeCode: string) => {
			console.log('CLOSED!!!!');
			if (employeeCode) {
				EmployeeService.setEmployee(employeeCode);
				this.router.navigate([`${Constants.PATH.HOME}${Constants.PATH.INSPECTION}`]);
			}
		});
	}

}
