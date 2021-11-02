import {
	Injectable,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { InspectionService } from '../services/inspection.service';

@Injectable({
	providedIn: 'root'
})
export class MainInfoResolver implements Resolve<any> {

	constructor(private inspectionService: InspectionService) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
		return this.inspectionService.loadMainInfo();
	}

}
