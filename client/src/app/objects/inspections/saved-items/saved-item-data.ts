import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';
import { Item } from '../items/item';
import { Image } from '../image';

export abstract class SavedItemData {

	employeeCode: string;
	hidden: boolean;
	image: Image;
	imageId: number;
	restrictive: boolean;
	filled: Dayjs;
	saved: Dayjs;
	itemType: string;

	protected constructor(employeeCode: string, savedData: any, item: Item) {
		this.employeeCode = employeeCode;
		this.itemType = item.type;
		if (savedData) {
			this.imageId = savedData.imageId;
			this.filled = savedData.filled ? dayjs(savedData.filled) : undefined;
			this.hidden = savedData.hidden;
			this.restrictive = savedData.restrictive;
			this.saved = dayjs(savedData.saved);
		}
	}

	abstract findValue(): string;

	abstract isFilled(): boolean;

	abstract update(value: any, employeeCode: string): void;

	abstract reset(employeeCode: string): void;

	updateHidden(employeeCode: string, hidden: boolean): void {
		this.hidden = hidden;
		this.reset(employeeCode);
	}

	updateCommonFields(employeeCode: string): void {
		this.employeeCode = employeeCode;
		this.filled = dayjs();
	}

}
