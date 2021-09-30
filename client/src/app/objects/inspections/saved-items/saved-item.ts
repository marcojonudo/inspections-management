import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';
import { Item } from '../items/item';

export abstract class SavedItem {

	item: Item;
	filled: Dayjs;
	employeeCode: string;

	protected constructor(savedItem: SavedItem) {
		this.item = new Item(savedItem.item);
		this.filled = savedItem.filled ? dayjs(savedItem.filled) : undefined;
		this.employeeCode = savedItem.employeeCode;
	}

	abstract findValue(): string;

}
