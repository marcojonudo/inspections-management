import { Constants } from '../../../../utils/constants';
import { RealTimeBudgetLine } from './real-time-budget-line';
import { BudgetLine } from '../../../orders/budget-line';

export class RealTimeBudgetLineUpdate extends RealTimeBudgetLine {

	readonly BUDGET_LINE_UPDATE_PROPERTIES: ((line: BudgetLine) => void)[] = [
		(line: BudgetLine) => line.price,
		(line: BudgetLine) => line.units
	];

	constructor(lines: BudgetLine[], syncedLines: BudgetLine[], line: BudgetLine, syncedLine: BudgetLine) {
		super(Constants.REAL_TIME_UPDATE_TYPE.UPDATE, lines, syncedLines, line, syncedLine);
	}

	check(): boolean {
		return this.BUDGET_LINE_UPDATE_PROPERTIES.find(updateProperty =>
			updateProperty(this.line) !== updateProperty(this.syncedLine)
		) !== undefined;
	}

	update(): void {
		this.line.articleCode = this.syncedLine.articleCode;
		this.line.price = this.syncedLine.price;
		this.line.units = this.syncedLine.units;
	}

}
