import { Item } from '../items/item';
import { SavedItemData } from './saved-item-data';
import { ItemType } from '../items/item-type';
import { Dayjs } from 'dayjs';

export class SavedItem {

	item: Item;
	type: string;
	code: string;
	data: SavedItemData[];

	constructor(savedItem: SavedItem, item: Item) {
		this.item = item;
		this.type = savedItem.type;
		this.code = savedItem.code;
		if (savedItem) {
			const itemType = ItemType.parse(this.item.type);
			this.data = savedItem.data.map(d => itemType.buildData(d.employeeCode, d, this.item));
		}
	}

	isHidden(): boolean {
		return this.findData().hidden;
	}

	isFilled(): boolean {
		return this.findData().isFilled();
	}

	findLastData(data: SavedItemData[] = this.data): SavedItemData {
		return data.reduce((prev, current) => !current.filled || (prev.filled > current.filled) ? prev : current);
	}

	findData(employeeCode: string = undefined): SavedItemData {
		if (employeeCode && this.findLastData().saved) {
			this.addData(employeeCode);
		}
		return this.findLastData();
	}

	addData(employeeCode: string, item: Item = this.item): void {
		const itemType = ItemType.parse(item.type);
		this.data.push(itemType.buildData(employeeCode, undefined, item));
	}

	findValue(): string {
		return this.findData().findValue();
	}

	findImageId(): number {
		return this.findData().imageId;
	}

	findFilled(): Dayjs {
		return this.findData().filled;
	}

	findEmployeeCode(): string {
		return this.findData().employeeCode;
	}

	updateHidden(employeeCode: string, hidden: boolean): void {
		this.findData().updateHidden(employeeCode, hidden);
	}

	update(value: any, employeeCode: string): void {
		this.findData(employeeCode).update(value, employeeCode);
	}

}
