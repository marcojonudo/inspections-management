import { Action } from './action';
import { SavedItem } from '../../saved-items/saved-item';

export class SetAction implements Action {

	apply(targetSavedItem: SavedItem, newValue: string, employeeCode: string): void {
		return targetSavedItem.update(newValue, employeeCode);
	}

}
