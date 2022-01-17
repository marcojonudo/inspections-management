export class TextItemFieldValue {

	value: string;
	order: number;

	constructor(textItemFieldValue: any) {
		this.value = textItemFieldValue.value;
		this.order = textItemFieldValue.order;
	}

}
