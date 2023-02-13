import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, concatMap, filter, finalize, map, mergeMap, tap } from 'rxjs/operators';
import { forkJoin, from, Observable, of, Subject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { OrdersFilter } from '../objects/filters/orders-filter';
import { TodayOrdersFilter } from '../objects/filters/today-orders-filter';
import { Order } from '../objects/orders/order';
import { ItemVehicleArticleCode } from '../objects/orders/item-vehicle-article-code';
import { ItemBudget } from '../objects/item-budget';
import { BudgetNotification } from '../objects/budget-notification';
import { Budget } from '../objects/orders/budget';
import { OrderInspection } from '../objects/order-inspection';
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
import { CountryHandler } from '../objects/country-info/country-handler';
import { SelectItemOption } from '../objects/inspections/items/select-item-option';
import { SelectItem } from '../objects/inspections/items/select-item';
import { Centre } from '../objects/centre';
import { Employee } from '../objects/employee';
import { EmployeeService } from './employee.service';
import { OrderInspectionHandler } from '../objects/inspection-handler/order-inspection-handler';
import { DetectedFaultsHandler } from '../objects/inspection-handler/detected-faults-handler';
import { InspectionHandler } from '../objects/inspection-handler/inspection-handler';
import { InspectionsColumn } from '../components/inspections/inspections.component';
import { InspectionDetailsColumn } from '../components/inspection-details/inspection-details.component';
import { TextSavedItemDataField } from '../objects/inspections/saved-items/text-saved-item-data-field';
import { CountryHandlerType } from '../objects/country-info/country-handler-type';
import { MatDialog } from '@angular/material/dialog';
import { EmailDialogComponent } from '../components/email-dialog/email-dialog.component';
import { SnackBarService } from './snack-bar.service';
import { GroupedItemOptions } from '../objects/inspections/items/grouped-item-options';
import { ItemType } from '../objects/inspections/items/item-type';
import { SmsDialogComponent } from '../components/sms-dialog/sms-dialog.component';
import * as dayjs from 'dayjs';
import { SavedInspectionData } from '../objects/inspections/saved-inspection-data';
import { Dayjs } from 'dayjs';

@Injectable({
	providedIn: 'root'
})
export class InspectionService {

	static orders: Order[];
	static openedOrders: Order[];
	static detectedAnomaliesOrders: Order[];
	static orderInspections: OrderInspection[];
	static savedInspections: SavedInspection[];
	static itemBudgets: ItemBudget[];
	static itemVehicleArticleCodes: ItemVehicleArticleCode[];
	static budgetNotifications: BudgetNotification[];
	static selectedOrderInspection: OrderInspection;
	static selectedSavedInspection: SavedInspection;
	static countryHandler: CountryHandler;
	static centre: Centre;
	static selectItemOptions: SelectItemOption[];
	static groupedItemOptions: GroupedItemOptions[];
	static inspectionHandler: InspectionHandler;
	static relations: ItemRelation[];
	static items: Item[];

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
		RR: '#3681d2',
		NA: '#000'
	};

	private static readonly ITEM_RELATION_ACTION: any = {
		HIDE: (targetSavedItem: SavedItem, newValue: string, employeeCode: string) =>
			targetSavedItem.updateHidden(employeeCode, true),
		REPLICATE: (targetSavedItem: SavedItem, newValue: string, employeeCode: string) =>
			targetSavedItem.update(newValue, employeeCode)
	};

	private static readonly ITEM_RELATION_RESTORE_ACTION: any = {
		HIDE: (targetSavedItem: SavedItem, newValue: string, employeeCode: string) =>
			targetSavedItem.updateHidden(employeeCode, false),
		REPLICATE: (targetSavedItem: SavedItem, newValue: string, employeeCode: string) =>
			targetSavedItem.update(Constants.SELECT_ITEM_OPTION_CODE.P, employeeCode)
	};

	filters: OrdersFilter[];

	selectedOrderInspectionSubject: Subject<OrderInspection>;
	selectedOrderInspection$: Observable<OrderInspection>;
	inspectionsTriggerSubject: Subject<void>;
	inspectionsTrigger$: Observable<void>;

	constructor(private http: HttpClient, private dialog: MatDialog, private snackBarService: SnackBarService) {
		this.filters = [new TodayOrdersFilter()];

		this.selectedOrderInspectionSubject = new Subject<OrderInspection>();
		this.selectedOrderInspection$ = this.selectedOrderInspectionSubject.asObservable();

		this.inspectionsTriggerSubject = new Subject<void>();
		this.inspectionsTrigger$ = this.inspectionsTriggerSubject.asObservable();

		InspectionService.orderInspections = [];
		InspectionService.savedInspections = [];
		InspectionService.itemVehicleArticleCodes = [];
		InspectionService.budgetNotifications = [];
	}

	static initData(data: any[]): void {
		this.buildSelectItemOptions(data[0]);
		InspectionService.itemBudgets = this.buildItemBudgets(data[1]);
		InspectionService.itemVehicleArticleCodes = InspectionService.itemVehicleArticleCodes.length ?
			InspectionService.itemVehicleArticleCodes : data[2].map(i => new ItemVehicleArticleCode(i));
		InspectionService.savedInspections = data[3].map(d => Builder.buildSavedInspection(d));
		InspectionService.budgetNotifications = data[4].map(b => new BudgetNotification(b));
		InspectionService.centre = new Centre(data[5]);

		console.log('Item budgets', InspectionService.itemBudgets);
		console.log('Item vehicle article codes', InspectionService.itemVehicleArticleCodes);
		console.log('Saved inspections', InspectionService.savedInspections);
		console.log('Client budget notifications', InspectionService.budgetNotifications);
		console.log('Centre', InspectionService.centre);
	}

	static buildSelectItemOptions(options: any[]): void {
		this.selectItemOptions = [];
		this.groupedItemOptions = [];
		options.forEach(option => {
			const existent = this.groupedItemOptions.find(o => o.itemCode === option.itemCode);
			if (existent) {
				existent.add(new SelectItemOption(option.option));
			} else {
				this.groupedItemOptions.push(new GroupedItemOptions(option.itemCode, option.option));
			}

			const existentOption = this.selectItemOptions.find(o => o.code === option.option.code);
			if (!existentOption) {
				this.selectItemOptions.push(new SelectItemOption(option.option));
			}
		});
	}

	static initOrderInspections(orderInspections: any[]): void {
		InspectionService.orderInspections = orderInspections.map(d => new OrderInspection(d)).filter(o => o.inspection);
		console.log('Order inspections', InspectionService.orderInspections);
	}

	static filterOrderInspections(
		orderInspections: OrderInspection[] = this.orderInspections, detectedAnomaliesOrders: Order[] = this.detectedAnomaliesOrders
	): OrderInspection[] {
		return orderInspections.filter(o => {
			const correctOrder = this.checkOpenedOrder(o.order) && o.order.keys;
			if (!correctOrder) { return false; }

			const detectedAnomaliesOrder = detectedAnomaliesOrders.find(order => order.number === o.order.number);
			return detectedAnomaliesOrder ? true : o.inspection !== undefined;
		});
	}

	static checkOpenedOrder(order: Order): boolean {
		return Constants.CLOSED_ORDER_STATES.find(s => s === order.state) === undefined;
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

	static filterItemBudgets(savedItems: SavedItem[], itemBudgets: ItemBudget[] = this.itemBudgets): ItemBudget[] {
		return itemBudgets.filter(itemBudget => {
			const item = savedItems.find(savedItem =>
				savedItem.type === Constants.ITEM_TYPE.SELECT && savedItem.code === itemBudget.itemCode
			);
			return item && item.findFilled() && InspectionService.checkWrongSelectValue(item.findValue());
		});
	}

	static findOrder(orderNumber: number, orders: Order[] = this.openedOrders): Order {
		return orders.find(o => o.number === orderNumber);
	}

	static findOrderInspection(
		orderNumber: number, orderInspections: OrderInspection[] = this.orderInspections
	): OrderInspection {
		return orderInspections.find(o => o.order.number === orderNumber);
	}

	static findSavedInspection(
		orderNumber: number, savedInspections: SavedInspection[] = this.savedInspections
	): SavedInspection {
		return savedInspections.find(savedInspection => savedInspection.orderNumber === orderNumber);
	}

	static findOrderItemBudgetType(orderNumber: number, accepted: boolean = undefined): string {
		const orderInspection = this.findOrderInspection(orderNumber);
		const savedInspection = this.findSavedInspection(orderNumber);
		const itemBudgetTypes = savedInspection ? savedInspection.itemBudgets.map(itemBudget =>
			this.findItemBudgetType(itemBudget, orderInspection.inspection.vehicle, orderInspection.order.budgets, accepted)
		).filter(type => type !== '') : [];
		return this.findItemBudgetsMainType(itemBudgetTypes);
	}

	static findItemBudgetType(itemBudget: ItemBudget, vehicle: string, budgets: Budget[], accepted: boolean): string {
		const existentBudget = InspectionService.findExistentBudget(itemBudget.itemCode, vehicle, budgets) !== undefined;
		return existentBudget && !accepted ? '' : itemBudget.budgetType;
	}

	static findItemArticles(
		itemCode: string,
		vehicle: string,
		itemVehicleArticleCodes: ItemVehicleArticleCode[] = this.itemVehicleArticleCodes
	): number[] {
		return itemVehicleArticleCodes.filter(itemArticleCode =>
			itemArticleCode.itemCode === itemCode && itemArticleCode.vehicle === vehicle
		).map(itemArticleCode => itemArticleCode.articleCode);
	}

	static findArticlesBudget(articles: number[], budgets: Budget[]): Budget {
		return budgets.find(budget =>
			budget.lines.map(l => l.articleCode).find(articleCode => articles.find(code => code === articleCode))
		);
	}

	static findExistentBudget(itemCode: string, vehicle: string, budgets: Budget[]): Budget {
		/* Se buscan los códigos de artículo que corresponden al item erróneo */
		const articleCodes = this.findItemArticles(itemCode, vehicle);
		/* Una vez obtenidos los artículos, se comprueba si alguno de los presupuestos asociados a la orden contiene alguno de
		 * ellos. De ser así, se determinaría que existe presupuesto asociado a la revisión */
		return this.findArticlesBudget(articleCodes, budgets);
	}

	static findItemBudgetsMainType(types: string[]): string {
		return Utils.sort(types, (type) => Constants.BUDGET_TYPE_ORDER[type])[0];
	}

	static findBudgetNotifications(
		orderNumber: number, budgetNotifications: BudgetNotification[] = this.budgetNotifications
	): BudgetNotification[] {
		return budgetNotifications.filter(c => c.orderNumber === orderNumber);
	}

	static findAllItemBudgets(type: string = undefined, orderInspections: OrderInspection[] = this.orderInspections): ItemBudget[] {
		const itemBudgets = [];
		orderInspections.forEach(orderInspection => {
			const savedInspection = orderInspection.inspection ?
				InspectionService.findSavedInspection(orderInspection.order.number) : undefined;
			if (savedInspection) {
				const foundItemBudgets = type ?
					savedInspection.itemBudgets.filter(itemBudget => itemBudget.budgetType === type) :
					savedInspection.itemBudgets;
				itemBudgets.push(...foundItemBudgets);
			}
		});
		return itemBudgets;
	}

	static findPendingItemBudgets(type: string = undefined, savedInspections: SavedInspection[] = this.savedInspections): ItemBudget[] {
		const itemBudgets = [];
		savedInspections.forEach(savedInspection => {
			const order = this.findOrder(savedInspection.orderNumber);

			const foundItemBudgets = type ?
				savedInspection.itemBudgets.filter(itemBudget => itemBudget.budgetType === type) : savedInspection.itemBudgets;
			const pendingItemBudgets = foundItemBudgets.filter(itemBudget =>
				this.findExistentBudget(itemBudget.itemCode, savedInspection.vehicle, order.budgets) === undefined
			);
			itemBudgets.push(...pendingItemBudgets);
		});
		return itemBudgets;
	}

	static findPendingClientContactOrders(savedInspections: SavedInspection[] = this.savedInspections): Order[] {
		const pendingContactOrders = [];
		/* Se obtienen sólo aquellas revisiones que estén finalizadas y tengan algún item mal */
		savedInspections
			.filter(s => s.state === Constants.INSPECTION_STATE.FINISHED)
			.filter(s => {
				/* Si hay algún item mal, la revisión debe contar */
				if (s.itemBudgets.length > 0) {
					return true;
				}
				/* Si los items están bien, pero la revisión tiene comentarios, también debe contar */
				const comments = s.items.find(i => i.code === Constants.ITEM_CODE.C)?.findValue();
				return comments !== undefined && comments !== '';
			})
			.forEach(savedInspection => {
				const order = this.findOrder(savedInspection.orderNumber);
				/* Si no existe order, significa que ya está vendida, por lo que no se debe contar */
				if (order) {
					const pending = InspectionService.findBudgetNotifications(savedInspection.orderNumber).length === 0;
					if (pending) {
						pendingContactOrders.push(order);
					}
				}
		});
		return pendingContactOrders;
	}

	static findOrdersBudgets(orderInspections: OrderInspection[] = this.orderInspections): Budget[] {
		const filteredOrderInspections = orderInspections.filter(orderInspection =>
			orderInspection.inspection ? InspectionService.findSavedInspection(orderInspection.order.number) : undefined
		);
		return [].concat(...filteredOrderInspections.map(o => o.order).map(o => o.budgets));
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
		return selectIconColor[code || Constants.SELECT_ITEM_OPTION_CODE.NA];
	}

	static findImageUrl(image: string): string {
		return `data:image/png;base64,${image}`;
	}

	static findBudgets(
		itemCode: string,
		vehicle: string,
		budgets: Budget[],
		itemVehicleArticleCodes: ItemVehicleArticleCode[] = this.itemVehicleArticleCodes
	): Budget[] {
		const itemArticleCodes = itemVehicleArticleCodes.filter(i => i.vehicle === vehicle && i.itemCode === itemCode);
		return budgets.filter(b =>
			b.lines.find(l =>
				itemArticleCodes.find(i => i.articleCode === l.articleCode) !== undefined
			) !== undefined
		);
	}
	static findSelectItems(savedInspections: SavedInspection[] = this.savedInspections): SelectItem[] {
		const items = [];
		savedInspections.forEach(savedInspection =>
			items.push(...savedInspection.items.filter(i => i.type === Constants.ITEM_TYPE.SELECT).map(i => i.item))
		);
		return items;
	}

	static findRelations(itemCode: string, relations: ItemRelation[] = InspectionService.relations): ItemRelation[] {
		return relations.filter(r => r.itemCode === itemCode);
	}

	static checkAcceptedBudget(budget: Budget): boolean {
		return budget && budget.state === Constants.BUDGET_STATE.O;
	}

	static checkWrongSelectValue(value: string): boolean {
		return value === Constants.SELECT_ITEM_OPTION_CODE.SN || value === Constants.SELECT_ITEM_OPTION_CODE.PS;
	}

	static buildInspectionsRow(order: Order, columnsData: any): InspectionsColumn {
		const inspection = InspectionService.findOrderInspection(order.number);
		let row = undefined;
		if (inspection) {
			const allColumns = Object.keys(columnsData);
			const savedInspection = InspectionService.findSavedInspection(order.number);
			row = {};
			allColumns.forEach(key => {
				const handler = columnsData[key];
				if (handler) {
					row[key] = handler(order, inspection, savedInspection);
				}
			});
		}
		return row;
	}

	static sortInspectionsRows(rows: InspectionsColumn[]): InspectionsColumn[] {
		return rows.sort((a, b) => {
			let aType = this.findOrderItemBudgetType(a.orderNumber, false);
			let bType = this.findOrderItemBudgetType(b.orderNumber, false);
			if (!aType && !bType) {
				aType = this.findOrderItemBudgetType(a.orderNumber, true);
				bType = this.findOrderItemBudgetType(b.orderNumber, true);
				if (!aType && !bType) {
					const aState = InspectionService.findSavedInspection(a.orderNumber)?.state;
					const bState = InspectionService.findSavedInspection(b.orderNumber)?.state;
					if (aState && bState) {
						const aStateOrder = this.findInspectionsRowOrder(aState, Constants.INSPECTION_STATE_ORDER);
						const bStateOrder = this.findInspectionsRowOrder(bState, Constants.INSPECTION_STATE_ORDER);
						return aStateOrder < bStateOrder ? 1 : (aStateOrder > bStateOrder ? -1 : 0);
					} else if (aState) {
						return -1;
					} else if (bState) {
						return 1;
					} else {
						return this.compareCodeNumbers(a, b);
					}
				}
			}
			const aOrder = this.findInspectionsRowOrder(aType, Constants.BUDGET_TYPE_ORDER);
			const bOrder = this.findInspectionsRowOrder(bType, Constants.BUDGET_TYPE_ORDER);
			if (aOrder === bOrder) {
				return this.compareCodeNumbers(a, b);
			}
			return aOrder < bOrder ? -1 : (aOrder > bOrder ? 1 : 0);
		});
	}

	static compareCodeNumbers(a: InspectionsColumn, b: InspectionsColumn): number {
		const aCodeNumber = this.findCodeNumber(a.order);
		const bCodeNumber = this.findCodeNumber(b.order);
		return aCodeNumber < bCodeNumber ? -1 : (aCodeNumber > bCodeNumber ? 1 : 0);
	}

	static findInspectionsRowOrder(type: string, orderMap: any): number {
		return orderMap[type] !== undefined ? orderMap[type] : 10;
	}

	static findCodeNumber(orderCode: string): number {
		return parseInt(orderCode.startsWith('C') ? orderCode.substring(1) : orderCode, 10);
	}

	static buildInspectionDetailsRow(
		itemBudget: ItemBudget,
		orderInspection: OrderInspection = this.selectedOrderInspection,
		savedItems: SavedItem[] = this.selectedSavedInspection.items,
		columnsData: any = Constants.INSPECTION_DETAILS_COLUMN_DATA
	): InspectionDetailsColumn {
		let row = undefined;
		const allColumns = Object.keys(columnsData);
		const savedItem = savedItems.find(i => i.code === itemBudget.itemCode);
		const budgets = InspectionService.findBudgets(
			itemBudget.itemCode, orderInspection.inspection.vehicle, orderInspection.order.budgets
		);
		row = {};
		allColumns.forEach(key => {
			row[key] = columnsData[key](itemBudget, savedItem, budgets);
		});
		return row;
	}

	static findMechanicCode(order: Order, savedInspection: SavedInspection): string {
		let mechanicCode;
		if (savedInspection) {
			mechanicCode = savedInspection.findMechanic() || this.findItemsMechanicCode(savedInspection.items);
		}
		return mechanicCode ? mechanicCode : order.mechanicCode;
	}

	static findItemsMechanicCode(items: SavedItem[]): string {
		const maxFilled = Math.max(...items.map(i => i.findFilled().valueOf()));
		const maxFilledItem = items.find(i => i.findFilled().valueOf() === maxFilled);
		return maxFilledItem.findEmployeeCode();
	}

	static updateSelectItem(
		savedItem: SavedItem,
		value: string,
		savedInspection: SavedInspection,
		employee: Employee = EmployeeService.employee
	): Observable<ItemRelation> {
		const relations = this.findRelations(savedItem.code);
		/* Antes de actualizar el valor, se debe comprobar si hay alguna relación que deshacer. Por ejemplo, al tener
		 * 'Pastilla de freno' el valor 'No aplica', el espesor está oculto; sin embargo, en cuanto se actualiza el
		 * valor de la primera, el segundo debe volver a aparecer (se está deshaciendo la relación) */
		this.updateRelations(
			savedItem, savedItem.findValue(), relations, this.ITEM_RELATION_RESTORE_ACTION, savedInspection
		).subscribe();
		savedItem.findData(employee.code).update(value, employee.code);

		return this.updateRelations(savedItem, savedItem.findValue(), relations, this.ITEM_RELATION_ACTION, savedInspection).pipe(
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
			const targetSavedItem = savedInspection.items.find(i => i.code === itemRelation.targetItemCode);
			actions[itemRelation.action](targetSavedItem, savedItem.findValue(), employee.code);
		}
	}

	static updateTextItem(
		savedItem: SavedItem,
		fields: TextSavedItemDataField[],
		savedInspection: SavedInspection,
		employee: Employee = EmployeeService.employee
	): void {
		savedItem.update(fields, employee.code);
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.SAVED_INSPECTION, savedInspection);
	}

	static updateTextAreaItem(
		savedItem: SavedItem,
		text: string,
		savedInspection: SavedInspection,
		employee: Employee = EmployeeService.employee
	): void {
		savedItem.update(text, employee.code);
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.SAVED_INSPECTION, savedInspection);
	}

	static findSentDate(savedInspection: SavedInspection): Dayjs {
		const sentData = savedInspection.data.filter(d => d.sendMethod);
		return sentData ? dayjs.max(sentData.map(d => d.saved)) : undefined;
	}

	static findIncompleteItems(savedInspection: SavedInspection, items: Item[]): SavedItem[] {
		/* Para comprobar si una categoría está completa, se tienen en cuenta sólo aquellos items obligatorios */
		const itemNames = items.filter(item => item.required).map(item => item.name);

		/* Tampoco se tienen en cuenta aquellos items ocultos */
		const savedItems = savedInspection.items.filter(savedItem =>
			!savedItem.isHidden() && itemNames.find(name => name === savedItem.item.name)
		);
		return savedItems.filter(savedItem => !savedItem.isFilled());
	}

	findLanguage(): Observable<string> {
		const language = LocalStorageService.getItem(Constants.LOCAL_STORAGE.LANGUAGE);
		return (language ? of(language) : this.http.get(Url.languages(), { responseType: 'text' })).pipe(
			catchError(() => of(Constants.DEFAULT_LANGUAGE)),
			tap((lang: string) => {
				InspectionService.countryHandler = CountryHandlerType.parse(lang).handler;
				LocalStorageService.setItem(Constants.LOCAL_STORAGE.LANGUAGE, lang);
				console.log('Language', lang);
			})
		);
	}

	loadMainInfo(filters: OrdersFilter[] = this.filters): Observable<any> {
		return this.findOrders(filters).pipe(
			mergeMap(orders => {
				InspectionService.orders = orders;
				InspectionService.openedOrders = orders.filter(o => Constants.CLOSED_ORDER_STATES.find(s => s === o.state) === undefined);
				console.log('All orders', InspectionService.orders);
				console.log('Opened orders', InspectionService.openedOrders);

				if (InspectionService.orders.length) {
					const orderNumbers = InspectionService.orders.map(o => o.number);
					const budgetNotificationsUrl = `${Url.budgetNotification()}?orderNumbers=${orderNumbers.join('&orderNumbers=')}`;
					return forkJoin([
						this.findSelectItemOptions(),
						this.findItemBudgets(),
						this.findItemVehicleArticleCodes(),
						this.http.post(Url.savedInspections(), InspectionService.orders),
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
					InspectionService.detectedAnomaliesOrders = InspectionService.savedInspections.filter(i => !i.orderInspection).map(i =>
						InspectionService.orders.find(o => o.number === i.orderNumber)
					);
					const body = { orders: InspectionService.orders, detectedAnomaliesOrders: InspectionService.detectedAnomaliesOrders };
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

	findCentre(): Observable<string> {
		const centre = LocalStorageService.getItem(Constants.LOCAL_STORAGE.CENTRE);
		return (centre ? of(centre) : this.http.get(Url.centres())).pipe(
			tap(c => {
				InspectionService.centre = new Centre(c);
				LocalStorageService.setItem(Constants.LOCAL_STORAGE.CENTRE, InspectionService.centre);
				console.log('Centre', InspectionService.centre);
			})
		);
	}

	findRelations(): Observable<string> {
		const rel = LocalStorageService.getItem(Constants.LOCAL_STORAGE.RELATIONS);
		return (rel ? of(rel) : this.http.get(Url.itemRelations())).pipe(
			tap(relations => {
				InspectionService.relations = relations.map(r => new ItemRelation(r));
				LocalStorageService.setItem(Constants.LOCAL_STORAGE.RELATIONS, InspectionService.relations);
				console.log('Item relations', InspectionService.relations);
			})
		);
	}

	findItems(): Observable<string> {
		const items = LocalStorageService.getItem(Constants.LOCAL_STORAGE.ITEMS);
		return (items ? of(items) : this.http.get(Url.items())).pipe(
			tap(i => {
				InspectionService.items = i.map(item => ItemType.parse(item.type).buildItem(item));
				LocalStorageService.setItem(Constants.LOCAL_STORAGE.ITEMS, InspectionService.items);
				console.log('Items', InspectionService.items);
			})
		);
	}

	findSelectItemOptions(): Observable<any> {
		const options = LocalStorageService.getItem(Constants.LOCAL_STORAGE.SELECT_ITEM_OPTIONS);
		return options ? of(options) : this.http.get(Url.selectItemOptions());
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

	checkSelectedOrder(orderNumber: number, orderInspection: OrderInspection = InspectionService.selectedOrderInspection): boolean {
		return orderInspection && orderInspection.order.number === orderNumber;
	}

	selectInspection(orderNumber: number): SavedInspection {
		InspectionService.selectedOrderInspection = InspectionService.findOrderInspection(orderNumber);
		InspectionService.selectedSavedInspection = InspectionService.findSavedInspection(orderNumber);
		if (InspectionService.selectedSavedInspection?.items?.length) {
			InspectionService.inspectionHandler = InspectionService.selectedSavedInspection.orderInspection ?
				new OrderInspectionHandler() : new DetectedFaultsHandler();
			this.selectedOrderInspectionSubject.next(InspectionService.selectedOrderInspection);
		}
		return InspectionService.selectedSavedInspection;
	}

	createBudgetNotification(orderNumber: number, itemCodes: string[]): Observable<any> {
		const budgetNotifications = itemCodes.map(itemCode => new BudgetNotification({ orderNumber, itemCode }));
		InspectionService.budgetNotifications.push(...budgetNotifications);
		this.inspectionsTriggerSubject.next();
		return this.http.post(Url.budgetNotification(), budgetNotifications);
	}

	deleteBudgetNotification(orderNumber: number): Observable<any> {
		return this.http.delete(Url.budgetNotification(orderNumber)).pipe(
			tap(() => {
				InspectionService.budgetNotifications = InspectionService.budgetNotifications.filter(budgetNotification =>
					budgetNotification.orderNumber !== orderNumber
				);
				this.inspectionsTriggerSubject.next();
			})
		);
	}

	saveInspection(
		savedInspection: SavedInspection = InspectionService.selectedSavedInspection,
		handler: InspectionHandler = InspectionService.inspectionHandler,
		employee: Employee = EmployeeService.employee
	): Observable<any> {
		savedInspection.addData(employee.code);
		const body = handler.findSavedInspection(savedInspection);
		console.log('Saving inspection', body);
		return this.http.patch(Url.savedInspections(), body).pipe(
			tap(
				(data) => console.log('Received saved inspection', data),
				(error) => {
					console.error('Error saving inspection', error);
					savedInspection.restoreSaved();
				}
			)
		);
	}

	sendInspectionMail(
		savedInspection: SavedInspection = InspectionService.selectedSavedInspection,
		order: Order = InspectionService.selectedOrderInspection.order
	): Observable<any> {
		const dialogRef = this.dialog.open(EmailDialogComponent, { data: { email: order.client.email } });
		return dialogRef.afterClosed().pipe(
			filter(email => email),
			concatMap(email => this.sendMail(savedInspection, email))
		);
	}

	sendInspectionSms(
		savedInspection: SavedInspection = InspectionService.selectedSavedInspection,
		order: Order = InspectionService.selectedOrderInspection.order
	): Observable<any> {
		const dialogRef = this.dialog.open(SmsDialogComponent, { data: { phoneNumber: order.client.phoneNumber } });
		return dialogRef.afterClosed().pipe(
			filter(phoneNumber => phoneNumber),
			concatMap(phoneNumber => this.sendSms(savedInspection, phoneNumber))
		);
	}

	sendMail(savedInspection: SavedInspection, to: string, employeeCode: string = EmployeeService.employee.code): Observable<any> {
		this.snackBarService.open(Constants.MESSAGE_CODE.SENDING_MAIL, Constants.SNACK_BAR.TYPE.WARNING, 10000);
		savedInspection.addData(employeeCode, Constants.REASON.SENT, Constants.SEND_METHOD.MAIL);
		return this.http.post(Url.mails(to), savedInspection).pipe(
			tap(
				() => this.inspectionsTriggerSubject.next(),
				(error) => {
					console.error('Error sending mail', error);
					savedInspection.restoreSaved();
				}
			)
		);
	}

	sendSms(savedInspection: SavedInspection, to: number, employeeCode: string = EmployeeService.employee.code): Observable<any> {
		this.snackBarService.open(Constants.MESSAGE_CODE.SENDING_SMS, Constants.SNACK_BAR.TYPE.WARNING, 10000);
		savedInspection.addData(employeeCode, Constants.REASON.SENT, Constants.SEND_METHOD.SMS);
		return this.http.post(Url.sms(to, employeeCode), savedInspection).pipe(
			tap(
				() => this.inspectionsTriggerSubject.next(),
				(error) => {
					console.error('Error sending SMS', error);
					savedInspection.restoreSaved();
				}
			)
		);
	}

}
