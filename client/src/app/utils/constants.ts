import { Order } from '../objects/orders/order';
import { OrderInspection } from '../objects/order-inspection';
import { SavedInspection } from '../objects/inspections/saved-inspection';
import { InspectionService } from '../services/inspection.service';
import { ItemBudget } from '../objects/item-budget';
import { SavedItem } from '../objects/inspections/saved-items/saved-item';
import { Budget } from '../objects/orders/budget';

export class Constants {

	static readonly DEFAULT_LANGUAGE: string = 'es';
	static readonly DETECTED_ANOMALIES_CODE = 'AD';
	static readonly EMPLOYEE_CODE_MAX_LENGTH: number = 7;
	static readonly TEXT_ITEM_MAX_LENGTH = 10;
	static readonly ROW_IMAGES = 4;
	static readonly DETECTED_FAULTS_CODE = 'AD';

	static readonly ITEM_CODE: any = {
		C: 'C',
		PN: 'PN',
		EN: 'EN',
		FN: 'FN'
	};

	static readonly TYRE_ITEM_CODES = [Constants.ITEM_CODE.EN, Constants.ITEM_CODE.FN, Constants.ITEM_CODE.PN];

	static readonly LOCAL_STORAGE: any = {
		LANGUAGE: 'language',
		EMPLOYEES: 'employees',
		EMPLOYEE: 'employee',
		SELECT_ITEM_OPTIONS: 'selectItemOptions',
		ITEM_BUDGETS: 'itemBudgets',
		ITEM_VEHICLE_ARTICLE_CODES: 'itemVehicleArticleCodes',
		CENTRE: 'centre',
		RELATIONS: 'relations',
		ITEMS: 'items',
		VERSION: 'version'
	};

	static readonly MESSAGE_CODE: any = {
		EMPLOYEE_NOT_FOUND: 'EMPLOYEE_NOT_FOUND',
		ERROR_SAVING_INSPECTION: 'ERROR_SAVING_INSPECTION',
		SAVED_INSPECTION: 'SAVED_INSPECTION',
		ORDER_WITHOUT_SAVED_INSPECTION: 'ORDER_WITHOUT_SAVED_INSPECTION',
		NOT_FINISHED_SAVED_INSPECTION: 'NOT_FINISHED_SAVED_INSPECTION',
		SENDING_MAIL: 'SENDING_MAIL',
		SENDING_SMS: 'SENDING_SMS',
		SUCCESS_SENDING_MAIL: 'SUCCESS_SENDING_MAIL',
		SUCCESS_SENDING_SMS: 'SUCCESS_SENDING_SMS',
		ERROR_SENDING_MAIL: 'ERROR_SENDING_MAIL',
		ERROR_SENDING_SMS: 'ERROR_SENDING_SMS',
		INCOMPLETE_ITEMS: 'INCOMPLETE_ITEMS'
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
		E: 'E',
		C: 'C'
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
		PS: 'PS',
		RA: 'RA',
	};

	static readonly WRONG_ITEM_OPTIONS: string[] = [
		Constants.SELECT_ITEM_OPTION_CODE.SN, Constants.SELECT_ITEM_OPTION_CODE.PS
	];

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

	static readonly REAL_TIME_UPDATE_TYPE: any = {
		CREATE: 'CREATE',
		DELETE: 'DELETE',
		UPDATE: 'UPDATE'
	};

	static readonly INSPECTIONS_COLUMN_DATA: any = {
		order: (o: Order) => o.code,
		orderNumber: (o: Order) => o.number,
		brand: (o: Order) => o.vehicle.brand,
		model: (o: Order) => o.vehicle.model,
		inspectionType: (o: Order, inspection: OrderInspection) => inspection.inspection,
		inspectionState: (o: Order, inspection: OrderInspection, savedInspection: SavedInspection) =>
			savedInspection ? savedInspection.state : Constants.INSPECTION_STATE.PENDING,
		mechanic: (o: Order, inspection: OrderInspection, savedInspection: SavedInspection) =>
			InspectionService.findMechanicCode(o, savedInspection),
		budgets: (o: Order, inspection: OrderInspection, savedInspection: SavedInspection) =>
			savedInspection ? savedInspection.itemBudgets : []
	};

	static readonly INSPECTION_DETAILS_COLUMN_DATA: any = {
		item: (i: ItemBudget) => i,
		image: (i: ItemBudget, savedItem: SavedItem) => savedItem.findImageId(),
		budgets: (i: ItemBudget, savedItem: SavedItem, budgets: Budget[]) => budgets
	};

	static readonly PENDING_INSPECTION_ORDER_STATES: string[] = [
		Constants.ORDER_STATE.F,
		Constants.ORDER_STATE.C,
		Constants.ORDER_STATE.E
	];

	static readonly CLOSED_ORDER_STATES: string[] = [
		Constants.ORDER_STATE.V,
		Constants.ORDER_STATE.F,
		Constants.ORDER_STATE.X
	];

	static readonly ORIGIN: any = {
		INSPECTIONS_MANAGEMENT: 'INSPECTIONS_MANAGEMENT'
	};

	static readonly REASON: any = {
		SAVED: 'SAVED',
		UPDATED: 'UPDATED',
		SENT: 'SENT'
	};

	static readonly SEND_METHOD: any = {
		MAIL: 'MAIL',
		SMS: 'SMS'
	};

}
