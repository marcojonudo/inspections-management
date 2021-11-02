import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'order'
})
export class OrderPipe implements PipeTransform {

	transform(array: any[]): any[] {
		return array.sort((a, b) => {
			if (a.order < b.order || b.order === undefined) {
				return -1;
			}
			if (a.order > b.order || a.order === undefined) {
				return 1;
			}
			return 0;
		});
	}

}
