import { InspectionHandler } from './inspection-handler';
import { SavedInspection } from '../inspections/saved-inspection';
import { Builder } from '../../utils/builder';
import { Constants } from '../../utils/constants';

export class DetectedFaultsHandler implements InspectionHandler {

	findSelectOptionIndex(selectedIndex: number, options: number): number {
		return (selectedIndex + 1) % options;
	}

	findSavedInspection(savedInspection: SavedInspection): SavedInspection {
		const newSavedInspection = Builder.buildSavedInspection(savedInspection, savedInspection.itemBudgets, false);
		/* Se obtienen únicamente aquellos items con valor definido. En el caso de los de selección, aquellos cuyo
		 * valor sea distinto de 'Pendiente', y en los texto, aquellos que tienen algún valor */
		newSavedInspection.items = newSavedInspection.items.filter(savedItem =>
			savedItem.item.type === Constants.ITEM_TYPE.SELECT ?
				savedItem.findValue() !== Constants.SELECT_ITEM_OPTION_CODE.P : savedItem.isFilled()
		);
		return newSavedInspection;
	}
}
