import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SavedItem } from '../../../objects/inspections/saved-items/saved-item';
import { Image } from '../../../objects/inspections/image';
import { Constants } from '../../../utils/constants';
import { SelectItemOption } from '../../../objects/inspections/items/select-item-option';
import { InspectionService } from '../../../services/inspection.service';
import { GroupedItemOptions } from '../../../objects/inspections/items/grouped-item-options';

@Component({
	selector: 'app-inspection-tyre-sheet',
	templateUrl: './inspection-tyre-sheet.component.html',
	styleUrls: ['./inspection-tyre-sheet.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionTyreSheetComponent implements OnInit {

	private readonly BAR_WIDTH = 192;
	private readonly BAR_WIDTH_MM = 7;
	private readonly DEPTH_THRESHOLD_MM = 1.6;
	private readonly DEPTH_BAR_MARGIN = 10;
	private readonly DEPTH_BAR_PADDING = 4;
	private readonly VISUAL_CONTROL_COLOR = {
		C: 'green',
		SN: 'red',
		NA: 'black'
	};

	@Input() tyreGroupedItems: { [key: string]: SavedItem[] };
	@Input() visualControlSavedItem: SavedItem;
	@Input() pressureSavedItem: SavedItem;
	@Input() measurementSavedItem: SavedItem;
	@Input() images: Image[];

	tyreRowsGroupedItems: { [key: string]: SavedItem[] }[];
	barWidth: number;

	ngOnInit(): void {
		this.tyreRowsGroupedItems = [];
		const keys = Object.keys(this.tyreGroupedItems);
		for (let i = 0; i < keys.length; i = i + 2) {
			const splittedObject = {};
			splittedObject[keys[i]] = this.tyreGroupedItems[keys[i]];
			splittedObject[keys[i + 1]] = this.tyreGroupedItems[keys[i + 1]];
			this.tyreRowsGroupedItems.push(splittedObject);
		}
		/* Se restan los padding de los contenedores y el margen de 10px para que no se pegue mucho la flecha a los
		 * extremos */
		this.barWidth = this.BAR_WIDTH - (this.DEPTH_BAR_PADDING * 4) - (this.DEPTH_BAR_MARGIN * 2);
	}

	get groupedItemOptions(): GroupedItemOptions[] {
		return InspectionService.groupedItemOptions;
	}

	defaultOrder(a, b) {
		return 1;
	}

	findStateItem(savedItems: SavedItem[]): SavedItem {
		return savedItems.find(savedItem => savedItem.item.code.startsWith(Constants.TYRE_ITEM_CODES[0]));
	}

	findAgeItem(savedItems: SavedItem[]): SavedItem {
		return savedItems.find(savedItem => savedItem.item.code.startsWith(Constants.TYRE_ITEM_CODES[1]));
	}

	findDepthItem(savedItems: SavedItem[]): SavedItem {
		return savedItems.find(savedItem => savedItem.item.code.startsWith(Constants.TYRE_ITEM_CODES[2]));
	}

	findSelectOptions(savedItem: SavedItem): SelectItemOption[] {
		return this.groupedItemOptions.find(o => o.itemCode === savedItem.item.code).options;
	}

	findOption(savedItem: SavedItem): SelectItemOption {
		return this.findSelectOptions(savedItem).find(o => o.code === savedItem.findValue());
	}

	findIconColor(code: string): string {
		return InspectionService.findIconColor(code);
	}

	findThresholdLeft(): number {
		return this.DEPTH_BAR_MARGIN + (this.DEPTH_THRESHOLD_MM * this.barWidth / this.BAR_WIDTH_MM) - 1.3;
	}

	findIndicatorLeft(depth: string): number {
		let d = parseFloat(depth || '0');
		d = d > this.BAR_WIDTH_MM ? this.BAR_WIDTH_MM : (d < 0 ? 0 : d);
		return this.DEPTH_BAR_MARGIN + (d * this.barWidth / this.BAR_WIDTH_MM) - 6;
	}

	findVisualControlColorName(value: string): string {
		return this.VISUAL_CONTROL_COLOR[value] || 'orange';
	}

	findDepthColorName(depth: string): string {
		if (depth) {
			const d = parseFloat(depth);
			return d >= 4.1 ? 'green' : (d <= 2.09 ? 'red' : 'orange');
		} else {
			return '';
		}
	}

	findImageUrl(imageId: number): string {
		const image = this.images.find(i => i.id === imageId);
		return image ? InspectionService.findImageUrl(image.image) : '';
	}

}
