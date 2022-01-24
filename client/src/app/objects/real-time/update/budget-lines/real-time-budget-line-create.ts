import { Constants } from '../../../../utils/constants';
import { BudgetLine } from '../../../orders/budget-line';
import { RealTimeBudgetLine } from './real-time-budget-line';

export class RealTimeBudgetLineCreate extends RealTimeBudgetLine {

	constructor(lines: BudgetLine[], syncedLines: BudgetLine[], line: BudgetLine, syncedLine: BudgetLine) {
		super(Constants.REAL_TIME_UPDATE_TYPE.CREATE, lines, syncedLines, line, syncedLine);
	}

	check(): boolean {
		return this.findIndex(this.lines, this.syncedLine) === -1;
	}

	update(): void {
		this.lines.push(this.syncedLine);
	}

}
