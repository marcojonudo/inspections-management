import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Url } from '../../utils/url';
import { Image } from '../../objects/inspections/image';
import { InspectionService } from '../../services/inspection.service';

export interface DialogData {
	imageId: number;
}

@Component({
	selector: 'app-image-dialog',
	templateUrl: './image-dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageDialogComponent {

	image: Image;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: DialogData,
		private http: HttpClient,
		private cdRef: ChangeDetectorRef
	) {
		http.get(Url.image(), { params: { id: `${data.imageId}` } }).subscribe((image: Image) => {
			this.image = image;
			this.cdRef.detectChanges();
		});
	}

	findImageUrl(image: string): string {
		return InspectionService.findImageUrl(image);
	}

}
