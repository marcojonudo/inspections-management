import {ListElement} from './list-element';
import {NameElement} from './name-element';

export class Category implements ListElement {

	code: string;
	name: string;
	items: ListElement[];
	order: number;

	constructor(nameElement: NameElement, items: ListElement[]) {
		this.code = nameElement.code;
		this.name = nameElement.name;
		this.items = items;
		this.order = nameElement.order;
	}

}
