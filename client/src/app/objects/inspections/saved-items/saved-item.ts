import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';
import { Item } from '../items/item';
import { Image } from '../image';

export abstract class SavedItem {

	item: Item;
	filled: Dayjs;
	employeeCode: string;
	image: Image;

	protected constructor(savedItem: SavedItem) {
		this.item = new Item(savedItem.item);
		this.employeeCode = savedItem.employeeCode;
		if (savedItem) {
			this.filled = savedItem.filled ? dayjs(savedItem.filled) : undefined;
			this.image = savedItem.image ? new Image(savedItem.image.image, savedItem.image.landscape) : undefined;
		}
	}

	abstract findValue(): string;

}
