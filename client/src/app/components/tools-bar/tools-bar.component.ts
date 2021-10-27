import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrdersFilter } from '../../objects/filters/orders-filter';
import { InspectionService } from '../../services/inspection.service';
import { TodayOrdersFilter } from '../../objects/filters/today-orders-filter';
import { PendingOrdersFilter } from '../../objects/filters/pending-orders-filter';
import { LoadingService } from '../../services/loading.service';

@Component({
	selector: 'app-tools-bar',
	templateUrl: './tools-bar.component.html',
	styleUrls: ['./tools-bar.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolsBarComponent {

	pendingFilter: OrdersFilter[];
	todayFilter: OrdersFilter[];
	allFilters: OrdersFilter[];
	selectedFilters: OrdersFilter[];

	constructor(
		private inspectionService: InspectionService,
		private loadingService: LoadingService
	) {
		this.pendingFilter = [new PendingOrdersFilter()];
		this.todayFilter = [new TodayOrdersFilter()];
		this.allFilters = this.todayFilter.concat(this.pendingFilter);
		this.selectedFilters = this.todayFilter;
	}

	checkSelectedFilter(filters: OrdersFilter[], selectedFilters: OrdersFilter[] = this.selectedFilters): boolean {
		return filters === selectedFilters;
	}

	filterOrders(filters: OrdersFilter[]): void {
		this.selectedFilters = filters;
		this.loadingService.start();
		this.inspectionService.loadMainInfo(filters).subscribe(() => this.loadingService.stop());
	}

}
