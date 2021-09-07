import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { OrderInspection } from '../../objects/order-inspection';
import { InspectionService } from '../../services/inspection.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ItemBudget } from '../../objects/item-budget';

export interface Column {
	ORDER: number;
	BRAND: string;
	MODEL: string;
	INSPECTION_TYPE: string;
	INSPECTION_STATE: string;
	BUDGETS: ItemBudget[];
	CLIENT_CONTACT: number;
	ACCEPTED_BUDGET: boolean;
}

@Component({
	selector: 'app-inspections',
	templateUrl: './inspections.component.html',
	styleUrls: ['./inspections.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionsComponent implements OnDestroy {

	private COLUMNS_DATA: any = {
		ORDER: (o: OrderInspection) => o.order.code,
		BRAND: (o: OrderInspection) => o.order.vehicle.brand,
		MODEL: (o: OrderInspection) => o.order.vehicle.model,
		INSPECTION_TYPE: (o: OrderInspection, t: TranslateService) => t.instant(`inspection.type.${ o.inspection.code }`),
		INSPECTION_STATE: (o: OrderInspection, t: TranslateService) => t.instant(`inspection.state.${ o.state }`),
		BUDGETS: (o: OrderInspection) => o.itemBudgets,
		CLIENT_CONTACT: (o: OrderInspection) => 1,
		ACCEPTED_BUDGET: (o: OrderInspection) => 2,
	};

	private orderInspectionsSubscription: Subscription;

	columns: string[];
	data: Column[];

	constructor(
		private inspectionService: InspectionService,
		private translate: TranslateService,
		private cdRef: ChangeDetectorRef
	) {
		this.columns = Object.keys(this.COLUMNS_DATA);
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

	buildData(orderInspections: OrderInspection[], columns: string[] = this.columns, columnsData: any = this.COLUMNS_DATA): Column[] {
		const data = [];
		this.orderInspections.forEach(orderInspection => {
			const row = {};
			columns.forEach(key => {
				row[key] = columnsData[key](orderInspection, this.translate);
			});
			data.push(row);
		});
		return data;
	}

	findColumnName(code: string): string {
		return this.translate.instant(`inspections.table.${ code }`);
	}

	checkRecommendedBudget(itemBudgets: ItemBudget[]): boolean {
		return itemBudgets.length > 0;
	}

	findBudgetState(orderCode: string, itemBudgets: ItemBudget[]): string {
		return InspectionService.findBudgetState(orderCode, itemBudgets);
	}

	checkNotifiedClient(shortCode: string): boolean {
		const order = InspectionService.findOrder(shortCode);
		return InspectionService.findBudgetNotification(order.number) !== undefined;
	}

	checkAcceptedBudget(shortCode: string): boolean {
		const order = InspectionService.findOrder(shortCode);
		const budgetNotification = InspectionService.findBudgetNotification(order.number);
		return budgetNotification && budgetNotification.accepted;
	}

	updateNotifiedClient(shortCode: string, notified: boolean): void {
		const order = InspectionService.findOrder(shortCode);
		this.inspectionService.updateNotifiedClient(order.number, notified).subscribe();
	}

	updateAcceptedBudget(shortCode: string, accepted: boolean): void {
		const order = InspectionService.findOrder(shortCode);
		const budgetNotification = InspectionService.findBudgetNotification(order.number);
		this.inspectionService.updateAcceptedBudget(budgetNotification, accepted).subscribe();
	}

}
