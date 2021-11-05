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
import { SelectItemOption } from '../../objects/inspections/items/select-item-option';
import { InspectionHandler } from '../../objects/inspection-handler/inspection-handler';
import { OrderInspectionHandler } from '../../objects/inspection-handler/order-inspection-handler';
import { DetectedFaultsHandler } from '../../objects/inspection-handler/detected-faults-handler';
import { Item } from '../../objects/inspections/items/item';

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
	inspectionHandler: InspectionHandler;

	constructor() {
		this.savedInspection = InspectionService.findSavedInspection(InspectionService.selectedOrderInspection.order.number);
		this.inspectionHandler = this.savedInspection.orderInspection ? new OrderInspectionHandler() : new DetectedFaultsHandler();
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

	findSelectItem(item: Item): SelectItem {
		return item as SelectItem;
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

	// findSelectItem(item: Item): SelectItem {
	// 	return item as SelectItem;
	// }

	toggleSelectOption(savedItem: SelectSavedItem): void {
		const item = savedItem.item as SelectItem;
		const selectedIndex = this.findOptionIndex(savedItem, item.code, item.options);
		const newIndex = this.inspectionHandler.findSelectOptionIndex(selectedIndex, item.options.length);

		InspectionService.updateItem(savedItem, item, item.options[newIndex].code, this.savedInspection).subscribe();
	}

	findOptionIndex(savedItem: SelectSavedItem, itemCode: string, options: SelectItemOption[]): number {
		const selectedValue = savedItem.value;
		return options.findIndex(o => o.code === selectedValue);
	}

}
