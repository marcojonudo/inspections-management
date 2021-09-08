import {
	Injectable,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { LocalStorageService } from '../services/local-storage.service';
import { Constants } from '../objects/constants';

@Injectable({
	providedIn: 'root'
})
export class EmployeesResolver implements Resolve<any> {

	constructor(private employeeService: EmployeeService) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
		const employees = LocalStorageService.getItem(Constants.LOCAL_STORAGE.EMPLOYEES);
		return employees ? of(employees) : this.employeeService.findEmployees();
	}

}
