import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';
import { NotFinishedInspection } from './not-finished-inspection';

export class DayValues {

	day: Dayjs;
	notFinishedInspections: NotFinishedInspection[];

	constructor(day: Dayjs, dayValues: any = undefined) {
		this.day = dayjs(day);
		this.notFinishedInspections = dayValues ?
			dayValues.notFinishedInspections.map(i => new NotFinishedInspection(i.orderNumber, i.finished)) : [];
	}

}
