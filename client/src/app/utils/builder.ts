import { SavedItem } from '../objects/inspections/saved-items/saved-item';
import { SavedInspection } from '../objects/inspections/saved-inspection';
import { ItemBudget } from '../objects/item-budget';
import { InspectionService } from '../services/inspection.service';
import { Item } from '../objects/inspections/items/item';

export class Builder {

	static buildSavedInspection(
		savedInspection: any, itemBudgets: ItemBudget[] = InspectionService.itemBudgets, items: Item[] = InspectionService.items
	): SavedInspection {
		const savedItems = savedInspection.items.map(savedItem => {
			const item = items.find(i => i.code === savedItem.code);
			return new SavedItem(savedItem, item);
		});
		const filteredItemBudgets = InspectionService.filterItemBudgets(savedItems, itemBudgets);
		return new SavedInspection(savedInspection, savedItems, filteredItemBudgets);
	}

}
