import { ChangeDetectionStrategy, Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../../utils/constants';
import { SavedInspection } from '../../objects/inspections/saved-inspection';
import { InspectionService } from '../../services/inspection.service';

@Component({
	selector: 'app-inspection',
	templateUrl: './inspection.component.html',
	styleUrls: ['./inspection.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionComponent {

	private readonly EXIT_INSPECTION = 'exit-inspection';

	@HostBinding('class') classes = this.EXIT_INSPECTION;

	@HostListener(Constants.EVENT.CLICK, ['$event'])
	onClick(event): void {
		if (event.target.className.includes(this.EXIT_INSPECTION)) {
			this.router.navigate([Constants.PATH.ROOT]);
		}
	}

	constructor(private router: Router) {
		this.router.navigate([
			'/home/inspection',
			{ outlets: { template: ['template', 'sheet'] } }
		]);
	}

}
