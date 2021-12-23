import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ListElement } from '../../../objects/list-elements/list-element';
import { SavedInspection } from '../../../objects/inspections/saved-inspection';
import { InspectionHandler } from '../../../objects/inspection-handler/inspection-handler';
import { Constants } from '../../../utils/constants';
import { OrderPipe } from '../../../pipes/order.pipe';
import { InspectionService } from '../../../services/inspection.service';
import { SavedItem } from '../../../objects/inspections/saved-items/saved-item';
import { Order } from '../../../objects/orders/order';
import { Centre } from '../../../objects/centre';
import { SelectItemOption } from '../../../objects/inspections/items/select-item-option';
import { SelectSavedItem } from '../../../objects/inspections/saved-items/select-saved-item';
import { TextSavedItem } from '../../../objects/inspections/saved-items/text-saved-item';
import { TextItem } from '../../../objects/inspections/items/text-item';
import { SelectItem } from '../../../objects/inspections/items/select-item';
import { Category } from '../../../objects/list-elements/category';
import { Builder } from '../../../utils/builder';
import { Utils } from '../../../utils/utils';
import { Item } from '../../../objects/inspections/items/item';
import { Url } from '../../../utils/url';
import { Image } from '../../../objects/inspections/image';
import { HttpClient } from '@angular/common/http';
import { TextAreaSavedItem } from '../../../objects/inspections/saved-items/text-area-saved-item';
import { TextItemField } from '../../../objects/inspections/items/text-item-field';
import { TextSavedItemField } from '../../../objects/inspections/saved-items/text-saved-item-field';

@Component({
	selector: 'app-inspection-sheet',
	templateUrl: './inspection-sheet.component.html',
	styleUrls: ['./inspection-sheet.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionSheetComponent {

	private readonly ROW_ITEMS = 4;

	images: Image[];
	listElements: ListElement[];
	imageListElements: any[];

	constructor(
		private orderPipe: OrderPipe,
		private http: HttpClient,
		private cdRef: ChangeDetectorRef
	) {
		const items = this.savedInspection.items
			.filter(i => !i.item.header)
			.filter(i => {
				const selectItem = i.item.type === Constants.ITEM_TYPE.SELECT;
				return selectItem ? i.findValue() !== Constants.SELECT_ITEM_OPTION_CODE.NA : true;
			});
		this.listElements = InspectionService.findGroupedItems(
			items, 0, [(savedItem: SavedItem) => savedItem.item.category]
		);
		console.log('LIST ELEMENTS', this.listElements);
		this.images = [];
		this.imageListElements = [];

		const imageItems = this.savedInspection.items.filter(savedItem => savedItem.imageId);
		const imageIds = imageItems.map(savedItem => savedItem.imageId);
		if (imageIds) {
			http.get(Url.images(), { params: { ids: `${imageIds.join(',')}` } }).subscribe((images: Image[]) => {
				this.images = images;
				imageItems.forEach(savedItem => {
					savedItem.image = this.images.find(image => image.id === savedItem.imageId);
				});
				this.imageListElements = this.findImageElements(imageItems);
				this.cdRef.detectChanges();
			});
		}
	}

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

	checkBreak(i: number): boolean {
		return i % 3 === 0;
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

	checkCategoryElement(item: ListElement): boolean {
		return item instanceof Category;
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

	findImageUrl(image: string): string {
		return InspectionService.findImageUrl(image);
	}

	findImageElements(savedItems: SavedItem[]): { listElement, pageBreak }[] {
		const splittedImageListElements = [];
		const imageListElements = InspectionService.findGroupedItems(savedItems, 0, [(savedItem: SavedItem) => savedItem.item.category]);
		let row = 0;
		this.orderPipe.transform(imageListElements).forEach(listElement => {
			if (this.checkCategoryElement(listElement)) {
				const refCategory = listElement as Category;
				let category = Builder.buildCategory(refCategory);

				Utils.collate(refCategory.items, this.ROW_ITEMS).forEach(items => {
					category.items.push(...items);
					row++;

					const breakPage = this.checkBreak(row);
					if (breakPage) {
						splittedImageListElements.push({ listElement: category, pageBreak: this.checkBreak(row) });
						category = Builder.buildCategory(refCategory);
					}
				});
				if (category.items.length) {
					splittedImageListElements.push({ listElement: category, pageBreak: this.checkBreak(row) });
				}
			} else {
				splittedImageListElements.push({ listElement, pageBreak: this.checkBreak(row) });
			}
		});
		return splittedImageListElements;
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
		InspectionService.updateTextItem(savedItem, savedItem.item, savedItem.fields, this.savedInspection);
	}

	updateSeparatorValue(savedItem: SavedItem, fields: TextSavedItemField[]): void {
		InspectionService.updateTextItem(savedItem, savedItem.item, fields, this.savedInspection);
	}

	checkCategoryBreak(elem: ListElement): boolean {
		const gasCategory = this.checkCategoryElement(elem) && (elem as Category).code === 'G';
		if (gasCategory) { return true; }
		return !this.checkCategoryElement(elem) && (elem as SavedItem).item.code === 'C';
	}

}
