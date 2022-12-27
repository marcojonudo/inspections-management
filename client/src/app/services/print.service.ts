import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../utils/constants';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PrintService {

	constructor(private router: Router) {}

	print(): void {
		this.router.navigate([Constants.PATH.INSPECTION]);
	}

	openPrintDialog(): void {
		setTimeout(() => {
			window.print();
			this.router.navigate(['/']);
		});
	}

}
