import { TextAreaItem } from '../items/text-area-item';
import { SavedItemData } from './saved-item-data';

export class TextAreaSavedItemData extends SavedItemData {

	text: string;

	constructor(employeeCode: string, textAreaSavedItemData: any, item: TextAreaItem) {
		super(employeeCode, textAreaSavedItemData, item);
		this.text = textAreaSavedItemData?.text;
	}

	findValue(): string {
		return this.text;
	}

	isFilled(): boolean {
		return this.findValue() !== undefined && this.findValue() !== '';
	}

	update(text: string, employeeCode: string): void {
		this.text = text;
		this.updateCommonFields(employeeCode);
	}

	reset(employeeCode: string): void {
		this.text = undefined;
		this.image = undefined;
		this.updateCommonFields(employeeCode);
	}

}
