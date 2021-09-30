package inspections.management.services.data

import grails.gorm.services.Service
import grails.gorm.services.Where
import grails.gorm.transactions.Transactional
import inspections.management.domains.fviberi.Budget
import inspections.management.domains.fviberi.Order
import inspections.management.domains.fviberi.OrderTime
import inspections.management.utils.Constants

import javax.inject.Inject
import java.time.LocalDate

@Service(Order)
@Transactional(connection = Constants.DataSource.FVIBERI)
abstract class OrderDataService {

	@Inject OrderTimeDataService orderTimeDataService
	@Inject BudgetDataService budgetDataService

	@Where({ day == day && !(state in Constants.CLOSED_ORDER_STATES) })
	abstract List<Order> findAllOrders(LocalDate day)

	@Where({ day < day && day >= day.minusDays(7) && !(state in Constants.CLOSED_ORDER_STATES) })
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
		List<Integer> budgetNumbers = (List<Integer>) orders.collect {
			it.relatedBudgets.sort { it.number }.takeRight(it.relatedBudgets.size() - 1).number
		}.flatten()
		List<Budget> budgets = budgetNumbers ? budgetDataService.findAll(budgetNumbers) : []
		orders.each { Order order ->
			order.code = ordersTime.find { it.orderNumber == order.number }.code
			List<Integer> orderBudgetNumbers = (List<Integer>) order.relatedBudgets.sort { it.number }.takeRight(
				order.relatedBudgets.size() - 1
			).number
			order.budgets = orderBudgetNumbers.collect { int budgetNumber ->
				budgets.find { it.number == budgetNumber }
			}
		}
		return orders
	}

}
