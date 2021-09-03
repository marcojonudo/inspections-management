import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';
import { Item } from '../items/item';

export abstract class SavedItem {

	item: Item;
	filled: Dayjs;

	protected constructor(savedItem: SavedItem) {
		this.item = new Item(savedItem.item);
		this.filled = savedItem.filled ? dayjs(savedItem.filled) : undefined;
	}

	abstract findValue(): string;

}
