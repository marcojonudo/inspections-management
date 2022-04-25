import { TextSavedItem } from '../saved-items/text-saved-item';
import { TextAreaSavedItem } from '../saved-items/text-area-saved-item';
import { SelectSavedItem } from '../saved-items/select-saved-item';
import { SelectItem } from './select-item';
import { TextItem } from './text-item';
import { TextAreaItem } from './text-area-item';

export class ItemType {

	private static all: { [name: string]: ItemType } = {};

	static readonly SELECT = new ItemType(
		'SELECT',
		(item: any) => new SelectItem(item),
		(savedItem: any, item: SelectItem) => new SelectSavedItem(savedItem, item)
	);
	static readonly TEXT = new ItemType(
		'TEXT',
		(item: any) => new TextItem(item),
		(savedItem: any, item: TextItem) => new TextSavedItem(savedItem, item)
	);
	static readonly TEXT_AREA = new ItemType(
		'TEXT_AREA',
		(item: any) => new TextAreaItem(item),
		(savedItem: any, item: TextAreaItem) => new TextAreaSavedItem(savedItem, item)
	);

	id: string;
	buildItem: any;
	buildSavedItem: any;

	constructor(id: string, buildItem: any, buildSavedItem: any) {
		this.id = id;
		this.buildItem = buildItem;
		this.buildSavedItem = buildSavedItem;
		ItemType.all[id] = this;
	}

	static parse(id: string): ItemType {
		return ItemType.all[id];
	}

}
