export class ItemRelation {

	itemCode: string;
	matchText: string;
	targetItemCode: string;
	action: string;

	constructor(itemRelation: any) {
		this.itemCode = itemRelation.itemCode;
		this.matchText = itemRelation.matchText;
		this.targetItemCode = itemRelation.targetItemCode;
		this.action = itemRelation.action;
	}

}
