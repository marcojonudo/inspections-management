export class NameElement {

	code: string;
	name: string;
	order: number;

	constructor(elem: any) {
		this.code = elem.code;
		this.name = elem.name;
		this.order = elem.order;
	}

}
