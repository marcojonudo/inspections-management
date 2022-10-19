import { InspectionHandler } from './inspection-handler';
import { SavedInspection } from '../inspections/saved-inspection';
import { InspectionVehicle } from '../inspections/inspection-vehicle';
import { Item } from '../inspections/items/item';
import { InspectionService } from '../../services/inspection.service';
import { SavedItem } from '../inspections/saved-items/saved-item';

export class OrderInspectionHandler implements InspectionHandler {

	findSelectOptionIndex(selectedIndex: number, options: number): number {
		/* Con el segundo sumando, se evita que la opción por defecto ('Pendiente') sea seleccionada de nuevo */
		return (selectedIndex + 1) % options + Math.floor(selectedIndex / (options - 1));
	}

	findSavedInspection(savedInspection: SavedInspection): SavedInspection {
		return savedInspection;
	}

	findInspectionTitle(inspectionVehicle: InspectionVehicle): string {
		return inspectionVehicle.inspectionType.name;
	}

	findIncompleteItems(savedInspection: SavedInspection, items: Item[]): SavedItem[] {
		return InspectionService.findIncompleteItems(savedInspection, items);
	}

}
