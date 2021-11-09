import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { OrdersFilter } from '../../objects/filters/orders-filter';
import { PendingOrdersFilter } from '../../objects/filters/pending-orders-filter';
import { TodayOrdersFilter } from '../../objects/filters/today-orders-filter';
import { InspectionService } from '../../services/inspection.service';
import { OrderInspectionVehicle } from '../../objects/order-inspection-vehicle';
import { Subscription } from 'rxjs';
import { Constants } from '../../utils/constants';
import { ItemBudget } from '../../objects/item-budget';
import { Budget } from '../../objects/orders/budget';

@Component({
	selector: 'app-summary',
	templateUrl: './summary.component.html',
	styleUrls: ['./summary.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryComponent implements OnDestroy {

	private budgetNotificationsSubscription: Subscription;

	filters: OrdersFilter[];
	todayFilter: OrdersFilter[];
	pendingFilter: OrdersFilter[];
	allFilters: OrdersFilter[];

	constructor(private inspectionService: InspectionService, private cdRef: ChangeDetectorRef) {
		this.todayFilter = [new TodayOrdersFilter()];
		this.pendingFilter = [new PendingOrdersFilter()];
		this.allFilters = this.todayFilter.concat(this.pendingFilter);

		this.filters = this.todayFilter;

		this.budgetNotificationsSubscription = this.inspectionService.budgetNotifications$.subscribe(() => {
			this.cdRef.detectChanges();
		});
	}

	ngOnDestroy(): void {
		this.budgetNotificationsSubscription.unsubscribe();
	}

	get urgentType(): string {
		return Constants.BUDGET_TYPE.URGENT;
	}

	get secondaryType(): string {
		return Constants.BUDGET_TYPE.SECONDARY;
	}

	get orderInspections(): OrderInspectionVehicle[] {
		return InspectionService.orderInspections;
	}

	findAllItemBudgetLength(budgetType: string = undefined): number {
		return InspectionService.findAllItemBudgets(budgetType).length;
	}

	findPendingClientContacts(): number {
		return InspectionService.findPendingClientContactOrders().length;
	}

	findBudgetsPrice(): number {
		return InspectionService.findBudgetsPrice();
	}

	findDoneBudgets(): ItemBudget[] {
		const doneBudgets = [];
		InspectionService.orderInspections.forEach(orderInspection => {
			const savedInspection = InspectionService.findSavedInspection(orderInspection.order.number);
			const doneOrderBudgets = (savedInspection ? savedInspection.itemBudgets : []).filter(itemBudget =>
				InspectionService.checkExistentBudget(itemBudget.itemCode, orderInspection.order.budgets)
			);
			doneBudgets.push(...doneOrderBudgets);
		});
		return doneBudgets;
	}

	findAllBudgets(): Budget[] {
		return InspectionService.findAllBudgets();
	}

	findAcceptedBudgets(): Budget[] {
		return this.findAllBudgets().filter(b => InspectionService.checkAcceptedBudget(b));
	}

	findClosedOrders(): number {
		return this.orderInspections.filter(orderInspection => {
			const savedInspection = InspectionService.findSavedInspection(orderInspection.order.number);
			return orderInspection.order.state === Constants.ORDER_STATE.F && savedInspection.state !== Constants.INSPECTION_STATE.FINISHED;
		}).length;
	}

	findFinishedInspections(): number {
		return this.orderInspections.filter(orderInspection => {
			const savedInspection = InspectionService.findSavedInspection(orderInspection.order.number);
			return savedInspection?.state === Constants.INSPECTION_STATE.FINISHED;
		}).length;
	}

	findWrongItemsPercentage(): number {
		const savedInspections = [];
		this.orderInspections.forEach(o => {
			const savedInspection = InspectionService.findSavedInspection(o.order.number);
			if (savedInspection) {
				savedInspections.push(savedInspection);
			}
		});
		const totalItems = [].concat(...savedInspections.map(s => s.items.filter(i => i.item.type === Constants.ITEM_TYPE.SELECT)));
		const wrongItems = totalItems.filter(i => i.filled && i.findValue() !== Constants.SELECT_ITEM_OPTION_CODE.C);
		return wrongItems.length / totalItems.length;
	}

}
