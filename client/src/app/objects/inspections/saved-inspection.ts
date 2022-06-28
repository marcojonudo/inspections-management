import { SavedItem } from './saved-items/saved-item';
import { ItemBudget } from '../item-budget';
import { RealTimeObject } from '../real-time/update/real-time-object';
import { SavedInspectionData } from './saved-inspection-data';
import * as dayjs from 'dayjs';
import { Dayjs } from 'dayjs';

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
		this.data = savedInspection.data.map(d => new SavedInspectionData(d.employeeCode, d.sendMethod, d.saved));
	}

	findData(): SavedInspectionData {
		return this.data[this.data.length - 1];
	}

	findEmployeeCode(): string {
		return this.findData().employeeCode;
	}

	addData(employeeCode: string): void {
		this.data.push(new SavedInspectionData(employeeCode));
	}

	fillSaved(savedInspection: SavedInspection, employeeCode: string): void {
		this.findData().saved = dayjs(savedInspection.findData().saved);
		this.items.forEach(savedItem => {
			const s = savedInspection.items.find(i => i.item.code === savedItem.item.code);
			savedItem.findData().saved = dayjs(s.findData().saved);
		});
		this.addData(employeeCode);
	}

}
