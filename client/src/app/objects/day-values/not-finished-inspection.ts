import { Dayjs } from 'dayjs';

export class NotFinishedInspection {

	orderNumber: number;
	finished: Dayjs;

	constructor(orderNumber: number, finished: Dayjs = undefined) {
		this.orderNumber = orderNumber;
		this.finished = finished;
	}

}
