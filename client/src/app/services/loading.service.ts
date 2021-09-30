import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class LoadingService {

	loadingSubject: Subject<boolean>;

	constructor() {
		this.loadingSubject = new Subject<boolean>();
	}

	subscribe(onNext: any): Subscription {
		return this.loadingSubject.subscribe(onNext);
	}

	stop(): void {
		this.loadingSubject.next(false);
	}

}
