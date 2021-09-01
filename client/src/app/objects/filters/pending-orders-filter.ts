import * as dayjs from 'dayjs';
import { OrdersFilter } from './orders-filter';

export class PendingOrdersFilter extends OrdersFilter {

	constructor() {
		super(dayjs(), true);
	}

}
