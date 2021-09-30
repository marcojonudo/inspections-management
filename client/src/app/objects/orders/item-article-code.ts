export class ItemArticleCode {

	itemCode: string;
	articleCode: number;

	constructor(itemArticleCode: any) {
		this.itemCode = itemArticleCode.itemCode;
		this.articleCode = itemArticleCode.articleCode;
	}

}
