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
	styleUrls: ['./image-dialog.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageDialogComponent {

	image: Image;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: DialogData,
		private http: HttpClient,
		private cdRef: ChangeDetectorRef
	) {
		const url = `${Url.images()}/${data.imageId}`;
		http.get(url).subscribe((image: Image) => {
			this.image = image;
			this.cdRef.detectChanges();
		});
	}

	findImageUrl(image: string): string {
		return InspectionService.findImageUrl(image);
	}

}
