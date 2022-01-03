import { Item } from './item';
import { TextItemField } from './text-item-field';
import { Utils } from '../../../utils/utils';

export class TextItem extends Item {

	unit: string;
	fields: TextItemField[];

	constructor(item: any) {
		super(item);
		this.unit = item.unit;
		this.fields = Utils.sort(
			item.fields.map(field => new TextItemField(field)), (field: TextItemField) => field.order
		);
	}

}
