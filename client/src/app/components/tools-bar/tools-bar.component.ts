import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { OrdersFilter } from '../../objects/filters/orders-filter';
import { InspectionService } from '../../services/inspection.service';
import { TodayOrdersFilter } from '../../objects/filters/today-orders-filter';
import { PendingOrdersFilter } from '../../objects/filters/pending-orders-filter';
import { LoadingService } from '../../services/loading.service';
import { PrintService } from '../../services/print.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, finalize } from 'rxjs/operators';
import { Constants } from '../../utils/constants';
import { animate, style, transition, trigger } from '@angular/animations';
import { SnackBarService } from '../../services/snack-bar.service';
import { AllOrdersFilter } from '../../objects/filters/all-orders-filter';
import { EmployeeService } from '../../services/employee.service';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-tools-bar',
	templateUrl: './tools-bar.component.html',
	styleUrls: ['./tools-bar.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('buttonAnimation', [
			transition(
				':enter',
				[
					style({ opacity: 0, transform: 'scale(0)' }),
					animate('.15s', style({ opacity: 1, transform: 'scale(1)' }))
				]
			),
			transition(
				':leave',
				[
					style({ opacity: 1, transform: 'scale(1)' }),
					animate('.15s', style({ opacity: 0, transform: 'scale(0)' }))
				]
			)
		])
	]
})
export class ToolsBarComponent {

	pendingFilter: OrdersFilter;
	todayFilter: OrdersFilter;
	allFilter: OrdersFilter;
	selectedFilter: OrdersFilter;
	url: string;
	saving: boolean;

	constructor(
		private inspectionService: InspectionService,
		private loadingService: LoadingService,
		private printService: PrintService,
		private snackBarService: SnackBarService,
		private router: Router,
		private http: HttpClient,
		private cdRef: ChangeDetectorRef
	) {
		this.pendingFilter = new PendingOrdersFilter();
		this.todayFilter = new TodayOrdersFilter();
		this.allFilter = new AllOrdersFilter();
		this.selectedFilter = this.todayFilter;
		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd)
		).subscribe((event: NavigationEnd) => {
			this.url = event.url;
			this.cdRef.detectChanges();
		});
	}

	get inspectionPath(): string {
		return Constants.PATH.INSPECTION;
	}

	checkUrl(path: string, url: string = this.url): boolean {
		return url && url.includes(path);
	}

	checkSelectedFilter(filter: OrdersFilter, selectedFilter: OrdersFilter = this.selectedFilter): boolean {
		return filter === selectedFilter;
	}

	filterOrders(filter: OrdersFilter): void {
		this.selectedFilter = filter;
		this.loadingService.start();
		this.inspectionService.loadMainInfo([filter]).subscribe(() => this.loadingService.stop());
	}

	print(): void {
		if (!EmployeeService.checkAdminEmployee()) {
			this.inspectionService.saveInspection().subscribe();
		}
		this.printService.openPrintDialog();
	}

	sendMail(): void {
		this.inspectionService.sendInspectionMail().subscribe();
	}

	goBack(): void {
		this.router.navigate(['/']);
	}

	save(): void {
		this.saving = true;
		this.inspectionService.saveInspection().pipe(
			finalize(() => {
				this.saving = false;
				this.cdRef.detectChanges();
			})
		).subscribe(
			() => this.snackBarService.open(Constants.MESSAGE_CODE.SAVED_INSPECTION),
			(error) => {
				console.error(error);
				this.snackBarService.open(Constants.MESSAGE_CODE.ERROR_SAVING_INSPECTION, Constants.SNACK_BAR.TYPE.ERROR);
			}
		);
	}

}
