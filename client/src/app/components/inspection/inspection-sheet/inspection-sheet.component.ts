import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SavedInspection } from '../../../objects/inspections/saved-inspection';
import { InspectionHandler } from '../../../objects/inspection-handler/inspection-handler';
import { Constants } from '../../../utils/constants';
import { InspectionService } from '../../../services/inspection.service';
import { SavedItem } from '../../../objects/inspections/saved-items/saved-item';
import { Order } from '../../../objects/orders/order';
import { Centre } from '../../../objects/centre';
import { SelectItemOption } from '../../../objects/inspections/items/select-item-option';
import { TextItem } from '../../../objects/inspections/items/text-item';
import { TextItemField } from '../../../objects/inspections/items/text-item-field';
import { VehicleType } from '../../../objects/orders/vehicles/vehicle-type';
import { CategoryItems } from '../../../objects/print/category-items';
import { GroupedItemOptions } from '../../../objects/inspections/items/grouped-item-options';
import { ItemType } from '../../../objects/inspections/items/item-type';
import { TextSavedItemData } from '../../../objects/inspections/saved-items/text-saved-item-data';
import { TextAreaSavedItemData } from '../../../objects/inspections/saved-items/text-area-saved-item-data';
import { TextSavedItemDataField } from '../../../objects/inspections/saved-items/text-saved-item-data-field';
import { Utils } from '../../../utils/utils';

@Component({
	selector: 'app-inspection-sheet',
	templateUrl: './inspection-sheet.component.html',
	styleUrls: ['./inspection-sheet.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionSheetComponent {

	@Input() categories: CategoryItems[];
	@Input() vehicleType: VehicleType;

	// region Getters / setters

	get order(): Order {
		return InspectionService.selectedOrderInspection.order;
	}

	get savedInspection(): SavedInspection {
		return InspectionService.selectedSavedInspection;
	}

	get inspectionHandler(): InspectionHandler {
		return InspectionService.inspectionHandler;
	}

	get selectType(): string {
		return Constants.ITEM_TYPE.SELECT;
	}

	get centre(): Centre {
		return InspectionService.centre;
	}

	// endregion

	checkSelectedOption(value: string, optionCode: string, item, i: number): boolean {
		return value === optionCode;
	}

	checkLeftOption(savedItem: SavedItem, i: number): boolean {
		const options = this.findSelectItemOptions(savedItem);
		return i < this.findOptionIndex(savedItem, options);
	}

	checkRightOption(savedItem: SavedItem, i: number): boolean {
		const options = this.findSelectItemOptions(savedItem);
		return i > this.findOptionIndex(savedItem, options);
	}

	checkItemType(optionType: string, type: string): boolean {
		return optionType === type;
	}

	findSelectItemOptions(
		savedItem: SavedItem, groupedItemOptions: GroupedItemOptions[] = InspectionService.groupedItemOptions
	): SelectItemOption[] {
		return groupedItemOptions.find(o => o.itemCode === savedItem.code).options;
	}

	checkMultipleFieldsItem(savedItem: SavedItem): boolean {
		return savedItem.item.type === ItemType.TEXT.id && (savedItem.findData() as TextSavedItemData).fields.length > 2;
	}

	findTextItem(savedItem: SavedItem): TextItem {
		return savedItem.item as TextItem;
	}

	findTextSavedItemData(savedItem: SavedItem): TextSavedItemData {
		return savedItem.findData() as TextSavedItemData;
	}

	findTextAreaSavedItemData(savedItem: SavedItem): TextAreaSavedItemData {
		return savedItem.findData() as TextAreaSavedItemData;
	}

	findTextItemUnit(item: SavedItem): string {
		return item.isFilled() ? this.findTextItem(item).unit || '' : '';
	}

	findIconColor(code: string): string {
		return InspectionService.findIconColor(code);
	}

	checkIndividualTextField(item: TextItem): boolean {
		return item.fields.length === 1;
	}

	findTextItemField(savedItem: SavedItem): TextItemField {
		return this.findTextItem(savedItem).fields[0];
	}

	findTextSavedItemField(savedItem: SavedItem): TextSavedItemDataField {
		return this.findTextSavedItemData(savedItem).fields[0];
	}

	findTextItemFieldMaxLength(savedItem: SavedItem): number {
		return this.findTextItemField(savedItem).maxLength || Constants.TEXT_ITEM_MAX_LENGTH;
	}

	findTextAreaLines(item: SavedItem): string[] {
		return item.findValue() ? item.findValue().split('\n') : [];
	}

	checkWrongItem(savedItem: SavedItem): boolean {
		if (savedItem.type !== Constants.ITEM_TYPE.SELECT) {
			return false;
		}
		return Utils.checkValueInList(savedItem.findValue(), Constants.WRONG_ITEM_OPTIONS);
	}

	toggleSelectOption(savedItem: SavedItem): void {
		const options = this.findSelectItemOptions(savedItem);
		const selectedIndex = this.findOptionIndex(savedItem, options);
		const newIndex = this.inspectionHandler.findSelectOptionIndex(selectedIndex, options.length);

		InspectionService.updateSelectItem(savedItem, options[newIndex].code, this.savedInspection).subscribe();
	}

	findOptionIndex(savedItem: SavedItem, options: SelectItemOption[]): number {
		const selectedValue = savedItem.findValue();
		return options.findIndex(o => o.code === selectedValue);
	}

	updateText(savedItem: SavedItem): void {
		const textSavedItemData = savedItem.findData() as TextSavedItemData;
		InspectionService.updateTextItem(savedItem, textSavedItemData.fields, this.savedInspection);
	}

	updateSeparatorValue(savedItem: SavedItem, fields: TextSavedItemDataField[]): void {
		InspectionService.updateTextItem(savedItem, fields, this.savedInspection);
	}

	updateTextArea(savedItem: SavedItem): void {
		const textAreaSavedItemData = savedItem.findData() as TextAreaSavedItemData;
		InspectionService.updateTextAreaItem(savedItem, textAreaSavedItemData.text, this.savedInspection);
	}

}
