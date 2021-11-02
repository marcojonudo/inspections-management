import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ListElement } from '../../objects/list-elements/list-element';
import { InspectionService } from '../../services/inspection.service';
import { SavedItem } from '../../objects/inspections/saved-items/saved-item';
import { SavedInspection } from '../../objects/inspections/saved-inspection';
import { SelectSavedItem } from '../../objects/inspections/saved-items/select-saved-item';
import { TextSavedItem } from '../../objects/inspections/saved-items/text-saved-item';
import { TextItem } from '../../objects/inspections/items/text-item';
import { SelectItem } from '../../objects/inspections/items/select-item';
import { Category } from '../../objects/list-elements/category';
import { Constants } from '../../utils/constants';

@Component({
	selector: 'app-inspection',
	templateUrl: './inspection.component.html',
	styleUrls: ['./inspection.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionComponent {

	listElements: ListElement[];
	imageListElements: any[];
	savedInspection: SavedInspection;

	constructor() {
		this.savedInspection = InspectionService.findSavedInspection(InspectionService.selectedOrderInspection.order.number);
		const items = this.savedInspection.items
			.filter(i => !i.item.header)
			.filter(i => {
				const selectItem = i.item.type === Constants.ITEM_TYPE.SELECT;
				return selectItem ? i.findValue() !== Constants.SELECT_ITEM_OPTION_CODE.NA : true;
			});
		this.listElements = InspectionService.findGroupedItems(
			items, 0, [(savedItem: SavedItem) => savedItem.item.category]
		);
		this.imageListElements = InspectionService.findGroupedItems(
			this.savedInspection.items.filter(i => i.image),
			0,
			[(savedItem: SavedItem) => savedItem.item.category]
		);
	}

	// region Getters / setters

	get selectType(): string {
		return Constants.ITEM_TYPE.SELECT;
	}

	// endregion

	checkItemType(optionType: string, type: string): boolean {
		return optionType === type;
	}

	findSelectSavedItem(item: SavedItem): SelectSavedItem {
		return item as SelectSavedItem;
	}

	findTextSavedItem(item: SavedItem): TextSavedItem {
		return item as TextSavedItem;
	}

	findTextItemUnit(item: SavedItem): string {
		return this.findTextSavedItem(item).text ? (item.item as TextItem).unit || '' : '';
	}

	findSelectIcon(item: SelectSavedItem): string {
		return (item.item as SelectItem).options.find(option => option.code === item.value).printIcon;
	}

	findIconColor(code: string): string {
		return InspectionService.findIconColor(code);
	}

	checkCategoryElement(item: ListElement): boolean {
		return item instanceof Category;
	}

	findTextAreaLines(item: TextSavedItem): string[] {
		return item.text ? item.text.split('\n') : [];
	}

	findImageUrl(image: string): string {
		return InspectionService.findImageUrl(image);
	}

	checkWrongItem(savedItem: SavedItem): boolean {
		if (savedItem.item.type !== Constants.ITEM_TYPE.SELECT) {
			return false;
		}
		return (savedItem as SelectSavedItem).value !== Constants.SELECT_ITEM_OPTION_CODE.C;
	}

	checkCategoryBreak(elem: ListElement): boolean {
		const gasCategory = this.checkCategoryElement(elem) && (elem as Category).code === 'G';
		if (gasCategory) { return true; }
		return !this.checkCategoryElement(elem) && (elem as SavedItem).item.code === 'C';
	}

}
