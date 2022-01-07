import { SavedItem } from './saved-items/saved-item';
import { ItemBudget } from '../item-budget';
import { Dayjs } from 'dayjs';
import { RealTimeObject } from '../real-time/update/real-time-object';

export class SavedInspection implements RealTimeObject {

	inspectionTypeCode: string;
	orderNumber: number;
	vehicle: string;
	employeeCode: string;
	sellerCode: string;
	state: string;
	items: SavedItem[];
	itemBudgets: ItemBudget[];
	orderInspection: boolean;
	saved: Dayjs;

	constructor(savedInspection: any, savedItems: SavedItem[], itemBudgets: ItemBudget[]) {
		this.inspectionTypeCode = savedInspection.inspectionTypeCode;
		this.orderNumber = savedInspection.orderNumber;
		this.vehicle = savedInspection.vehicle;
		this.employeeCode = savedInspection.employeeCode;
		this.state = savedInspection.state;
		this.items = savedItems;
		this.itemBudgets = itemBudgets;
		this.orderInspection = savedInspection.orderInspection;
	}

}
