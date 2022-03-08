import { ItemCategory } from '../inspections/item-category';
import { SavedItem } from '../inspections/saved-items/saved-item';
import { Constants } from '../../utils/constants';

export class CategoryItems {

	category: ItemCategory;
	items: SavedItem[];
	imagesRows: SavedItem[][] = [];

	constructor(savedItems: SavedItem[], category: ItemCategory = undefined) {
		this.category = category;
		this.items = savedItems;
		for (let i = 0; i < this.items.length; i++) {
			if (i % Constants.ROW_IMAGES === 0) {
				this.imagesRows.push([]);
			}
			this.imagesRows[this.imagesRows.length - 1].push(this.items[i]);
		}
	}

	addItem(savedItem: SavedItem): void {
		this.items.push(savedItem);
		if (this.items.length > Constants.ROW_IMAGES) {
			this.imagesRows.push([savedItem]);
		} else {
			this.imagesRows[this.imagesRows.length - 1].push(savedItem);
		}
	}

	clone(savedItems: SavedItem[]): CategoryItems {
		return new CategoryItems(savedItems, this.category);
	}

}
