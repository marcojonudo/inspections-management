import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class LoadingService {

	loading: boolean;
	loadingSubject: Subject<boolean>;

	constructor() {
		this.loading = false;
		this.loadingSubject = new Subject<boolean>();
	}

	subscribe(onNext: any): Subscription {
		return this.loadingSubject.subscribe(onNext);
	}

	start(): void {
		this.loading = true;
		this.loadingSubject.next(this.loading);
		console.log(0, this.loading, this.loadingSubject);
	}

	stop(): void {
		this.loading = false;
		this.loadingSubject.next(this.loading);
	}

}
