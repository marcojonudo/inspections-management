package inspections.management.services.data

import grails.gorm.services.Service
import grails.gorm.services.Where
import grails.gorm.transactions.Transactional
import inspections.management.domains.fviberi.Order
import inspections.management.domains.fviberi.OrderTime
import inspections.management.utils.Constants

import javax.inject.Inject
import java.time.LocalDate

@Service(Order)
@Transactional(connection = Constants.DataSource.FVIBERI)
abstract class OrderDataService {

	@Inject OrderTimeDataService orderTimeDataService

	@Where({ day == day && !(state in Constants.CLOSED_ORDER_STATES) })
	abstract List<Order> findAllOrders(LocalDate day)

	@Where({ day < day && !(state in Constants.CLOSED_ORDER_STATES) })
	abstract List<Order> findAllOrdersTo(LocalDate day)

	List<Order> findAllTo(LocalDate day) {
		List<Order> orders = findAllOrdersTo(day)
		return fillOrders(orders)
	}

	List<Order> findAll(LocalDate day) {
		List<Order> orders = findAllOrders(day)
		return fillOrders(orders)
	}

	List<Order> fillOrders(List<Order> orders) {
		List<OrderTime> ordersTime = orderTimeDataService.findAll((List<Integer>) orders.number)
		orders.each { Order order ->
			order.code = ordersTime.find { it.orderNumber == order.number }.code
		}
		return orders
	}

}
