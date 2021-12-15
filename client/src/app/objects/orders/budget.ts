import { BudgetLine } from './budget-line';

export class Budget {

	number: number;
	state: string;
	sellerCode: string;
	lines: BudgetLine[];

	constructor(budget: any) {
		this.number = budget.number;
		this.state = budget.state;
		this.sellerCode = budget.sellerCode;
		this.lines = budget.lines.map(line => new BudgetLine(this.number, line));
	}

}
