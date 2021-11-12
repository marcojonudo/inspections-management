import { ChangeDetectionStrategy, Component, HostBinding, HostListener } from '@angular/core';
import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';
import { Router } from '@angular/router';
import { ChartOptions, ChartType } from 'chart.js';
import { Color } from 'ng2-charts';
import { Employee } from '../../../objects/employee';
import { Constants } from '../../../utils/constants';
import { SavedInspection } from '../../../objects/inspections/saved-inspection';
import { OrderPipe } from '../../../pipes/order.pipe';
import { InspectionService } from '../../../services/inspection.service';
import { EmployeeService } from '../../../services/employee.service';
import { SavedItem } from '../../../objects/inspections/saved-items/saved-item';
import { Order } from '../../../objects/orders/order';
import { Centre } from '../../../objects/centre';
import { SelectItemOption } from '../../../objects/inspections/items/select-item-option';
import { Car } from '../../../objects/orders/vehicles/car';
import { Vehicle } from '../../../objects/orders/vehicles/vehicle';
import { SelectSavedItem } from '../../../objects/inspections/saved-items/select-saved-item';

@Component({
	selector: 'app-inspection-header',
	templateUrl: './inspection-header.component.html',
	styleUrls: ['./inspection-header.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionHeaderComponent {

	private readonly GROUP_LABELS: { [key: string]: string[] };
	private readonly EXIT_INSPECTION = 'exit-inspection';

	chartType: ChartType;
	options: ChartOptions;
	colors: Color[];
	today: Dayjs;
	adviser: Employee;
	mechanics: Employee[];
	avoidLegendItems: string[] = [Constants.SELECT_ITEM_OPTION_CODE.NA];

	@HostBinding('class') classes = this.EXIT_INSPECTION;

	@HostListener(Constants.EVENT.CLICK, ['$event'])
	onClick(event): void {
		if (event.target.className.includes(this.EXIT_INSPECTION)) {
			this.router.navigate(['/']);
		}
	}

	constructor(private orderPipe: OrderPipe, private router: Router) {
		this.GROUP_LABELS = {
			'Realizado ajuste/cambio/relleno': [
				Constants.SELECT_ITEM_OPTION_CODE.RA, Constants.SELECT_ITEM_OPTION_CODE.RR
			]
		};
		this.today = dayjs();
		this.adviser = EmployeeService.findEmployee(this.order.sellerCode);
		this.mechanics = this.savedInspection.items.map(i => i.employeeCode).filter(
			(value, index, self) => self.indexOf(value) === index
		).map(employeeCode => EmployeeService.findEmployee(employeeCode));

		this.chartType = 'pie';
		this.options = { animation: { duration: 0 } };
		this.colors = [{
			backgroundColor: this.findLabels().map(label => this.findIconColor(label.code))
		}];
	}

	// region Getters / setters

	get order(): Order {
		return InspectionService.selectedOrderInspection.order;
	}

	get savedInspection(): SavedInspection {
		return InspectionService.selectedSavedInspection;
	}

	get centre(): Centre {
		return InspectionService.centre;
	}

	get headerVehicleItem(): string {
		return Constants.HEADER_CARD.VEHICLE;
	}

	get selectItemOptions(): SelectItemOption[] {
		return InspectionService.selectItemOptions;
	}

	get carType(): string {
		return Constants.VEHICLE_TYPE.CAR;
	}

	get scooterType(): string {
		return Constants.VEHICLE_TYPE.SCOOTER;
	}

	// endregion

	findCar(vehicle: Vehicle): Car {
		return vehicle as Car;
	}

	findIconColor(code: string): string {
		return InspectionService.findIconColor(code);
	}

	findSelectItems(items: SavedItem[] = this.savedInspection.items): SelectSavedItem[] {
		return items.filter(item => item.item.type === Constants.ITEM_TYPE.SELECT) as SelectSavedItem[];
	}

	groupData(
		labels: SelectItemOption[], data: number[], groupLabels: { [key: string]: string[] } = this.GROUP_LABELS
	): number[] {
		Object.entries(groupLabels).forEach(([name, codes]) => {
			const codesLabels = labels.filter(label => codes.find(code => code === label.code));
			const existentCodes = codesLabels.length === codes.length;
			if (existentCodes) {
				const groupedData = data.filter((v: number, i: number) =>
					codesLabels.find(l => l.order === i + 1)
				).reduce((a, b) => a + b, 0);
				codesLabels.forEach(label =>
					data.splice(data.findIndex((n: number, i: number) => i === label.order - 1), 1)
				);
				data.splice(codesLabels[0].order - 1, 0, groupedData);
			}
		});
		return data;
	}

	findData(items: SavedItem[] = this.savedInspection.items): number[] {
		const labels = this.findLabels();
		const selectItems = this.findSelectItems(items);
		const data = [];
		labels.forEach(label => {
			data.push(selectItems.filter(item => item.value === label.code).length);
		});
		return this.groupData(labels, data);
	}

	findHeaderItems(code: string, items: SavedItem[] = this.savedInspection.items): SavedItem[] {
		return items.filter(item => item.item.header === code);
	}

	findLabels(): SelectItemOption[] {
		const labels = this.selectItemOptions.filter(option =>
			!this.avoidLegendItems.find(code => code === option.code)
		);
		return this.orderPipe.transform(labels);
	}

	groupLabels(
		labels: SelectItemOption[], groupLabels: { [key: string]: string[] } = this.GROUP_LABELS
	): SelectItemOption[] {
		const groupedLabels = labels.slice(0, labels.length);
		Object.entries(groupLabels).forEach(([name, codes]) => {
			const codesLabels = groupedLabels.filter(label => codes.find(code => code === label.code));
			const existentCodes = codesLabels.length === codes.length;
			if (existentCodes) {
				codes.forEach(code => groupedLabels.splice(groupedLabels.findIndex(label => label.code === code), 1));
				groupedLabels.push(new SelectItemOption({
					name,
					code: codesLabels[0].code,
					order: codesLabels[0].order
				}));
			}
		});
		return groupedLabels;
	}

}
