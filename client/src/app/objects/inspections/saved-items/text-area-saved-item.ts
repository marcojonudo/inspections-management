import {SavedItem} from './saved-item';

export class TextAreaSavedItem extends SavedItem {

	text: string;

	constructor(savedItem: TextAreaSavedItem) {
		super(savedItem);
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
