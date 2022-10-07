import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';

export class SavedInspectionData {

	employeeCode: string;
	reason: string;
	sendMethod: string;
	saved: Dayjs;

	constructor(employeeCode: string, reason: string, saved: Dayjs = undefined, sendMethod: string = undefined) {
		this.employeeCode = employeeCode;
		this.reason = reason;
		this.sendMethod = sendMethod;
		this.saved = saved ? saved : dayjs();
	}

}
