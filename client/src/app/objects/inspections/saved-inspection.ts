import { SavedItem } from './saved-items/saved-item';
import { ItemBudget } from '../item-budget';
import { Constants } from '../../utils/constants';
import { Builder } from '../../utils/builder';
import { Dayjs } from 'dayjs';
import { InspectionService } from '../../services/inspection.service';

export class SavedInspection {

	inspectionTypeCode: string;
	orderNumber: number;
	vehicle: string;
	employeeCode: string;
	sellerCode: string;
	state: string;
	items: SavedItem[];
	itemBudgets: ItemBudget[];
	orderInspection: boolean;
	saved: Dayjs;

	constructor(savedInspection: any, itemBudgets: ItemBudget[]) {
		this.inspectionTypeCode = savedInspection.inspectionTypeCode;
		this.orderNumber = savedInspection.orderNumber;
		this.vehicle = savedInspection.vehicle;
		this.employeeCode = savedInspection.employeeCode;
		this.state = savedInspection.state;
		this.items = savedInspection.items.map(i => Builder.buildSavedItem(i));
		this.itemBudgets = itemBudgets.filter(itemBudget => {
			const item = this.items.find(savedItem =>
				savedItem.item.type === Constants.ITEM_TYPE.SELECT && savedItem.item.code === itemBudget.itemCode
			);
			return item && item.filled && InspectionService.checkWrongSelectValue(item.findValue());
		});
		this.orderInspection = savedInspection.orderInspection;
	}

}
