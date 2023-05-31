import { SavedItem } from './saved-items/saved-item';
import { ItemBudget } from '../item-budget';
import { RealTimeObject } from '../real-time/update/real-time-object';
import { SavedInspectionData } from './saved-inspection-data';
import * as dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { Constants } from '../../utils/constants';

export class SavedInspection implements RealTimeObject {

	inspectionTypeCode: string;
	vehicle: string;
	orderNumber: number;
	numberPlate: number;
	state: string;
	orderInspection: boolean;
	items: SavedItem[];
	itemBudgets: ItemBudget[];
	sent: Dayjs;
	data: SavedInspectionData[];

	constructor(savedInspection: any, savedItems: SavedItem[], itemBudgets: ItemBudget[]) {
		this.inspectionTypeCode = savedInspection.inspectionTypeCode;
		this.orderNumber = savedInspection.orderNumber;
		this.vehicle = savedInspection.vehicle;
		this.numberPlate = savedInspection.numberPlate;
		this.state = savedInspection.state;
		this.items = savedItems;
		this.itemBudgets = itemBudgets;
		this.orderInspection = savedInspection.orderInspection;
		this.sent = savedInspection.sent ? dayjs(savedInspection.sent) : undefined;
		this.data = savedInspection.data.map(d =>
			new SavedInspectionData(d.employeeCode, d.origin, d.reason, dayjs(d.saved), d.sendMethod)
		);
	}

	findData(): SavedInspectionData {
		return this.data.reduce((d1, d2) => d1.saved > d2.saved ? d1 : d2);
	}

	findFirstData(): SavedInspectionData {
		return this.data.find(d => d.reason === Constants.REASON.SAVED);
	}

	findMechanic(): string {
		return this.findFirstData().employeeCode;
	}

	addData(
		employeeCode: string,
		origin: string = Constants.ORIGIN.INSPECTIONS_MANAGEMENT,
		reason: string = Constants.REASON.UPDATED,
		sendMethod: string = undefined
	): void {
		const maxSaved = dayjs(Math.max(...this.data.map(d => d.saved.valueOf())));
		const now = dayjs();
		/* Puede darse el caso de que, si se guarda muy rápido la revisión, se de clic al botón por segunda vez en el mismo segundo. En ese
		 * caso, se suma un segundo a la fecha para evitar duplicados */
		const saved = now.diff(maxSaved, 's') > 0 ? now : maxSaved.add(1, 's');
		this.data.push(new SavedInspectionData(employeeCode, origin, reason, saved, sendMethod));
		this.items.filter(i => !i.findData().saved).forEach(i => {
			i.findData().saved = dayjs(this.findData().saved);
		});
	}

	restoreSaved(): void {
		const maxSavedItem = this.data.reduce((d1, d2) => d1.saved > d2.saved ? d1 : d2);
		const i = this.data.indexOf(maxSavedItem);
		this.data.splice(i, 1);
		this.items.forEach(savedItem => {
			savedItem.findData().saved = undefined;
		});
	}

}
