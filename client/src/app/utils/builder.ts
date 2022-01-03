import { SavedItem } from '../objects/inspections/saved-items/saved-item';
import { TextSavedItem } from '../objects/inspections/saved-items/text-saved-item';
import { SelectSavedItem } from '../objects/inspections/saved-items/select-saved-item';
import { SavedInspection } from '../objects/inspections/saved-inspection';
import { ItemBudget } from '../objects/item-budget';
import { ItemRelation } from '../objects/inspections/item-relation';
import { Category } from '../objects/list-elements/category';
import { NameElement } from '../objects/list-elements/name-element';
import { ListElement } from '../objects/list-elements/list-element';
import { Car } from '../objects/orders/vehicles/car';
import { Vehicle } from '../objects/orders/vehicles/vehicle';
import { Scooter } from '../objects/orders/vehicles/scooter';
import { TextAreaSavedItem } from '../objects/inspections/saved-items/text-area-saved-item';

export class Builder {

	static savedItemBuilder: { [key: string]: ((savedItem: any) => SavedItem) } = {
		TEXT: (savedItem: TextSavedItem) => new TextSavedItem(savedItem),
		SELECT: (savedItem: SelectSavedItem) => new SelectSavedItem(savedItem),
		TEXT_AREA: (savedItem: TextAreaSavedItem) => new TextAreaSavedItem(savedItem)
	};

	static vehicleBuilder: { [key: string]: ((vehicle: any) => Vehicle) } = {
		CAR: (vehicle: any) => new Car(vehicle),
		SCOOTER: (vehicle: any) => new Scooter(vehicle)
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

	static buildCategory(category: Category, items: ListElement[] = []): Category {
		return new Category(new NameElement({ code: category.code, name: category.name, order: category.order }), items);
	}

	static buildVehicle(vehicle: any): Vehicle {
		return this.vehicleBuilder[vehicle.type](vehicle);
	}

}
