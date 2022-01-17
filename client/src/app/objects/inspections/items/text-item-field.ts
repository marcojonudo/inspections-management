import { TextItemFieldValue } from './text-item-field-value';

export class TextItemField {

	placeholder: string;
	separator: string;
	prefix: string;
	inputType: string;
	select: boolean;
	maxLength: number;
	order: number;
	values: TextItemFieldValue[];

	constructor(textItemField: any) {
		this.placeholder = textItemField.placeholder;
		this.prefix = textItemField.prefix;
		this.inputType = textItemField.inputType;
		this.select = textItemField.select;
		this.maxLength = textItemField.maxLength;
		this.order = textItemField.order;
		this.values = textItemField.values.map(v => new TextItemFieldValue(v));
	}

}
