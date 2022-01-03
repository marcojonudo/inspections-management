export class Constants {

	static readonly DEFAULT_LANGUAGE: string = 'es';
	static readonly DETECTED_ANOMALIES_CODE = 'AD';
	static readonly EMPLOYEE_CODE_MAX_LENGTH: number = 7;
	static readonly TEXT_ITEM_MAX_LENGTH = 10;

	static readonly LOCAL_STORAGE: any = {
		LANGUAGE: 'language',
		EMPLOYEES: 'employees',
		EMPLOYEE: 'employee',
		ITEM_BUDGETS: 'itemBudgets',
		ITEM_VEHICLE_ARTICLE_CODES: 'itemVehicleArticleCodes',
		CENTRE: 'centre'
	};

	static readonly MESSAGE_CODE: any = {
		EMPLOYEE_NOT_FOUND: 'EMPLOYEE_NOT_FOUND',
		ERROR_SAVING_INSPECTION: 'ERROR_SAVING_INSPECTION',
		SAVED_INSPECTION: 'SAVED_INSPECTION',
		ORDER_WITHOUT_SAVED_INSPECTION: 'ORDER_WITHOUT_SAVED_INSPECTION'
	};

	static readonly TRANSLATION_CODE: any = {
		REQUIRED_EMPLOYEE_CODE: 'requiredEmployeeCode',
		EMPLOYEE_CODE_MIN_LENGTH: 'employeeCodeMinLength'
	};

	static readonly VALIDATION_ERROR: any = {
		REQUIRED: 'required'
	};

	static readonly BUDGET_TYPE: any = {
		URGENT: 'URGENT',
		SECONDARY: 'SECONDARY'
	};

	static readonly BUDGET_STATE: any = {
		O: 'O'
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
		X: 'X',
		E: 'E'
	};

	static readonly INSPECTION_STATE: any = {
		PENDING: 'PENDING',
		STARTED: 'STARTED',
		FINISHED: 'FINISHED'
	};

	static readonly INSPECTION_STATE_ORDER: any = {
		PENDING: 0,
		STARTED: 1,
		FINISHED: 2
	};

	static readonly ITEM_TYPE: any = {
		SELECT: 'SELECT'
	};

	static readonly SELECT_ITEM_OPTION_CODE: any = {
		C: 'C',
		NA: 'NA',
		P: 'P',
		SN: 'SN',
		PS: 'PS'
	};

	public static readonly PATH: any = {
		ROOT: '/',
		HOME: '/home',
		INSPECTION: '/inspection',
	};

	static readonly SNACK_BAR: any = {
		DURATION: 3000,
		TYPE: {
			SUCCESS: 'SUCCESS',
			WARNING: 'WARNING',
			ERROR: 'ERROR'
		}
	};

	static readonly HEADER_CARD: { [key: string]: string } = {
		INFO: 'INFO',
		CENTRE: 'CENTRE',
		VEHICLE: 'VEHICLE'
	};

	static readonly EVENT: any = {
		CLICK: 'click'
	};

	static readonly VEHICLE_TYPE: any = {
		CAR: 'CAR',
		SCOOTER: 'SCOOTER'
	};

}
