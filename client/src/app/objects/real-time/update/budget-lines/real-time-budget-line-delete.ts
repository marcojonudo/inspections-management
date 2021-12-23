import { Constants } from '../../../../utils/constants';
import { RealTimeBudgetLine } from './real-time-budget-line';
import { BudgetLine } from '../../../orders/budget-line';

export class RealTimeBudgetLineDelete extends RealTimeBudgetLine {

	constructor(lines: BudgetLine[], syncedLines: BudgetLine[], line: BudgetLine, syncedLine: BudgetLine = undefined) {
		super(Constants.REAL_TIME_BUDGET_LINE_TYPE.DELETE, lines, syncedLines, line, syncedLine);
	}

	check(): boolean {
		return this.findIndex(this.syncedLines, this.line) === -1;
	}

	update(): void {
		const i = this.findIndex(this.lines, this.line);
		this.lines.splice(i, 1);
	}

}
