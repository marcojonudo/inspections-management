import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Url } from '../objects/url';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Constants } from '../objects/constants';
import { OrdersFilter } from '../objects/filters/orders-filter';
import { TodayOrdersFilter } from '../objects/filters/today-orders-filter';
import { Order } from '../objects/orders/order';
import { ItemArticleCode } from '../objects/orders/item-article-code';
import { ItemBudget } from '../objects/item-budget';
import { BudgetNotification } from '../objects/budget-notification';
import { Budget } from '../objects/orders/budget';
import { OrderInspectionVehicle } from '../objects/order-inspection-vehicle';
import { SavedInspection } from '../objects/inspections/saved-inspection';

@Injectable({
	providedIn: 'root'
})
export class InspectionService {

	static orderInspections: OrderInspectionVehicle[];
	static savedInspections: SavedInspection[];
	static itemBudgets: ItemBudget[];
	static itemArticleCodes: ItemArticleCode[];
	static budgetNotifications: BudgetNotification[];
	static selectedOrderInspection: OrderInspectionVehicle;

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
		InspectionService.itemArticleCodes = [];
		InspectionService.budgetNotifications = [];
	}

	// static findOrder(orderNumber: number, orders: Order[] = this.orders): Order {
	// 	return orders.find(o => o.number === orderNumber);
	// }

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
		const order = this.findOrderInspection(orderNumber).order;
		const savedInspection = this.findSavedInspection(orderNumber);
		const itemBudgetTypes = savedInspection.itemBudgets.map(itemBudget => this.findItemBudgetType(itemBudget, order.budgets));
		return this.findItemBudgetsMainType(itemBudgetTypes);
	}

	static findItemBudgetType(itemBudget: ItemBudget, budgets: Budget[]): string {
		const existentBudget = InspectionService.checkExistentBudget(itemBudget.itemCode, budgets);
		return existentBudget ? '' : itemBudget.budgetType;
	}

	static checkExistentBudget(
		itemCode: string, budgets: Budget[], itemArticleCodes: ItemArticleCode[] = this.itemArticleCodes
	): boolean {
		/* Se buscan los códigos de artículo que corresponden al item erróneo */
		const articleCodes = itemArticleCodes.filter(itemArticleCode =>
			itemArticleCode.itemCode === itemCode
		).map(itemArticleCode => itemArticleCode.articleCode);
		/* Una vez obtenidos los artículos, se comprueba si alguno de los presupuestos asociados a la orden contiene alguno de
		 * ellos. De ser así, se determinaría que existe presupuesto asociado a la revisión */
		return budgets.find(budget =>
			budget.lines.map(l => l.articleCode).find(articleCode => articleCodes.find(code => code === articleCode))
		) !== undefined;
	}

	static findItemBudgetsMainType(types: string[]): string {
		return types.sort((a, b) => {
			if (Constants.BUDGET_TYPE_ORDER[a] < Constants.BUDGET_TYPE_ORDER[b]) {
				return -1;
			}
			if (Constants.BUDGET_TYPE_ORDER[a] > Constants.BUDGET_TYPE_ORDER[b]) {
				return 1;
			}
			return 0;
		})[0];
	}

	static findBudgetNotification(
		orderNumber: number, itemCode: string, budgetNotifications: BudgetNotification[] = this.budgetNotifications
	): BudgetNotification {
		return budgetNotifications.find(c => c.orderNumber === orderNumber && c.itemCode === itemCode);
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

	static findPendingClientContactOrders(orderInspections: OrderInspectionVehicle[] = this.orderInspections): number[] {
		const pendingContactOrders = [];
		orderInspections.forEach(orderInspection => {
			const pending = InspectionService.findBudgetNotifications(orderInspection.order.number).length === 0;
			if (pending) {
				pendingContactOrders.push(orderInspection.order.number);
			}
		});
		return pendingContactOrders;
	}

	static findBudgetsPrice(orderInspections: OrderInspectionVehicle[] = this.orderInspections): number {
		let price = 0;
		orderInspections.forEach(orderInspection => {
			orderInspection.order.budgets.forEach(budget => {
				budget.lines.filter(l => l.price).forEach(line => {
					price += line.units * line.price;
				});
			});
		});
		return price;
	}

	static findAllBudgetNotifications(orderInspections: OrderInspectionVehicle[] = this.orderInspections): BudgetNotification[] {
		const allBudgetNotifications = [];
		orderInspections.forEach(orderInspection => {
			allBudgetNotifications.push(...InspectionService.findBudgetNotifications(orderInspection.order.number));
		});
		return allBudgetNotifications;
	}

	findLanguage(): Observable<string> {
		const language = LocalStorageService.getItem(Constants.LOCAL_STORAGE.LANGUAGE);
		return (language ? of(language) : this.http.get(Url.language(), { responseType: 'text' })).pipe(
			catchError(() => of(Constants.DEFAULT_LANGUAGE)),
			tap((lang: string) => {
				LocalStorageService.setItem(Constants.LOCAL_STORAGE.LANGUAGE, lang);
				console.log('Language', lang);
			})
		);
	}

	loadMainInfo(filters: OrdersFilter[] = this.filters): Observable<any> {
		return this.findOrders(filters).pipe(
			mergeMap(orders => {
				const openedOrders = orders.filter(o => o.state !== Constants.ORDER_STATE.F);
				console.log('Opened orders', openedOrders);

				if (openedOrders.length) {
					const articles = this.findArticles(openedOrders);
					const orderNumbers = openedOrders.map(o => o.number);
					const budgetNotificationsUrl = `${Url.budgetNotification()}?orderNumbers=${orderNumbers.join('&orderNumbers=')}`;
					return forkJoin([
						this.findItemBudgets(),
						InspectionService.itemArticleCodes || articles.length ?
							of(InspectionService.itemArticleCodes) : this.http.post(Url.articleItems(), articles),
						this.http.post(Url.inspections(), orders),
						this.http.post(Url.savedInspections(), orderNumbers),
						this.http.get(budgetNotificationsUrl)
					]);
				} else {
					return of([]);
				}
			}),
			tap(data => {
				console.log('Received data', data);
				if (data.length) {
					InspectionService.itemBudgets = this.buildItemBudgets(data[0]);
					InspectionService.itemArticleCodes = InspectionService.itemArticleCodes.length ?
						InspectionService.itemArticleCodes : data[1].map(i => new ItemArticleCode(i));
					InspectionService.savedInspections = data[3].map(d => new SavedInspection(d, InspectionService.itemBudgets));
					InspectionService.budgetNotifications = data[4].map(b => new BudgetNotification(b));

					const orderInspections = data[2].map(d => new OrderInspectionVehicle(d));
					InspectionService.orderInspections = this.buildOrderInspections(orderInspections, InspectionService.savedInspections);
				}
				console.log('Item budgets', InspectionService.itemBudgets);
				console.log('Item article codes', InspectionService.itemArticleCodes);
				console.log('Order inspections', InspectionService.orderInspections);
				console.log('Saved inspections', InspectionService.savedInspections);
				console.log('Client budget notifications', InspectionService.budgetNotifications);
			})
		);
	}

	findItemBudgets(): Observable<any> {
		const savedItemBudgets = LocalStorageService.getItem(Constants.LOCAL_STORAGE.ITEM_BUDGETS);
		return savedItemBudgets ? of(savedItemBudgets) : this.http.get(Url.itemBudgets());
	}

	buildItemBudgets(itemBudgets: any[]): ItemBudget[] {
		const savedItemBudgets = LocalStorageService.getItem(Constants.LOCAL_STORAGE.ITEM_BUDGETS);
		if (savedItemBudgets) {
			return savedItemBudgets;
		}
		const builtItemBudgets = itemBudgets.map(i => new ItemBudget(i));
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.ITEM_BUDGETS, builtItemBudgets);
		return builtItemBudgets;
	}

	buildOrderInspections(orderInspections: OrderInspectionVehicle[], savedInspections: SavedInspection[]): OrderInspectionVehicle[] {
		const allOrderInspections = [];
		orderInspections.forEach(orderInspection => {
			/* Cuenta como revisión si tiene una asociada, o si tiene una guardad previamente (caso de una OR sin revisión en la que se ha
			 * destacado algún aspecto incorrecto) */
			if (orderInspection.inspection || savedInspections.find(s => s.orderNumber === orderInspection.order.number) !== undefined) {
				allOrderInspections.push(orderInspection);
			}
		});
		return allOrderInspections;
	}

	findArticles(orders: Order[]): number[] {
		return [].concat(...orders.map(o => o.lines.map(l => l.articleCode))).filter((value, index, self) =>
			self.indexOf(value) === index
		);
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

	selectOrder(orderNumber: number): void {
		InspectionService.selectedOrderInspection = InspectionService.findOrderInspection(orderNumber);
		this.selectedOrderInspectionSubject.next(InspectionService.selectedOrderInspection);
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

	updateAcceptedBudget(budgetNotification: BudgetNotification, accepted: boolean): Observable<any> {
		budgetNotification.accepted = accepted;
		return this.http.patch(Url.budgetNotification(), budgetNotification).pipe(
			tap(() => this.budgetNotificationsSubject.next(InspectionService.budgetNotifications))
		);
	}

}
