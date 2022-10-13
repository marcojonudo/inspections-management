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
		const savedData = data.filter(d => d.saved);
		/* Si todos los elementos tienen saved, se obtiene en último que se haya guardado (y por tanto, con el valor más
		 * reciente). Si no, se obtiene aquel que no tenga saved (y por tanto, no se haya guardado aún) */
		return savedData.length === data.length ?
			data.reduce((d1, d2) => d1.saved > d2.saved ? d1 : d2) :
			data.find(d => !d.saved);
	}

	findData(employeeCode: string = undefined): SavedItemData {
		if (employeeCode && this.findLastData().saved) {
			this.addData(employeeCode);
		}
		return this.findLastData();
	}

	addData(employeeCode: string, item: Item = this.item): void {
		const itemType = ItemType.parse(item.type);
		const newData = itemType.buildData(employeeCode, undefined, item);
		this.data.push(newData);
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
		this.findData(employeeCode).updateHidden(employeeCode, hidden);
	}

	update(value: any, employeeCode: string): void {
		this.findData(employeeCode).update(value, employeeCode);
	}

}
