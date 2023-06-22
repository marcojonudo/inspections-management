import { Action } from './action';
import { SavedItem } from '../../saved-items/saved-item';

export class HideAction implements Action {

	apply(targetSavedItem: SavedItem, newValue: string, employeeCode: string): void {
		return targetSavedItem.updateHidden(employeeCode, true);
	}

}
