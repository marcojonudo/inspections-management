export class BudgetLine {

	budgetNumber: number;
	line: number;
	articleCode: number;

	constructor(budgetNumber: number, line: any) {
		this.budgetNumber = budgetNumber;
		this.line = line.line;
		this.articleCode = line.articleCode;
	}

}
