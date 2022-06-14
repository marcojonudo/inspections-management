import { TextItem } from './text-item';
import { SelectSavedItemData } from '../saved-items/select-saved-item-data';
import { TextSavedItemData } from '../saved-items/text-saved-item-data';
import { TextAreaSavedItemData } from '../saved-items/text-area-saved-item-data';
import { Item } from './item';
import { SavedItemData } from '../saved-items/saved-item-data';
import { SelectItem } from './select-item';
import { TextAreaItem } from './text-area-item';

export class ItemType {

	private static all: { [name: string]: ItemType } = {};

	static readonly SELECT = new ItemType(
		'SELECT',
		(item: any) => new SelectItem(item),
		(employeeCode: string, data: any, item: SelectItem) => new SelectSavedItemData(employeeCode, data, item)
	);
	static readonly TEXT = new ItemType(
		'TEXT',
		(item: any) => new TextItem(item),
		(employeeCode: string, data: any, item: TextItem) => new TextSavedItemData(employeeCode, data, item)
	);
	static readonly TEXT_AREA = new ItemType(
		'TEXT_AREA',
		(item: any) => new TextAreaItem(item),
		(employeeCode: string, data: any, item: TextAreaItem) => new TextAreaSavedItemData(employeeCode, data, item)
	);

	id: string;
	buildItem: (item: any) => Item;
	buildData: (e: string, data: any, item: Item) => SavedItemData;

	constructor(id: string, buildItem: any, buildData: any) {
		this.id = id;
		this.buildItem = buildItem;
		this.buildData = buildData;
		ItemType.all[id] = this;
	}

	static parse(id: string): ItemType {
		return ItemType.all[id];
	}

}
