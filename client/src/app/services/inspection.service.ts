import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Url } from '../objects/url';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { OrderInspection } from '../objects/order-inspection';
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

@Injectable({
	providedIn: 'root'
})
export class InspectionService {

	static orderInspections: OrderInspection[];
	static itemArticleCodes: ItemArticleCode[];
	static budgetNotifications: BudgetNotification[];
	static selectedOrderInspection: OrderInspection;

	filters: OrdersFilter[];

	orderInspectionsSubject: Subject<OrderInspection[]>;
	orderInspections$: Observable<OrderInspection[]>;
	selectedOrderInspectionSubject: Subject<OrderInspection>;
	selectedOrderInspection$: Observable<OrderInspection>;

	constructor(private http: HttpClient) {
		this.filters = [new TodayOrdersFilter()];
		this.orderInspectionsSubject = new Subject<OrderInspection[]>();
		this.orderInspections$ = this.orderInspectionsSubject.asObservable();

		this.selectedOrderInspectionSubject = new Subject<OrderInspection>();
		this.selectedOrderInspection$ = this.selectedOrderInspectionSubject.asObservable();
	}

	static findOrder(orderNumber: number, orderInspections: OrderInspection[] = this.orderInspections): Order {
		return orderInspections.find(o => o.order.number === orderNumber).order;
	}

	static findOrderInspection(orderNumber: number, orderInspections: OrderInspection[] = this.orderInspections): OrderInspection {
		return orderInspections.find(o => o.order.number === orderNumber);
	}

	static findBudgetState(orderNumber: number, itemBudgets: ItemBudget[]): string {
		const orderInspection = this.findOrderInspection(orderNumber);
		/* Si la orden tiene presupuestos relacionados, se comprueba si sus artículos coinciden con los que tiene pendientes
		 * la revisión */
		if (orderInspection.order.budgets.length) {
			/* itemBudgets contiene los items incorrectos, con el tipo de presupuesto que les corresponde */
			const existentBudget = this.checkExistentBudget2(orderInspection.order, orderInspection.itemBudgets);
			/* Si existe un presupuesto asociado a alguno de los items no correctos de la revisión, se devuelve cadena vacía para que el
			 * icono siga en color verde (el paso de realizar presupuesto en JPDV ya ha sido completado) */
			if (existentBudget) {
				return '';
			}
		}
		/* Si la orden no tiene presupuestos relacionados, se comprueba la lista de ItemBudget para comprobar qué
		 * tipo de presupuesto le corresponde */
		return this.findItemBudgetsMainType(itemBudgets);
	}

	static checkExistentBudget2(order: Order, itemBudgets: ItemBudget[]): boolean {
		return itemBudgets.find(itemBudget => {
			/* Se buscan los códigos de artículo que corresponden a los items erróneos */
			const articleCodes = this.itemArticleCodes.filter(itemArticleCode =>
				itemArticleCode.itemCode === itemBudget.itemCode
			).map(itemArticleCode => itemArticleCode.articleCode);
			/* Una vez obtenidos los artículos, se comprueba si alguno de los presupuestos asociados a la orden contiene alguno de
			 * ellos. De ser así, se determinaría que existe presupuesto asociado a la revisión */
			return order.budgets.find(budget =>
				budget.lines.map(l => l.articleCode).find(articleCode => articleCodes.find(code => code === articleCode))
			);
		}) !== undefined;
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

	static findItemBudgetsMainType(itemBudgets: ItemBudget[]): string {
		return itemBudgets.map(itemBudget => itemBudget.budgetType).sort((a, b) => {
			if (Constants.BUDGET_TYPE[a] < Constants.BUDGET_TYPE[b]) {
				return -1;
			}
			if (Constants.BUDGET_TYPE[a] > Constants.BUDGET_TYPE[b]) {
				return 1;
			}
			return 0;
		})[0].toLowerCase();
	}

	static findBudgetNotification(
		orderNumber: number, itemCode: string = undefined, budgetNotifications: BudgetNotification[] = this.budgetNotifications
	): BudgetNotification {
		return budgetNotifications.find(c => c.orderNumber === orderNumber && (itemCode ? c.itemCode === itemCode : true));
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
				console.log('Orders', orders);
				const articles = this.findArticles(orders);
				const orderNumbers = orders.map(o => o.number);
				const budgetNotificationsUrl = `${Url.budgetNotification()}?orderNumbers=${orderNumbers.join('&orderNumbers=')}`;
				return forkJoin([
					this.http.post(Url.orderInspections(), orders),
					this.http.post(Url.articleItems(), articles),
					this.http.get(budgetNotificationsUrl)
				]);
			}),
			tap(data => {
				console.log('Received order inspections info', data[0]);
				console.log('Received article items info', data[1]);
				console.log('Received client budget notification info', data[2]);
				InspectionService.orderInspections = data[0].map(orderInspection => new OrderInspection(orderInspection));
				InspectionService.itemArticleCodes = data[1].map(i => new ItemArticleCode(i));
				InspectionService.budgetNotifications = data[2].map(b => new BudgetNotification(b));
				console.log('Order inspections', InspectionService.orderInspections);
				console.log('Item article codes', InspectionService.itemArticleCodes);
				console.log('Client budget notifications', InspectionService.budgetNotifications);
				this.orderInspectionsSubject.next(InspectionService.orderInspections);
			})
		);
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
				return [].concat(...data).map(o => new Order(o));
			})
		);
	}

	selectOrder(orderNumber: number): void {
		InspectionService.selectedOrderInspection = InspectionService.findOrderInspection(orderNumber);
		this.selectedOrderInspectionSubject.next(InspectionService.selectedOrderInspection);
	}

	createBudgetNotification(orderNumber: number, itemCodes: string[]): Observable<any> {
		const budgetNotifications = itemCodes.map(itemCode => new BudgetNotification({ orderNumber, itemCode }));
		return this.http.post(Url.budgetNotification(), budgetNotifications).pipe(
			tap(() => {
				InspectionService.budgetNotifications.push(...budgetNotifications);
			})
		);
	}

	deleteBudgetNotification(orderNumber: number): Observable<any> {
		return this.http.delete(Url.budgetNotification(), { params: { orderNumber: `${orderNumber}` } }).pipe(
			tap(() => {
				InspectionService.budgetNotifications = InspectionService.budgetNotifications.filter(budgetNotification =>
					budgetNotification.orderNumber !== orderNumber
				);
			})
		);
	}

	updateAcceptedBudget(budgetNotification: BudgetNotification, accepted: boolean): Observable<any> {
		budgetNotification.accepted = accepted;
		return this.http.patch(Url.budgetNotification(), budgetNotification);
	}

}
