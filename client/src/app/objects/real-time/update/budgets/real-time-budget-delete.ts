import { Constants } from '../../../../utils/constants';
import { RealTimeBudget } from './real-time-budget';
import { Budget } from '../../../orders/budget';

export class RealTimeBudgetDelete extends RealTimeBudget {

	constructor(budgets: Budget[], syncedBudgets: Budget[], budget: Budget) {
		super(Constants.REAL_TIME_BUDGET_TYPE.DELETE, budgets, syncedBudgets, budget, undefined);
	}

	check(): boolean {
		return this.findIndex(this.syncedBudgets, this.budget) === -1;
	}

	update(): void {
		const i = this.findIndex(this.budgets, this.budget);
		this.budgets.splice(i, 1);
	}

}
