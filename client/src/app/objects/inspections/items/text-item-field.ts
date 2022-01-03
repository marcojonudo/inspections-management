export class TextItemField {

	placeholder: string;
	separator: string;
	prefix: string;
	suffix: string;
	maxLength: number;
	order: number;

	constructor(textItemField: any) {
		this.placeholder = textItemField.placeholder;
		this.prefix = textItemField.prefix;
		this.maxLength = textItemField.maxLength;
		this.order = textItemField.order;
	}

}
