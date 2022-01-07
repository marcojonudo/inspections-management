import { BudgetLine } from '../../../orders/budget-line';

export abstract class RealTimeBudgetLine {

	private type: string;
	protected lines: BudgetLine[];
	protected syncedLines: BudgetLine[];
	line: BudgetLine;
	syncedLine: BudgetLine;

	protected constructor(type: string, lines: BudgetLine[], syncedLines: BudgetLine[], line: BudgetLine, syncedLine: BudgetLine) {
		this.type = type;
		this.lines = lines;
		this.syncedLines = syncedLines;
		this.line = line;
		this.syncedLine = syncedLine;
	}

	abstract check(): boolean;

	abstract update(): void;

	findIndex(lines: BudgetLine[], line: BudgetLine): number {
		return lines.findIndex(l => l.articleCode === line.articleCode && l.line === line.line);
	}

	find(line: BudgetLine): BudgetLine {
		return this.lines.find(l => l.articleCode === line.articleCode && l.line === line.line);
	}

}
