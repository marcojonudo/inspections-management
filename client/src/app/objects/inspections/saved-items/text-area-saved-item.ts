import { SavedItem } from './saved-item';
import { TextAreaItem } from '../items/text-area-item';

export class TextAreaSavedItem extends SavedItem {

	text: string;

	constructor(savedItem: TextAreaSavedItem, item: TextAreaItem) {
		super(savedItem, item);
		this.text = savedItem?.text;
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

	isUpdated(syncedSavedItem: TextAreaSavedItem): boolean {
		return this.text !== syncedSavedItem.text;
	}

}
