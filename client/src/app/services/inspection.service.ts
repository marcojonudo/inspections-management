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

@Injectable({
	providedIn: 'root'
})
export class InspectionService {

	static orderInspections: OrderInspection[];

	filters: OrdersFilter[];

	orderInspectionsSubject: Subject<OrderInspection[]>;
	orderInspections$: Observable<OrderInspection[]>;

	constructor(private http: HttpClient) {
		this.filters = [new TodayOrdersFilter()];
		this.orderInspectionsSubject = new Subject<OrderInspection[]>();
		this.orderInspections$ = this.orderInspectionsSubject.asObservable();
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

	findOrderInspections(filters: OrdersFilter[] = this.filters): Observable<any> {
		return this.findOrders(filters).pipe(
			mergeMap(orders => {
				return this.http.post(Url.orderInspections(), orders);
			}),
			tap(data => {
				InspectionService.orderInspections = data.map(orderInspection => new OrderInspection(orderInspection));
				this.orderInspectionsSubject.next(InspectionService.orderInspections);
				console.log('Order inspections', InspectionService.orderInspections);
			})
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

}
