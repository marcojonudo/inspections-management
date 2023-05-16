import { Action } from './action';
import { SavedItem } from '../../saved-items/saved-item';

export class RemoveTextAction implements Action {

	apply(targetSavedItem: SavedItem, targetText: string, employeeCode: string): void {
		return targetSavedItem.update(targetSavedItem.findValue().replace(targetText, ''), employeeCode);
	}

}
