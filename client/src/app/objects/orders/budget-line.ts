export class BudgetLine {

	budgetNumber: number;
	line: number;
	articleCode: number;
	price: number;
	units: number;

	constructor(budgetNumber: number, line: any) {
		this.budgetNumber = budgetNumber;
		this.line = line.line;
		this.articleCode = line.articleCode;
		this.price = line.price;
		this.units = line.units;
	}

}
