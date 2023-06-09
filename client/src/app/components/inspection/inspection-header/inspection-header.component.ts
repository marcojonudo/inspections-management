import { ChangeDetectionStrategy, Component, HostBinding, HostListener, Input } from '@angular/core';
import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';
import { Router } from '@angular/router';
import { Employee } from '../../../objects/employee';
import { Constants } from '../../../utils/constants';
import { SavedInspection } from '../../../objects/inspections/saved-inspection';
import { OrderPipe } from '../../../pipes/order.pipe';
import { InspectionService } from '../../../services/inspection.service';
import { SavedItem } from '../../../objects/inspections/saved-items/saved-item';
import { Order } from '../../../objects/orders/order';
import { Centre } from '../../../objects/centre';
import { SelectItemOption } from '../../../objects/inspections/items/select-item-option';
import { Car } from '../../../objects/orders/vehicles/car';
import { Vehicle } from '../../../objects/orders/vehicles/vehicle';
import { InspectionVehicle } from '../../../objects/inspections/inspection-vehicle';
import { TranslateService } from '@ngx-translate/core';
import { Item } from '../../../objects/inspections/items/item';

@Component({
	selector: 'app-inspection-header',
	templateUrl: './inspection-header.component.html',
	styleUrls: ['./inspection-header.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionHeaderComponent {

	private readonly GROUP_LABELS: { [key: string]: string[] };
	private readonly EXIT_INSPECTION = 'exit-inspection';

	@Input() adviser: Employee;
	@Input() mechanics: Employee[];

	avoidLegendItems: string[] = [Constants.SELECT_ITEM_OPTION_CODE.NA];

	@HostBinding('class') classes = this.EXIT_INSPECTION;

	@HostListener(Constants.EVENT.CLICK, ['$event'])
	onClick(event): void {
		if (event.target.className.includes(this.EXIT_INSPECTION)) {
			this.router.navigate(['/']);
		}
	}

	constructor(private orderPipe: OrderPipe, private router: Router, private translateService: TranslateService) {
		this.GROUP_LABELS = {
			'Realizado ajuste/cambio/relleno': [
				Constants.SELECT_ITEM_OPTION_CODE.RA, Constants.SELECT_ITEM_OPTION_CODE.RR
			]
		};
	}

	// region Getters / setters

	get inspection(): InspectionVehicle {
		return InspectionService.selectedOrderInspection.inspection;
	}

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

	findInspectionTitle(inspection: InspectionVehicle = this.inspection): string {
		return InspectionService.inspectionHandler.findInspectionTitle(inspection) ||
			this.translateService.instant(`inspection.type.${Constants.DETECTED_FAULTS_CODE}`);
	}

	findItemName(item: Item): string {
		return item.shortName || item.name;
	}

}
