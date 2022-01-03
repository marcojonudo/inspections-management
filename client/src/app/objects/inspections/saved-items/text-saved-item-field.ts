export class TextSavedItemField {

	text: string;
	order: number;

	constructor(field: any) {
		this.text = field.text;
		this.order = field.order;
	}

}
