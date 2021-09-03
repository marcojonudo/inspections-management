export class Item {

	type: string;
	code: string;
	name: string;

	constructor(item: any) {
		this.type = item.type;
		this.code = item.code;
		this.name = item.name;
	}

}
