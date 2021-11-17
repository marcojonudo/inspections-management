import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';
import { Item } from '../items/item';
import { Image } from '../image';

export abstract class SavedItem {

	item: Item;
	filled: Dayjs;
	hidden: boolean;
	employeeCode: string;
	sellerCode: string;
	image: Image;
	imageId: number;

	protected constructor(savedItem: SavedItem) {
		this.item = savedItem.item;
		this.employeeCode = savedItem.employeeCode;
		if (savedItem) {
			this.filled = savedItem.filled ? dayjs(savedItem.filled) : undefined;
			this.imageId = savedItem.imageId;
			this.hidden = savedItem.hidden;
		}
	}

	abstract findValue(): string;

	abstract isFilled(): boolean;

	abstract update(value: string, employeeCode: string): void;

	abstract reset(employeeCode: string): void;

	updateHidden(employeeCode: string, hidden: boolean): void {
		this.hidden = hidden;
		this.reset(employeeCode);
	}

	updateCommonFields(employeeCode: string): void {
		this.sellerCode = employeeCode;
		this.filled = dayjs();
	}

}
