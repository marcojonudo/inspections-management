import { SavedItemData } from './saved-item-data';
import { SelectItem } from '../items/select-item';
import { Constants } from '../../../utils/constants';

export class SelectSavedItemData extends SavedItemData {

	value: string;

	constructor(employeeCode: string, selectSavedItemData: any, item: SelectItem) {
		super(employeeCode, selectSavedItemData, item);
		this.value = selectSavedItemData ? selectSavedItemData.value : Constants.SELECT_ITEM_OPTION_CODE.P;
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
		this.image = undefined;
		this.updateCommonFields(employeeCode);
	}

}
