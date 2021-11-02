import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { InspectionService } from '../services/inspection.service';

@Injectable({
	providedIn: 'root'
})
export class InspectionGuard implements CanActivate {

	constructor(private router: Router) {}

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if (InspectionService.selectedOrderInspection) {
			return true;
		}
		this.router.navigate(['/']);
		return false;
	}

}
