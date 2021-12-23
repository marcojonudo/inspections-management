import { Constants } from '../../../../utils/constants';
import { RealTimeBudget } from './real-time-budget';
import { Budget } from '../../../orders/budget';

export class RealTimeBudgetCreate extends RealTimeBudget {

	constructor(budgets: Budget[], syncedBudgets: Budget[], budget: Budget, syncedBudget: Budget) {
		super(Constants.REAL_TIME_BUDGET_TYPE.CREATE, budgets, syncedBudgets, budget, syncedBudget);
	}

	check(): boolean {
		return this.findIndex(this.budgets, this.syncedBudget) === -1;
	}

	update(): void {
		this.budgets.push(this.syncedBudget);
	}

}
