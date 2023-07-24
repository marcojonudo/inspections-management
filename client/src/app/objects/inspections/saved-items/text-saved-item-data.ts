import { TextItem } from '../items/text-item';
import { TextSavedItemDataField } from './text-saved-item-data-field';
import { SavedItemData } from './saved-item-data';
import { Utils } from '../../../utils/utils';

export class TextSavedItemData extends SavedItemData {

	item: TextItem;
	fields: TextSavedItemDataField[];

	constructor(employeeCode: string, textSavedItemData: any, item: TextItem) {
		super(employeeCode, textSavedItemData, item);
		this.item = item;
		this.fields = (textSavedItemData ? textSavedItemData : item).fields.map(field => new TextSavedItemDataField(field));
	}

	findValue(): string {
		const itemFields = (this.item as TextItem).fields;
		return Utils.sort(this.fields.filter(field => field.text), (f) => f.order).map(field => {
			const itemField = itemFields.find(f => f.order === field.order);
			return `${itemField.prefix ? itemField.prefix : ''}${field.text}${itemField.separator ? itemField.separator : ''}`;
		}).join('');
	}

	isFilled(): boolean {
		return this.findValue() !== undefined && this.findValue() !== '';
	}

	update(fields: TextSavedItemDataField[], employeeCode: string): void {
		this.fields.forEach(field => {
			const updateField = fields.find(f => f.order === field.order);
			field.text = updateField.text;
		});
		this.updateCommonFields(employeeCode);
	}

	reset(employeeCode: string): void {
		this.fields = this.item.fields.map(field => new TextSavedItemDataField(field));
		this.image = undefined;
		this.updateCommonFields(employeeCode);
	}

}
