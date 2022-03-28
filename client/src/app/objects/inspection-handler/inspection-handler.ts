import { SavedInspection } from '../inspections/saved-inspection';
import { InspectionVehicle } from '../inspections/inspection-vehicle';

export interface InspectionHandler {

	findSelectOptionIndex(selectedIndex: number, options: number): number;

	findSavedInspection(savedInspection: SavedInspection): SavedInspection;

	findInspectionTitle(inspectionVehicle: InspectionVehicle): string;

}
