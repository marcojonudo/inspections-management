import { InspectionHandler } from './inspection-handler';

export class DetectedFaultsHandler implements InspectionHandler {

	findSelectOptionIndex(selectedIndex: number, options: number): number {
		return (selectedIndex + 1) % options;
	}

	// findInspectionTitleCode(): string {
	// 	return Constants.DETECTED_FAULTS_CODE;
	// }

}
