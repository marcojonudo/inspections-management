import { SavedItem } from '../../saved-items/saved-item';

export interface Action {

	apply(targetSavedItem: SavedItem, newValue: string, employeeCode: string): void;

}
