import { SavedItem } from '../objects/inspections/saved-items/saved-item';
import { TextSavedItem } from '../objects/inspections/saved-items/text-saved-item';
import { SelectSavedItem } from '../objects/inspections/saved-items/select-saved-item';
import { Category } from '../objects/list-elements/category';
import { ListElement } from '../objects/list-elements/list-element';
import { NameElement } from '../objects/list-elements/name-element';

export class Builder {

	static savedItemBuilder: { [key: string]: ((savedItem: any) => SavedItem) } = {
		TEXT: (savedItem: TextSavedItem) => new TextSavedItem(savedItem),
		SELECT: (savedItem: SelectSavedItem) => new SelectSavedItem(savedItem),
		TEXT_AREA: (savedItem: TextSavedItem) => new TextSavedItem(savedItem)
	};

	static buildSavedItem(savedItem: any): SavedItem {
		return this.savedItemBuilder[savedItem.item.type](savedItem);
	}

	static buildCategory(category: Category, items: ListElement[] = []): Category {
		return new Category(
			new NameElement({ code: category.code, name: category.name, order: category.order }), items
		);
	}

}
