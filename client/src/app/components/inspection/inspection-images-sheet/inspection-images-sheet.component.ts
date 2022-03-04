import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CategoryItems } from '../../../objects/print/category-items';
import { VehicleType } from '../../../objects/orders/vehicles/vehicle-type';
import { InspectionService } from '../../../services/inspection.service';
import { Image } from '../../../objects/inspections/image';

@Component({
	selector: 'app-inspection-images-sheet',
	templateUrl: './inspection-images-sheet.component.html',
	styleUrls: ['./inspection-images-sheet.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionImagesSheetComponent {

	@Input() categories: CategoryItems[];
	@Input() images: Image[];
	@Input() vehicleType: VehicleType;

	findImage(id: number, images: Image[] = this.images): Image {
		return images.find(i => i.id === id);
	}

	findImageUrl(imageId: number): string {
		const image = this.findImage(imageId);
		return InspectionService.findImageUrl(image.image);
	}

}
