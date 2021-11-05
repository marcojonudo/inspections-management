import { InspectionHandler } from './inspection-handler';

export class OrderInspectionHandler implements InspectionHandler {

	findSelectOptionIndex(selectedIndex: number, options: number): number {
		/* Con el segundo sumando, se evita que la opción por defecto ('Pendiente') sea seleccionada de nuevo */
		return (selectedIndex + 1) % options + Math.floor(selectedIndex / (options - 1));
	}

	// findInspectionTitleCode(inspectionTypeCode: string): string {
	// 	return inspectionTypeCode;
	// }
	//
	// findSavedInspection(savedInspection: SavedInspection): SavedInspection {
	// 	return savedInspection;
	// }
	//
	// checkPrint(items: Item[]): boolean {
	// 	return InspectionService.checkCompleteItems(items);
	// }
	//
	// findSavedItems(savedInspection: SavedInspection): SavedItem[] {
	// 	return savedInspection.items;
	// }

}
