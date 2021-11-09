import { ItemVehicleData } from './item-vehicle-data';
import { ItemCategory } from '../item-category';
import { ItemRelation } from '../item-relation';

export class Item {

	type: string;
	code: string;
	name: string;
	order: number;
	printOrder: number;
	vehicleData: ItemVehicleData;
	category: ItemCategory;
	header: string;
	relations: ItemRelation[];

	constructor(item: any) {
		this.type = item.type;
		this.code = item.code;
		this.name = item.name;
		this.order = item.order;
		this.printOrder = item.printOrder;
		this.category = item.category ? new ItemCategory(item.category) : undefined;
		this.header = item.header;
	}

}
