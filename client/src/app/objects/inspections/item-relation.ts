import { Item } from './items/item';

export class ItemRelation {

	matchText: string;
	targetItem: Item;
	action: string;

	constructor(itemRelation: any, targetItem: Item) {
		this.matchText = itemRelation.matchText;
		this.targetItem = targetItem;
		this.action = itemRelation.action;
	}

}
