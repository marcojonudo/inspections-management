import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { OrdersFilter } from '../../objects/filters/orders-filter';
import { PendingOrdersFilter } from '../../objects/filters/pending-orders-filter';
import { TodayOrdersFilter } from '../../objects/filters/today-orders-filter';
import { InspectionService } from '../../services/inspection.service';
import { OrderInspection } from '../../objects/order-inspection';
import { Subscription } from 'rxjs';
import { Constants } from '../../utils/constants';
import { ItemBudget } from '../../objects/item-budget';
import { RealTimeService } from '../../services/real-time.service';

@Component({
	selector: 'app-summary',
	templateUrl: './summary.component.html',
	styleUrls: ['./summary.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryComponent implements OnDestroy {

	private budgetNotificationsSubscription: Subscription;
	private realTimeActionsSubscription: Subscription;

	filters: OrdersFilter[];
	todayFilter: OrdersFilter[];
	pendingFilter: OrdersFilter[];
	allFilters: OrdersFilter[];

	constructor(
		private inspectionService: InspectionService,
		private realTimeService: RealTimeService,
		private cdRef: ChangeDetectorRef
	) {
		this.todayFilter = [new TodayOrdersFilter()];
		this.pendingFilter = [new PendingOrdersFilter()];
		this.allFilters = this.todayFilter.concat(this.pendingFilter);

		this.filters = this.todayFilter;

		this.budgetNotificationsSubscription = this.inspectionService.inspectionsTrigger$.subscribe(() => {
			this.cdRef.detectChanges();
		});

		this.realTimeActionsSubscription = this.realTimeService.realTimeActions$.subscribe(() => {
			this.cdRef.detectChanges();
		});
	}

	ngOnDestroy(): void {
		this.budgetNotificationsSubscription.unsubscribe();
		this.realTimeActionsSubscription.unsubscribe();
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

	findAllItemBudgetLength(budgetType: string = undefined): number {
		return InspectionService.findAllItemBudgets(budgetType).length;
	}

	findPendingItemBudgetsLength(budgetType: string = undefined): number {
		return InspectionService.findPendingItemBudgets(budgetType).length;
	}

	findPendingClientContacts(): number {
		return InspectionService.findPendingClientContactOrders().length;
	}

	findBudgetsPrice(): number {
		const budgets = InspectionService.findOrdersBudgets();
		return InspectionService.findBudgetsPrice(budgets);
	}

	findAcceptedBudgetsPrice(orderInspections: OrderInspection[] = this.orderInspections): number {
		const acceptedBudgets = [];
		// TODO Ahora mismo orderiNspections contieen or sin revision. Valorar dejar sólo aquella que sí tienen
		orderInspections.forEach(orderInspection => {
			const savedInspection = orderInspection.inspection ?
				InspectionService.findSavedInspection(orderInspection.order.number) : undefined;

			// const orderInspection = InspectionService.findOrderInspection(savedInspection.orderNumber);
			/* Si hay una revisión guardada, pero la orden no tiene código de revisión, no existe orderInspection */
			if (savedInspection) {
				savedInspection.itemBudgets.forEach(itemBudget => {
					const budget = InspectionService.findExistentBudget(
						itemBudget.itemCode, orderInspection.inspection.vehicle, orderInspection.order.budgets
					);
					if (budget && InspectionService.checkAcceptedBudget(budget)) {
						const alreadyAddedBudget = acceptedBudgets.indexOf(budget) !== -1;
						if (!alreadyAddedBudget) {
							acceptedBudgets.push(budget);
						}
					}
				});
			}
		});
		return InspectionService.findBudgetsPrice(acceptedBudgets);
	}

	findDoneItemBudgets(orderInspections: OrderInspection[] = this.orderInspections): ItemBudget[] {
		const doneBudgets = [];
		orderInspections.forEach(orderInspection => {
			const savedInspection = orderInspection.inspection ?
				InspectionService.findSavedInspection(orderInspection.order.number) : undefined;
			if (savedInspection) {
				const doneOrderBudgets = savedInspection.itemBudgets.filter(itemBudget =>
					InspectionService.findExistentBudget(
						itemBudget.itemCode, orderInspection.inspection.vehicle, orderInspection.order.budgets
					) !== undefined
				);
				doneBudgets.push(...doneOrderBudgets);
			}
		});
		return doneBudgets;
	}

	findAcceptedItemBudgets(orderInspections: OrderInspection[] = this.orderInspections): ItemBudget[] {
		const doneBudgets = [];
		orderInspections.forEach(orderInspection => {
			const savedInspection = orderInspection.inspection ?
				InspectionService.findSavedInspection(orderInspection.order.number) : undefined;
			if (savedInspection) {
				const doneOrderBudgets = savedInspection.itemBudgets.filter(itemBudget => {
					const budget = InspectionService.findExistentBudget(
						itemBudget.itemCode, orderInspection.inspection.vehicle, orderInspection.order.budgets
					);
					return budget && InspectionService.checkAcceptedBudget(budget);
				});
				doneBudgets.push(...doneOrderBudgets);
			}
		});
		return doneBudgets;
	}

	findAcceptedPercentage(): number {
		return this.findDoneItemBudgets().length ? this.findAcceptedItemBudgets().length / this.findDoneItemBudgets().length : 0;
	}

	findNotFinishedInspectionOrders(): number {
		return this.orderInspections.filter(orderInspection => {
			const savedInspection = orderInspection.inspection ?
				InspectionService.findSavedInspection(orderInspection.order.number) : undefined;
			return Constants.PENDING_INSPECTION_ORDER_STATES.find(s => s === orderInspection.order.state) !== undefined &&
				savedInspection?.state !== Constants.INSPECTION_STATE.FINISHED;
		}).length;
	}

	findFinishedInspections(): OrderInspection[] {
		return this.findPendingInspections().filter(orderInspection => {
			const savedInspection = InspectionService.findSavedInspection(orderInspection.order.number);
			return savedInspection?.state === Constants.INSPECTION_STATE.FINISHED;
		});
	}

	findPendingInspections(orderInspections: OrderInspection[] = this.orderInspections): OrderInspection[] {
		return orderInspections.filter(o => o.inspection);
	}

	findWrongItemsPercentage(): number {
		const savedInspections = [];
		this.findPendingInspections().forEach(o => {
			const savedInspection = InspectionService.findSavedInspection(o.order.number);
			if (savedInspection) {
				savedInspections.push(savedInspection);
			}
		});
		const totalItems = [].concat(...savedInspections.map(s => s.items.filter(i => i.item.type === Constants.ITEM_TYPE.SELECT)));
		const wrongItems = totalItems.filter(i => i.filled && InspectionService.checkWrongSelectValue(i.findValue()));
		return totalItems.length ? wrongItems.length / totalItems.length : 0;
	}

}
