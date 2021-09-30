import {
	Injectable,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { LocalStorageService } from '../services/local-storage.service';
import { Constants } from '../objects/constants';
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
