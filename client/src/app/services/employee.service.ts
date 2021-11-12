import { Injectable } from '@angular/core';
import { Employee } from '../objects/employee';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Constants } from '../utils/constants';
import { Url } from '../utils/url';

@Injectable({
	providedIn: 'root'
})
export class EmployeeService {

	static employees: Employee[];
	static employee: Employee;

	constructor(private http: HttpClient) {}

	static findEmployee(code: string, employees: Employee[] = this.employees): Employee {
		return employees.find(e => e.code === code);
	}

	static setEmployee(employeeCode: string): Employee {
		this.employee = this.findEmployee(employeeCode);
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.EMPLOYEE, this.employee);
		return this.employee;
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
