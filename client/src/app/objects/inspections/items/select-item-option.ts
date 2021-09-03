export class SelectItemOption {

	code: string;
	name: string;
	icon: string;
	printIcon: string;
	order: number;

	constructor(option: any) {
		this.code = option.code;
		this.name = option.name;
		this.icon = option.icon;
		this.printIcon = option.printIcon;
		this.order = option.order;
	}

}
