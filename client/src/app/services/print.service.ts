import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../utils/constants';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PrintService {

	printingSubject: Subject<boolean>;
	printing$: Observable<boolean>;

	constructor(private router: Router) {
		this.printingSubject = new Subject<boolean>();
		this.printing$ = this.printingSubject.asObservable();
	}

	print(): void {
		this.router.navigate([
			Constants.PATH.INSPECTION,
			{ outlets: { print: [Constants.PATH.PRINT, Constants.PATH.PRINT_SHEET] } }
		]);
	}

	openPrintDialog(): void {
		this.printingSubject.next(true);
		setTimeout(() => {
			window.print();
			this.router.navigate(['/']);
			this.printingSubject.next(false);
		});
	}

}
