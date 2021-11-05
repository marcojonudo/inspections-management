import { BudgetLine } from './budget-line';

export class Budget {

	number: number;
	state: string;
	lines: BudgetLine[];

	constructor(budget: any) {
		this.number = budget.number;
		this.state = budget.state;
		this.lines = budget.lines.map(line => new BudgetLine(this.number, line));
	}

}
