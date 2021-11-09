import { InspectionHandler } from './inspection-handler';
import { SavedInspection } from '../inspections/saved-inspection';

export class OrderInspectionHandler implements InspectionHandler {

	findSelectOptionIndex(selectedIndex: number, options: number): number {
		/* Con el segundo sumando, se evita que la opción por defecto ('Pendiente') sea seleccionada de nuevo */
		return (selectedIndex + 1) % options + Math.floor(selectedIndex / (options - 1));
	}

	findSavedInspection(savedInspection: SavedInspection): SavedInspection {
		return savedInspection;
	}

}
