import { Pipe, PipeTransform } from '@angular/core';
import { SavedItem } from '../objects/inspections/saved-items/saved-item';

@Pipe({
	name: 'printOrder'
})
export class PrintOrderPipe implements PipeTransform {

	transform(array: SavedItem[]): SavedItem[] {
		return array.sort((a, b) => {
			if (a.item.printOrder < b.item.printOrder || b.item.printOrder === undefined) {
				return -1;
			}
			if (a.item.printOrder > b.item.printOrder || a.item.printOrder === undefined) {
				return 1;
			}
			return 0;
		});
	}

}
