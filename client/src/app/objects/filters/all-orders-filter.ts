import * as dayjs from 'dayjs';
import { OrdersFilter } from './orders-filter';

export class AllOrdersFilter extends OrdersFilter {

	constructor() {
		super(dayjs(), undefined);
	}

}
