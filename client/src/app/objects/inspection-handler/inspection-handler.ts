import { SavedInspection } from '../inspections/saved-inspection';
import { InspectionVehicle } from '../inspections/inspection-vehicle';
import { Item } from '../inspections/items/item';
import { SavedItem } from '../inspections/saved-items/saved-item';

export interface InspectionHandler {

	findSelectOptionIndex(selectedIndex: number, options: number): number;

	findSavedInspection(savedInspection: SavedInspection): SavedInspection;

	findInspectionTitle(inspectionVehicle: InspectionVehicle): string;

	findIncompleteItems(savedInspection: SavedInspection, items: Item[]): SavedItem[];

}
