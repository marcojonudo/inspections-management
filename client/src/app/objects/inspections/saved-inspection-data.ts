import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';

export class SavedInspectionData {

	employeeCode: string;
	saved: Dayjs;

	constructor(employeeCode: string, saved: any = undefined) {
		this.employeeCode = employeeCode;
		this.saved = saved ? dayjs(saved) : undefined;
	}

}
