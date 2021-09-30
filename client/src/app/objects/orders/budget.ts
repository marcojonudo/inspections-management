import { BudgetLine } from './budget-line';

export class Budget {

	number: number;
	lines: BudgetLine[];

	constructor(budget: any) {
		this.number = budget.number;
		this.lines = budget.lines.map(line => new BudgetLine(this.number, line));
	}

}
