import { Budget } from '../../../orders/budget';

export abstract class RealTimeBudget {

	private type: string;
	protected budgets: Budget[];
	protected syncedBudgets: Budget[];
	budget: Budget;
	syncedBudget: Budget;

	protected constructor(type: string, budgets: Budget[], syncedBudgets: Budget[], budget: Budget, syncedBudget: Budget) {
		this.type = type;
		this.budgets = budgets;
		this.syncedBudgets = syncedBudgets;
		this.budget = budget;
		this.syncedBudget = syncedBudget;
	}

	abstract check(): boolean;

	abstract update(): void;

	findIndex(budgets: Budget[], budget: Budget): number {
		return budgets.findIndex(b => b.number === budget.number);
	}

	find(budget: Budget): Budget {
		return this.budgets.find(b => b.number === budget.number);
	}

}
