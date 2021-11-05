import { SavedItem } from '../objects/inspections/saved-items/saved-item';
import { TextSavedItem } from '../objects/inspections/saved-items/text-saved-item';
import { SelectSavedItem } from '../objects/inspections/saved-items/select-saved-item';
import { SavedInspection } from '../objects/inspections/saved-inspection';
import { ItemBudget } from '../objects/item-budget';
import { ItemRelation } from '../objects/inspections/item-relation';

export class Builder {

	static savedItemBuilder: { [key: string]: ((savedItem: any) => SavedItem) } = {
		TEXT: (savedItem: TextSavedItem) => new TextSavedItem(savedItem),
		SELECT: (savedItem: SelectSavedItem) => new SelectSavedItem(savedItem),
		TEXT_AREA: (savedItem: TextSavedItem) => new TextSavedItem(savedItem)
	};

	static buildSavedInspection(savedInspection: any, itemBudgets: ItemBudget[]): SavedInspection {
		const builtSavedInspection = new SavedInspection(savedInspection, itemBudgets);
		const items = builtSavedInspection.items.map(i => i.item);
		items.forEach(item => {
			const baseItem = items.find(i => i.name === item.name);
			item.relations = baseItem.relations.map(itemRelation =>
				new ItemRelation(itemRelation, items.find(i => i.name === itemRelation.targetItem.name))
			);
		});
		return builtSavedInspection;
	}

	static buildSavedItem(savedItem: any): SavedItem {
		return this.savedItemBuilder[savedItem.item.type](savedItem);
	}

}
