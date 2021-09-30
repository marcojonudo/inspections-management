import { Dayjs } from 'dayjs';

export abstract class OrdersFilter {

	protected constructor(public day: Dayjs, public to: boolean) {}

}
