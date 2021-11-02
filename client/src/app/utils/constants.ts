export class Constants {

	static readonly DEFAULT_LANGUAGE: string = 'es';
	static readonly DETECTED_ANOMALIES_CODE = 'AD';

	static readonly LOCAL_STORAGE: any = {
		LANGUAGE: 'language',
		EMPLOYEES: 'employees',
		ITEM_BUDGETS: 'itemBudgets'
	};

	static readonly BUDGET_TYPE: any = {
		URGENT: 'URGENT',
		SECONDARY: 'SECONDARY'
	};

	static readonly BUDGET_TYPE_ORDER: any = {
		URGENT: 0,
		SECONDARY: 1
	};

	static readonly DATE_FORMAT: any = {
		yyyy_MM_dd: 'YYYY-MM-DD'
	};

	static readonly DATE_TIME_FORMAT: any = {
		yyyy_MM_dd_HH_mm_ss: 'YYYY-MM-DD HH:mm:ss'
	};

	static readonly ORDER_STATE: any = {
		V: 'V',
		F: 'F',
		X: 'X'
	};

	static readonly INSPECTION_STATE: any = {
		PENDING: 'PENDING',
		STARTED: 'STARTED',
		FINISHED: 'FINISHED'
	};

	static readonly ITEM_TYPE: any = {
		SELECT: 'SELECT'
	};

	static readonly SELECT_ITEM_OPTION_CODE: any = {
		C: 'C',
		NA: 'NA'
	};

	public static readonly PATH: any = {
		INSPECTION: '/inspection',
	};

}
