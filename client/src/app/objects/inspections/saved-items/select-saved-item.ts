import { SavedItem } from './saved-item';
import { Constants } from '../../../utils/constants';
import { SelectItem } from '../items/select-item';

export class SelectSavedItem extends SavedItem {

	value: string;

	constructor(savedItem: SelectSavedItem, item: SelectItem) {
		super(savedItem, item);
		this.value = savedItem.value;
	}

	findValue(): string {
		return this.value;
	}

	isFilled(): boolean {
		return this.findValue() !== Constants.SELECT_ITEM_OPTION_CODE.P;
	}

	update(value: string, employeeCode: string): void {
		this.value = value;
		this.updateCommonFields(employeeCode);
	}

	reset(employeeCode: string): void {
		this.value = Constants.SELECT_ITEM_OPTION_CODE.P;
		this.imageId = undefined;
		this.updateCommonFields(employeeCode);
	}

	isUpdated(syncedSavedItem: SelectSavedItem): boolean {
		return this.value !== syncedSavedItem.value;
	}

}
