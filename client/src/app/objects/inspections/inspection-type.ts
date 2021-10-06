export class InspectionType {

	code: string;
	name: string;

	constructor(inspection: any) {
		this.code = inspection.code;
		this.name = inspection.name;
	}

}
