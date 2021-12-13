export class ItemVehicleArticleCode {

	itemCode: string;
	vehicle: string;
	articleCode: number;

	constructor(itemVehicleArticleCode: any) {
		this.itemCode = itemVehicleArticleCode.itemCode;
		this.vehicle = itemVehicleArticleCode.vehicle;
		this.articleCode = itemVehicleArticleCode.articleCode;
	}

}
