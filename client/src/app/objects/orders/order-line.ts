export class OrderLine {

	orderNumber: number;
	line: number;
	articleCode: number;
	articleName: string;
	units: number;

	constructor(orderNumber: number, line: any) {
		this.orderNumber = orderNumber;
		this.line = line.line;
		this.articleCode = line.articleCode;
		this.articleName = line.articleName;
		this.units = line.units;
	}

}
