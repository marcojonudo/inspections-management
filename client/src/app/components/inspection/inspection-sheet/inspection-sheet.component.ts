import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SavedInspection } from '../../../objects/inspections/saved-inspection';
import { InspectionHandler } from '../../../objects/inspection-handler/inspection-handler';
import { Constants } from '../../../utils/constants';
import { InspectionService } from '../../../services/inspection.service';
import { SavedItem } from '../../../objects/inspections/saved-items/saved-item';
import { Order } from '../../../objects/orders/order';
import { Centre } from '../../../objects/centre';
import { SelectItemOption } from '../../../objects/inspections/items/select-item-option';
import { SelectSavedItem } from '../../../objects/inspections/saved-items/select-saved-item';
import { TextSavedItem } from '../../../objects/inspections/saved-items/text-saved-item';
import { TextItem } from '../../../objects/inspections/items/text-item';
import { SelectItem } from '../../../objects/inspections/items/select-item';
import { Item } from '../../../objects/inspections/items/item';
import { TextAreaSavedItem } from '../../../objects/inspections/saved-items/text-area-saved-item';
import { TextItemField } from '../../../objects/inspections/items/text-item-field';
import { TextSavedItemField } from '../../../objects/inspections/saved-items/text-saved-item-field';
import { VehicleType } from '../../../objects/orders/vehicles/vehicle-type';
import { CategoryItems } from '../../../objects/print/category-items';

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

	checkLeftOption(savedItem: SelectSavedItem, options: SelectItemOption[], i: number): boolean {
		return i < this.findOptionIndex(savedItem, options);
	}

	checkRightOption(savedItem: SelectSavedItem, options: SelectItemOption[], i: number): boolean {
		return i > this.findOptionIndex(savedItem, options);
	}

	checkItemType(optionType: string, type: string): boolean {
		return optionType === type;
	}

	findSelectItem(item: Item): SelectItem {
		return item as SelectItem;
	}

	findTextItem(savedItem: SavedItem): TextItem {
		return savedItem.item as TextItem;
	}

	findSelectSavedItem(item: SavedItem): SelectSavedItem {
		return item as SelectSavedItem;
	}

	findTextSavedItem(item: SavedItem): TextSavedItem {
		return item as TextSavedItem;
	}

	findTextAreaSavedItem(item: SavedItem): TextAreaSavedItem {
		return item as TextAreaSavedItem;
	}

	findTextItemUnit(item: SavedItem): string {
		return this.findTextSavedItem(item).isFilled() ? this.findTextItem(item).unit || '' : '';
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

	findTextSavedItemField(savedItem: SavedItem): TextSavedItemField {
		return this.findTextSavedItem(savedItem).fields[0];
	}

	findTextItemFieldMaxLength(savedItem: SavedItem): number {
		return this.findTextItemField(savedItem).maxLength || Constants.TEXT_ITEM_MAX_LENGTH;
	}

	findTextAreaLines(item: TextAreaSavedItem): string[] {
		return item.text ? item.text.split('\n') : [];
	}

	checkWrongItem(savedItem: SavedItem): boolean {
		if (savedItem.item.type !== Constants.ITEM_TYPE.SELECT) {
			return false;
		}
		return InspectionService.checkWrongSelectValue((savedItem as SelectSavedItem).value);
	}

	toggleSelectOption(savedItem: SelectSavedItem): void {
		const item = savedItem.item as SelectItem;
		const selectedIndex = this.findOptionIndex(savedItem, item.options);
		const newIndex = this.inspectionHandler.findSelectOptionIndex(selectedIndex, item.options.length);

		InspectionService.updateSelectItem(savedItem, item, item.options[newIndex].code, this.savedInspection).subscribe();
	}

	findOptionIndex(savedItem: SelectSavedItem, options: SelectItemOption[]): number {
		const selectedValue = savedItem.value;
		return options.findIndex(o => o.code === selectedValue);
	}

	updateText(savedItem: TextSavedItem): void {
		InspectionService.updateTextItem(savedItem, savedItem.fields, this.savedInspection);
	}

	updateSeparatorValue(savedItem: SavedItem, fields: TextSavedItemField[]): void {
		InspectionService.updateTextItem(savedItem, fields, this.savedInspection);
	}

	updateTextArea(savedItem: TextAreaSavedItem): void {
		InspectionService.updateTextAreaItem(savedItem, savedItem.text, this.savedInspection);
	}

}
