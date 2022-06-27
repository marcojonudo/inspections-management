import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';

export class SavedInspectionData {

	employeeCode: string;
	sendMethod: string;
	saved: Dayjs;

	constructor(employeeCode: string, sendMethod: string = undefined, saved: any = undefined) {
		this.employeeCode = employeeCode;
		this.sendMethod = sendMethod;
		this.saved = saved ? dayjs(saved) : undefined;
	}

}
