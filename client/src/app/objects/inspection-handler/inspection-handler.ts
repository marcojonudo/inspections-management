import { SavedInspection } from '../inspections/saved-inspection';

export interface InspectionHandler {

	findSelectOptionIndex(selectedIndex: number, options: number): number;

	findSavedInspection(savedInspection: SavedInspection): SavedInspection;

}
