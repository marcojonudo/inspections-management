import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, mergeMap, tap } from 'rxjs/operators';
import { forkJoin, from, Observable, of, Subject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { OrdersFilter } from '../objects/filters/orders-filter';
import { TodayOrdersFilter } from '../objects/filters/today-orders-filter';
import { Order } from '../objects/orders/order';
import { ItemVehicleArticleCode } from '../objects/orders/item-vehicle-article-code';
import { ItemBudget } from '../objects/item-budget';
import { BudgetNotification } from '../objects/budget-notification';
import { Budget } from '../objects/orders/budget';
import { OrderInspectionVehicle } from '../objects/order-inspection-vehicle';
import { SavedInspection } from '../objects/inspections/saved-inspection';
import { ListElement } from '../objects/list-elements/list-element';
import { NameElement } from '../objects/list-elements/name-element';
import { Item } from '../objects/inspections/items/item';
import { Category } from '../objects/list-elements/category';
import { Constants } from '../utils/constants';
import { Utils } from '../utils/utils';
import { Url } from '../utils/url';
import { SavedItem } from '../objects/inspections/saved-items/saved-item';
import { Builder } from '../utils/builder';
import { ItemRelation } from '../objects/inspections/item-relation';
import { SelectSavedItem } from '../objects/inspections/saved-items/select-saved-item';
import { CountryHandler } from '../objects/country-info/country-handler';
import { SpainHandler } from '../objects/country-info/spain-handler';
import { PortugalHandler } from '../objects/country-info/portugal-handler';
import { SelectItemOption } from '../objects/inspections/items/select-item-option';
import { SelectItem } from '../objects/inspections/items/select-item';
import { Centre } from '../objects/centre';
import { Employee } from '../objects/employee';
import { EmployeeService } from './employee.service';
import { OrderInspectionHandler } from '../objects/inspection-handler/order-inspection-handler';
import { DetectedFaultsHandler } from '../objects/inspection-handler/detected-faults-handler';
import { InspectionHandler } from '../objects/inspection-handler/inspection-handler';
import * as dayjs from 'dayjs';

@Injectable({
	providedIn: 'root'
})
export class InspectionService {

	static orderInspections: OrderInspectionVehicle[];
	static savedInspections: SavedInspection[];
	static itemBudgets: ItemBudget[];
	static itemVehicleArticleCodes: ItemVehicleArticleCode[];
	static budgetNotifications: BudgetNotification[];
	static selectedOrderInspection: OrderInspectionVehicle;
	static selectedSavedInspection: SavedInspection;
	static countryHandler: CountryHandler;
	static centre: Centre;
	static selectItemOptions: SelectItemOption[];
	static inspectionHandler: InspectionHandler;

	private static readonly LEVEL_ELEMENTS: ((item: Item) => NameElement)[] = [
		(item: Item) => item.vehicleData.garagePosition,
		(item: Item) => item.vehicleData?.vehicleSection
	];

	private static readonly SELECT_ICON_COLOR: { [key: string]: string } = {
		P: '#7b7979',
		C: '#36d23d',
		PS: '#ff6a00',
		SN: '#d23636',
		RA: '#3681d2',
		RR: '#3681d2'
	};

	private static readonly ITEM_RELATION_ACTION: any = {
		HIDE: (targetSavedItem: SelectSavedItem, newValue: string, employeeCode: string) =>
			targetSavedItem.updateHidden(employeeCode, true),
		REPLICATE: (targetSavedItem: SelectSavedItem, newValue: string, employeeCode: string) =>
			targetSavedItem.update(newValue, employeeCode)
	};

	private static readonly ITEM_RELATION_RESTORE_ACTION: any = {
		HIDE: (targetSavedItem: SelectSavedItem, newValue: string, employeeCode: string) =>
			targetSavedItem.updateHidden(employeeCode, false),
		REPLICATE: (targetSavedItem: SelectSavedItem, newValue: string, employeeCode: string) =>
			targetSavedItem.update(Constants.SELECT_ITEM_OPTION_CODE.P, employeeCode)
	};

	static readonly COUNTRY_HANDLER_DECIDER: any = {
		es: new SpainHandler(),
		pt: new PortugalHandler()
	};

	filters: OrdersFilter[];

	selectedOrderInspectionSubject: Subject<OrderInspectionVehicle>;
	selectedOrderInspection$: Observable<OrderInspectionVehicle>;
	budgetNotificationsSubject: Subject<BudgetNotification[]>;
	budgetNotifications$: Observable<BudgetNotification[]>;

	constructor(private http: HttpClient) {
		this.filters = [new TodayOrdersFilter()];

		this.selectedOrderInspectionSubject = new Subject<OrderInspectionVehicle>();
		this.selectedOrderInspection$ = this.selectedOrderInspectionSubject.asObservable();

		this.budgetNotificationsSubject = new Subject<BudgetNotification[]>();
		this.budgetNotifications$ = this.budgetNotificationsSubject.asObservable();

		InspectionService.orderInspections = [];
		InspectionService.savedInspections = [];
		InspectionService.itemVehicleArticleCodes = [];
		InspectionService.budgetNotifications = [];
	}

	static initData(data: any[]): void {
		InspectionService.itemBudgets = this.buildItemBudgets(data[0]);
		InspectionService.itemVehicleArticleCodes = InspectionService.itemVehicleArticleCodes.length ?
			InspectionService.itemVehicleArticleCodes : data[1].map(i => new ItemVehicleArticleCode(i));
		InspectionService.savedInspections = data[2].map(d => Builder.buildSavedInspection(d, InspectionService.itemBudgets));
		InspectionService.budgetNotifications = data[3].map(b => new BudgetNotification(b));
		InspectionService.centre = new Centre(data[4]);
		InspectionService.selectItemOptions = InspectionService.findSelectItemOptions();

		console.log('Item budgets', InspectionService.itemBudgets);
		console.log('Item vehicle article codes', InspectionService.itemVehicleArticleCodes);
		console.log('Saved inspections', InspectionService.savedInspections);
		console.log('Client budget notifications', InspectionService.budgetNotifications);
		console.log('Centre', InspectionService.centre);
	}

	static initOrderInspections(orderInspections: any[]): void {
		InspectionService.orderInspections = orderInspections.map(d => new OrderInspectionVehicle(d)).filter(o => o.inspection);
		console.log('Order inspections', InspectionService.orderInspections);
	}

	static buildItemBudgets(itemBudgets: any[]): ItemBudget[] {
		const savedItemBudgets = LocalStorageService.getItem(Constants.LOCAL_STORAGE.ITEM_BUDGETS);
		if (savedItemBudgets) {
			return savedItemBudgets;
		}
		const builtItemBudgets = itemBudgets.map(i => new ItemBudget(i));
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.ITEM_BUDGETS, builtItemBudgets);
		return builtItemBudgets;
	}

	static findOrderInspection(
		orderNumber: number, orderInspections: OrderInspectionVehicle[] = this.orderInspections
	): OrderInspectionVehicle {
		return orderInspections.find(o => o.order.number === orderNumber);
	}

	static findSavedInspection(
		orderNumber: number, savedInspections: SavedInspection[] = this.savedInspections
	): SavedInspection {
		return savedInspections.find(savedInspection => savedInspection.orderNumber === orderNumber);
	}

	static findOrderItemBudgetType(orderNumber: number): string {
		const orderInspection = this.findOrderInspection(orderNumber);
		const savedInspection = this.findSavedInspection(orderNumber);
		const itemBudgetTypes = savedInspection.itemBudgets.map(itemBudget =>
			this.findItemBudgetType(itemBudget, orderInspection.inspection.vehicle, orderInspection.order.budgets)
		).filter(type => type !== '');
		return this.findItemBudgetsMainType(itemBudgetTypes);
	}

	static findItemBudgetType(itemBudget: ItemBudget, vehicle: string, budgets: Budget[]): string {
		const existentBudget = InspectionService.checkExistentBudget(itemBudget.itemCode, vehicle, budgets);
		return existentBudget ? '' : itemBudget.budgetType;
	}

	static checkExistentBudget(
		itemCode: string,
		vehicle: string,
		budgets: Budget[],
		itemVehicleArticleCodes: ItemVehicleArticleCode[] = this.itemVehicleArticleCodes
	): boolean {
		/* Se buscan los códigos de artículo que corresponden al item erróneo */
		const articleCodes = itemVehicleArticleCodes.filter(itemArticleCode =>
			itemArticleCode.itemCode === itemCode && itemArticleCode.vehicle === vehicle
		).map(itemArticleCode => itemArticleCode.articleCode);
		/* Una vez obtenidos los artículos, se comprueba si alguno de los presupuestos asociados a la orden contiene alguno de
		 * ellos. De ser así, se determinaría que existe presupuesto asociado a la revisión */
		return budgets.find(budget =>
			budget.lines.map(l => l.articleCode).find(articleCode => articleCodes.find(code => code === articleCode))
		) !== undefined;
	}

	static findItemBudgetsMainType(types: string[]): string {
		return Utils.sort(types, (type) => Constants.BUDGET_TYPE_ORDER[type])[0];
	}

	static findBudgetNotifications(
		orderNumber: number, budgetNotifications: BudgetNotification[] = this.budgetNotifications
	): BudgetNotification[] {
		return budgetNotifications.filter(c => c.orderNumber === orderNumber);
	}

	static findAllItemBudgets(type: string = undefined, savedInspections: SavedInspection[] = this.savedInspections): ItemBudget[] {
		const itemBudgets = [];
		savedInspections.forEach(savedInspection => {
			const foundItemBudgets = type ?
				savedInspection.itemBudgets.filter(itemBudget => itemBudget.budgetType === type) :
				savedInspection.itemBudgets;
			itemBudgets.push(...foundItemBudgets);
		});
		return itemBudgets;
	}

	static findPendingItemBudgets(type: string = undefined, savedInspections: SavedInspection[] = this.savedInspections): ItemBudget[] {
		const itemBudgets = [];
		savedInspections.forEach(savedInspection => {
			const orderInspection = this.findOrderInspection(savedInspection.orderNumber);

			const foundItemBudgets = type ?
				savedInspection.itemBudgets.filter(itemBudget => itemBudget.budgetType === type) : savedInspection.itemBudgets;
			const pendingItemBudgets = foundItemBudgets.filter(itemBudget =>
				!this.checkExistentBudget(itemBudget.itemCode, orderInspection.inspection.vehicle, orderInspection.order.budgets)
			);
			itemBudgets.push(...pendingItemBudgets);
		});
		return itemBudgets;
	}

	static findPendingClientContactOrders(savedInspections: SavedInspection[] = this.savedInspections): number[] {
		const pendingContactOrders = [];
		savedInspections.forEach(savedInspection => {
			const pending = InspectionService.findBudgetNotifications(savedInspection.orderNumber).length === 0;
			if (pending) {
				pendingContactOrders.push(savedInspection.orderNumber);
			}
		});
		return pendingContactOrders;
	}

	static findOrdersBudgets(orderInspections: OrderInspectionVehicle[] = this.orderInspections): Budget[] {
		return [].concat(...orderInspections.map(o => o.order).map(o => o.budgets));
	}

	static findBudgetsPrice(budgets: Budget[]): number {
		let price = 0;
		budgets.forEach(budget => {
			budget.lines.filter(l => l.price).forEach(line => {
				price += line.units * line.price;
			});
		});
		return price;
	}

	static findGroupedItems(
		items: any[],
		i: number = 0,
		levelElements: ((item: any) => NameElement)[] = this.LEVEL_ELEMENTS
	): ListElement[] {
		if (i >= levelElements.length) {
			return items;
		}
		const listElements = [];
		items.forEach(item => {
			const levelElem = levelElements[i](item);
			if (levelElem) {
				const existent: Category = listElements.find(elem =>
					elem instanceof Category && (elem as Category).name === levelElem.name
				);
				if (existent) {
					existent.items.push(item);
				} else {
					listElements.push(new Category(levelElem, [item]));
				}
			} else {
				listElements.push(item);
			}
		});
		i += 1;
		const categoryElements = listElements.filter(item => item instanceof Category);
		categoryElements.forEach(categoryElem => {
			categoryElem.items = this.findGroupedItems(categoryElem.items, i);
		});
		return listElements;
	}

	static findIconColor(code: string, selectIconColor: { [key: string]: string } = this.SELECT_ICON_COLOR): string {
		return selectIconColor[code];
	}

	static findImageUrl(image: string): string {
		return `data:image/png;base64,${image}`;
	}

	static findBudget(itemCode: string, budgets: Budget[], itemArticleCodes: ItemVehicleArticleCode[] = this.itemVehicleArticleCodes): Budget {
		return budgets.find(b =>
			b.lines.find(l =>
				itemArticleCodes.find(i => i.articleCode === l.articleCode) !== undefined
			) !== undefined
		);
	}

	static checkAcceptedBudget(budget: Budget): boolean {
		return budget && budget.state === Constants.BUDGET_STATE.O;
	}

	static findSelectItems(savedInspections: SavedInspection[] = this.savedInspections): SelectItem[] {
		const items = [];
		savedInspections.forEach(savedInspection =>
			items.push(...savedInspection.items.filter(i => i.item.type === Constants.ITEM_TYPE.SELECT).map(i => i.item))
		);
		return items;
	}

	static findSelectItemOptions(): SelectItemOption[] {
		const options = [];
		this.findSelectItems().forEach((item: SelectItem) => {
			item.options.forEach((option: SelectItemOption) => {
				const existent = options.find(o => o.code === option.code);
				if (!existent) {
					options.push(option);
				}
			});
		});
		return options;
	}

	static checkWrongSelectValue(value: string): boolean {
		return value === Constants.SELECT_ITEM_OPTION_CODE.SN || value === Constants.SELECT_ITEM_OPTION_CODE.PS;
	}

	static updateItem(
		savedItem: SavedItem,
		item: Item,
		value: string,
		savedInspection: SavedInspection,
		employee: Employee = EmployeeService.employee
	): Observable<ItemRelation> {
		/* Antes de actualizar el valor, se debe comprobar si hay alguna relación que deshacer. Por ejemplo, al tener
		 * 'Pastilla de freno' el valor 'No aplica', el espesor está oculto; sin embargo, en cuanto se actualiza el
		 * valor de la primera, el segundo debe volver a aparecer (se está deshaciendo la relación) */
		this.updateRelations(
			savedItem, savedItem.findValue(), item.relations, this.ITEM_RELATION_RESTORE_ACTION, savedInspection
		).subscribe();
		savedItem.update(value, employee.code);

		return this.updateRelations(savedItem, savedItem.findValue(), item.relations, this.ITEM_RELATION_ACTION, savedInspection).pipe(
			finalize(() => {
				LocalStorageService.setItem(Constants.LOCAL_STORAGE.SAVED_INSPECTION, savedInspection);
			})
		);
	}

	static updateRelations(
		savedItem: SavedItem, value: string, relations: ItemRelation[], actions: any, savedInspection: SavedInspection
	): Observable<ItemRelation> {
		return from(relations).pipe(
			tap(itemRelation => InspectionService.handleRelation(savedItem, value, itemRelation, actions, savedInspection))
		);
	}

	static handleRelation(
		savedItem: SavedItem,
		value: string,
		itemRelation: ItemRelation,
		actions: any,
		savedInspection: SavedInspection,
		employee: Employee = EmployeeService.employee
	): void {
		if (value === itemRelation.matchText) {
			const targetSavedItem = savedInspection.items.find(i => i.item.code === itemRelation.targetItem.code);
			actions[itemRelation.action](targetSavedItem, savedItem.findValue(), employee.code);
		}
	}

	findLanguage(): Observable<string> {
		const language = LocalStorageService.getItem(Constants.LOCAL_STORAGE.LANGUAGE);
		return (language ? of(language) : this.http.get(Url.language(), { responseType: 'text' })).pipe(
			catchError(() => of(Constants.DEFAULT_LANGUAGE)),
			tap((lang: string) => {
				InspectionService.countryHandler = InspectionService.COUNTRY_HANDLER_DECIDER[lang];
				LocalStorageService.setItem(Constants.LOCAL_STORAGE.LANGUAGE, lang);
				console.log('Language', lang);
			})
		);
	}

	loadMainInfo(filters: OrdersFilter[] = this.filters): Observable<any> {
		let openedOrders = [];
		return this.findOrders(filters).pipe(
			mergeMap(orders => {
				openedOrders = orders.filter(o => o.state !== Constants.ORDER_STATE.F);
				console.log('Opened orders', openedOrders);

				if (openedOrders.length) {
					const orderNumbers = openedOrders.map(o => o.number);
					const budgetNotificationsUrl = `${Url.budgetNotification()}?orderNumbers=${orderNumbers.join('&orderNumbers=')}`;
					return forkJoin([
						this.findItemBudgets(),
						this.findItemVehicleArticleCodes(),
						this.http.post(Url.savedInspections(), orderNumbers),
						this.http.get(budgetNotificationsUrl),
						this.findCentre()
					]);
				} else {
					return of([]);
				}
			}),
			mergeMap(data => {
				console.log('Received data', data);
				if (data.length) {
					InspectionService.initData(data);
					/* Una vez obtenidas las revisiones guardadas, se puede comprobar qué números de orden tienen asociada una revisión de
					 * anomalías detectadas */
					const detectedAnomaliesOrders = InspectionService.savedInspections.filter(i => !i.orderInspection).map(i =>
						openedOrders.find(o => o.number === i.orderNumber)
					);
					const body = { openedOrders, detectedAnomaliesOrders };
					return this.http.post(Url.inspections(), body);
				}
				return of([]);
			}),
			tap(orderInspections => {
				if (orderInspections.length) {
					InspectionService.initOrderInspections(orderInspections);
				}
			})
		);
	}

	findCentre(): Observable<any> {
		const savedCentre = LocalStorageService.getItem(Constants.LOCAL_STORAGE.CENTRE);
		return savedCentre ? of(savedCentre) : this.http.get(Url.centre());
	}

	findItemBudgets(): Observable<any> {
		const savedItemBudgets = LocalStorageService.getItem(Constants.LOCAL_STORAGE.ITEM_BUDGETS);
		return savedItemBudgets ? of(savedItemBudgets) : this.http.get(Url.itemBudgets());
	}

	findItemVehicleArticleCodes(): Observable<any> {
		const savedItemArticleCodes = LocalStorageService.getItem(Constants.LOCAL_STORAGE.ITEM_VEHICLE_ARTICLE_CODES);
		return savedItemArticleCodes ? of(savedItemArticleCodes) : this.http.get(Url.articleItems());
	}

	findOrders(filters: OrdersFilter[]): Observable<any> {
		const requests = filters.map(f =>
			this.http.get(Url.orders(), { params: { day: f.day.format(Constants.DATE_FORMAT.yyyy_MM_dd), to: `${ f.to }` } })
		);
		return forkJoin(requests).pipe(
			map(data => {
				console.log('Received orders info', data);
				const orders = [].concat(...data).map(o => new Order(o));
				console.log('Orders', orders);
				return orders;
			})
		);
	}

	checkSelectedOrder(orderNumber: number, orderInspection: OrderInspectionVehicle = InspectionService.selectedOrderInspection): boolean {
		return orderInspection && orderInspection.order.number === orderNumber;
	}

	selectOrder(orderNumber: number): boolean {
		let existentSavedInspection = false;
		InspectionService.selectedOrderInspection = InspectionService.findOrderInspection(orderNumber);
		InspectionService.selectedSavedInspection = InspectionService.findSavedInspection(orderNumber);
		if (InspectionService.selectedSavedInspection) {
			InspectionService.inspectionHandler = InspectionService.selectedSavedInspection.orderInspection ?
				new OrderInspectionHandler() : new DetectedFaultsHandler();
			this.selectedOrderInspectionSubject.next(InspectionService.selectedOrderInspection);
			existentSavedInspection = true;
		}
		return existentSavedInspection;
	}

	createBudgetNotification(orderNumber: number, itemCodes: string[]): Observable<any> {
		const budgetNotifications = itemCodes.map(itemCode => new BudgetNotification({ orderNumber, itemCode }));
		InspectionService.budgetNotifications.push(...budgetNotifications);
		this.budgetNotificationsSubject.next(InspectionService.budgetNotifications);
		return this.http.post(Url.budgetNotification(), budgetNotifications);
	}

	deleteBudgetNotification(orderNumber: number): Observable<any> {
		return this.http.delete(Url.budgetNotification(), { params: { orderNumber: `${orderNumber}` } }).pipe(
			tap(() => {
				InspectionService.budgetNotifications = InspectionService.budgetNotifications.filter(budgetNotification =>
					budgetNotification.orderNumber !== orderNumber
				);
				this.budgetNotificationsSubject.next(InspectionService.budgetNotifications);
			})
		);
	}

	saveInspection(
		savedInspection: SavedInspection = InspectionService.selectedSavedInspection,
		handler: InspectionHandler = InspectionService.inspectionHandler,
		employee: Employee = EmployeeService.employee
	): Observable<any> {
		const body = handler.findSavedInspection(savedInspection);
		body.sellerCode = employee.code;
		body.saved = dayjs();
		console.log('Saving inspection', body);
		return this.http.patch(Url.savedInspection(), body);
	}

}
