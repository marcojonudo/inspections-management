import {TextSavedItem} from './inspections/saved-items/text-saved-item';
import {SelectSavedItem} from './inspections/saved-items/select-saved-item';
import {SavedItem} from './inspections/saved-items/saved-item';

export class Builder {

	static savedItemBuilder: { [key: string]: ((savedItem: any) => SavedItem) } = {
		TEXT: (savedItem: TextSavedItem) => new TextSavedItem(savedItem),
		SELECT: (savedItem: SelectSavedItem) => new SelectSavedItem(savedItem),
		TEXT_AREA: (savedItem: TextSavedItem) => new TextSavedItem(savedItem)
	};

	static buildSavedItem(savedItem: any): SavedItem {
		return this.savedItemBuilder[savedItem.item.type](savedItem);
	}

}
