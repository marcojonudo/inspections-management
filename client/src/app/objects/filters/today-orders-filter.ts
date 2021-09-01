import * as dayjs from 'dayjs';
import { OrdersFilter } from './orders-filter';

export class TodayOrdersFilter extends OrdersFilter {

	constructor() {
		super(dayjs(), false);
	}

}
