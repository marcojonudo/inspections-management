import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { OrderInspection } from '../../objects/order-inspection';
import { InspectionService } from '../../services/inspection.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ItemBudget } from '../../objects/item-budget';

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
		'order', 'brand', 'model', 'inspectionType', 'inspectionState', 'budgets', 'clientContact', 'acceptedBudget'
	];

	private COLUMNS_DATA: any = {
		order: (o: OrderInspection) => o.order.code,
		orderNumber: (o: OrderInspection) => o.order.number,
		brand: (o: OrderInspection) => o.order.vehicle.brand,
		model: (o: OrderInspection) => o.order.vehicle.model,
		inspectionType: (o: OrderInspection) => o.inspection.code,
		inspectionState: (o: OrderInspection) => o.state,
		budgets: (o: OrderInspection) => o.itemBudgets
	};

	private orderInspectionsSubscription: Subscription;

	columnsToDisplay: string[];
	data: Column[];

	constructor(
		private inspectionService: InspectionService,
		private translate: TranslateService,
		private cdRef: ChangeDetectorRef
	) {
		this.columnsToDisplay = this.COLUMNS;
		this.orderInspectionsSubscription = this.inspectionService.orderInspections$.subscribe(orderInspections => {
			this.data = this.buildData(orderInspections);
			this.cdRef.detectChanges();
		});
	}

	ngOnDestroy(): void {
		this.orderInspectionsSubscription.unsubscribe();
	}

	get orderInspections(): OrderInspection[] {
		return InspectionService.orderInspections;
	}

	buildData(orderInspections: OrderInspection[], columnsData: any = this.COLUMNS_DATA): Column[] {
		const data = [];
		const allColumns = Object.keys(columnsData);
		this.orderInspections.forEach(orderInspection => {
			const row = {};
			allColumns.forEach(key => {
				const handler = columnsData[key];
				if (handler) {
					row[key] = handler(orderInspection, this.translate);
				}
			});
			data.push(row);
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

	findBudgetState(orderNumber: number, itemBudgets: ItemBudget[]): string {
		return InspectionService.findBudgetState(orderNumber, itemBudgets);
	}

	checkNotifiedClient(orderNumber: number): boolean {
		return InspectionService.findBudgetNotification(orderNumber) !== undefined;
	}

	checkAcceptedBudget(orderNumber: number): boolean {
		const budgetNotification = InspectionService.findBudgetNotification(orderNumber);
		return budgetNotification && budgetNotification.accepted;
	}

	selectOrder(orderNumber: number): void {
		this.inspectionService.selectOrder(orderNumber);
	}

}
