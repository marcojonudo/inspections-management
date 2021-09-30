export class Constants {

	static readonly DEFAULT_LANGUAGE: string = 'es';

	static readonly LOCAL_STORAGE: any = {
		LANGUAGE: 'language',
		EMPLOYEES: 'employees'
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

	static readonly ORDER_STATE: any = {
		V: 'V',
		F: 'F',
		X: 'X'
	};

	static readonly INSPECTION_STATE: any = {
		FINISHED: 'FINISHED'
	};

	static readonly ITEM_TYPE: any = {
		SELECT: 'SELECT'
	};

	static readonly SELECT_ITEM_OPTION_CODE: any = {
		C: 'C'
	};


}
