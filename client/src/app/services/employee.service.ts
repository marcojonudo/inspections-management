import { Injectable } from '@angular/core';
import { Employee } from '../objects/employee';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { Constants } from '../objects/constants';
import { Observable, of } from 'rxjs';
import { Url } from '../objects/url';
import { catchError } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class EmployeeService {

	static employees: Employee[];

	constructor(private http: HttpClient) {}

	static findEmployee(code: string, employees: Employee[] = this.employees): Employee {
		return employees.find(e => e.code === code);
	}

	static setEmployees(employees: any): void {
		this.employees = employees.map(employee => new Employee(employee));
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.EMPLOYEES, this.employees);
		console.log('Employees', this.employees);
	}

	findEmployees(): Observable<any> {
		const employees = LocalStorageService.getItem(Constants.LOCAL_STORAGE.EMPLOYEES);
		return employees ? of(employees) : this.http.get(Url.employees()).pipe(
			catchError(() => of([]))
		);
	}

}
