import { Constants } from '../../../../utils/constants';
import { RealTimeBudget } from './real-time-budget';
import { Budget } from '../../../orders/budget';
import { RealTimeBudgetLine } from '../budget-lines/real-time-budget-line';
import { BudgetLine } from '../../../orders/budget-line';
import { RealTimeBudgetLineCreate } from '../budget-lines/real-time-budget-line-create';
import { RealTimeBudgetLineDelete } from '../budget-lines/real-time-budget-line-delete';
import { RealTimeBudgetLineUpdate } from '../budget-lines/real-time-budget-line-update';

export class RealTimeBudgetUpdate extends RealTimeBudget {

	realTimeBudgetLines: RealTimeBudgetLine[];

	readonly BUDGET_UPDATE_PROPERTIES: ((budget: Budget) => void)[] = [
		(budget: Budget) => budget.state,
		(budget: Budget) => budget.sellerCode
	];

	constructor(budgets: Budget[], syncedBudgets: Budget[], budget: Budget, syncedBudget: Budget) {
		super(Constants.REAL_TIME_UPDATE_TYPE.UPDATE, budgets, syncedBudgets, budget, syncedBudget);
	}

	check(): boolean {
		const updated = this.BUDGET_UPDATE_PROPERTIES.find(updateProperty =>
			updateProperty(this.budget) !== updateProperty(this.syncedBudget)
		) !== undefined;

		/* Al comprobar si se debe actualizar la OR, también se rellena el array de actualizaciones de presupuestos (al formar estos
		 * parte de la OR). De esta forma, cuando se ejecute el update, se llevarán a cabo todas las acciones pendientes */
		const syncedUpdates = this.handleSyncedBudgetLines(this.syncedBudget.lines, this.budget.lines);
		const existentDataUpdates = this.handleExistentData(this.syncedBudget.lines, this.budget.lines);
		this.realTimeBudgetLines = syncedUpdates.concat(existentDataUpdates);

		/* Una OR se considera actualizada cuando cambia algún campo, o cuando cambia algún presupuesto */
		return updated || this.realTimeBudgetLines.length !== 0;
	}

	handleSyncedBudgetLines(syncedLines: BudgetLine[], lines: BudgetLine[]): RealTimeBudgetLine[] {
		const updates = [];
		syncedLines.forEach(syncedLine => {
			const realTimeCreate = new RealTimeBudgetLineCreate(lines, syncedLines, undefined, syncedLine);
			if (realTimeCreate.check()) {
				updates.push(realTimeCreate);
			} else {
				const line = realTimeCreate.find(syncedLine);
				const realTimeUpdate = new RealTimeBudgetLineUpdate(lines, syncedLines, line, syncedLine);
				if (realTimeUpdate.check()) {
					updates.push(realTimeUpdate);
				}
			}
		});
		return updates;
	}

	handleExistentData(syncedLines: BudgetLine[], lines: BudgetLine[]): RealTimeBudgetLine[] {
		const updates = [];
		lines.forEach(line => {
			const realTimeDelete = new RealTimeBudgetLineDelete(lines, syncedLines, line);
			if (realTimeDelete.check()) {
				updates.push(realTimeDelete);
			}
		});
		return updates;
	}

	update(): void {
		this.budget.state = this.syncedBudget.state;
		this.budget.sellerCode = this.syncedBudget.sellerCode;

		this.realTimeBudgetLines.forEach(realTimeBudgetLine => realTimeBudgetLine.update());
	}

}
