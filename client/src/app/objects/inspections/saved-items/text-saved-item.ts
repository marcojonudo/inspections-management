import { SavedItem } from './saved-item';
import { TextSavedItemField } from './text-saved-item-field';
import { TextItem } from '../items/text-item';
import { Utils } from '../../../utils/utils';

export class TextSavedItem extends SavedItem {

	fields: TextSavedItemField[];

	constructor(savedItem: TextSavedItem) {
		super(savedItem);
		this.fields = savedItem.fields.map(field => new TextSavedItemField(field));
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

	update(fields: TextSavedItemField[], employeeCode: string): void {
		this.fields.forEach(field => {
			const updateField = fields.find(f => f.order === field.order);
			field.text = updateField.text;
		});
		this.updateCommonFields(employeeCode);
	}

	reset(employeeCode: string): void {
		this.fields = (this.item as TextItem).fields.map(field => new TextSavedItemField(field));
		this.image = undefined;
		this.updateCommonFields(employeeCode);
	}

}
