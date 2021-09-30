import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OrdersFilter } from '../../objects/filters/orders-filter';
import { PendingOrdersFilter } from '../../objects/filters/pending-orders-filter';
import { TodayOrdersFilter } from '../../objects/filters/today-orders-filter';
import { InspectionService } from '../../services/inspection.service';
import { Constants } from '../../objects/constants';
import { OrderInspection } from '../../objects/order-inspection';

@Component({
	selector: 'app-summary',
	templateUrl: './summary.component.html',
	styleUrls: ['./summary.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryComponent {

	filters: OrdersFilter[];
	todayFilter: OrdersFilter[];
	pendingFilter: OrdersFilter[];
	allFilters: OrdersFilter[];

	constructor(private inspectionService: InspectionService) {
		this.todayFilter = [new TodayOrdersFilter()];
		this.pendingFilter = [new PendingOrdersFilter()];
		this.allFilters = this.todayFilter.concat(this.pendingFilter);

		this.filters = this.todayFilter;
	}

	get urgentType(): string {
		return Constants.BUDGET_TYPE.URGENT;
	}

	get secondaryType(): string {
		return Constants.BUDGET_TYPE.SECONDARY;
	}

	get orderInspections(): OrderInspection[] {
		return InspectionService.orderInspections;
	}

	filterOrders(filters: OrdersFilter[]): void {
		this.inspectionService.loadMainInfo(filters).subscribe();
	}

	findAllItemBudgetLength(budgetType: string): number {
		return InspectionService.findAllItemBudgets(budgetType).length;
	}

	findPendingClientContacts(): number {
		return InspectionService.findPendingClientContactOrders().length;
	}

	findBudgetsPrice(): number {
		return InspectionService.findBudgetsPrice();
	}

	findAllBudgets(): number {
		return InspectionService.findAllBudgetNotifications().length;
	}

	findAcceptedBudgets(): number {
		const allBudgetNotifications = InspectionService.findAllBudgetNotifications();
		return allBudgetNotifications.filter(b => b.accepted).length;
	}

	findAcceptedPercentage(): number {
		const allBudgetNotifications = InspectionService.findAllBudgetNotifications();
		const acceptedBudgetNotifications = allBudgetNotifications.filter(b => b.accepted);
		return acceptedBudgetNotifications.length / allBudgetNotifications.length;
	}

	findClosedOrders(): number {
		return InspectionService.orderInspections.filter(orderInspection =>
			orderInspection.order.state === Constants.ORDER_STATE.F && orderInspection.state !== Constants.INSPECTION_STATE.FINISHED
		).length;
	}

	findFinishedInspections(): number {
		return InspectionService.orderInspections.filter(orderInspection =>
			orderInspection.state === Constants.INSPECTION_STATE.FINISHED
		).length;
	}

	findWrongItemsPercentage(): number {
		const savedInspections = this.orderInspections.filter(o => o.savedInspection).map(o => o.savedInspection);
		const totalItems = [].concat(...savedInspections.map(s => s.items.filter(i => i.item.type === Constants.ITEM_TYPE.SELECT)));
		const wrongItems = totalItems.filter(i => i.filled && i.findValue() !== Constants.SELECT_ITEM_OPTION_CODE.C);
		return wrongItems.length / totalItems.length;
	}

}
