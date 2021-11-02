import { NameElement } from '../list-elements/name-element';

export class ItemCategory extends NameElement {

	code: string;

	constructor(category: any) {
		super(category);
		this.code = category.code;
	}

}
