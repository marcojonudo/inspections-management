package inspections.management.services.data

import grails.gorm.services.Service
import grails.gorm.services.Where
import grails.gorm.transactions.Transactional
import inspections.management.domains.fviberi.Budget
import inspections.management.domains.fviberi.Order
import inspections.management.domains.fviberi.OrderTime
import inspections.management.domains.fviberi.vehicle.IVehicle
import inspections.management.services.data.vehicles.CarDataService
import inspections.management.services.data.vehicles.ScooterDataService
import inspections.management.utils.Constants

import javax.inject.Inject
import java.time.LocalDate

@Service(Order)
@Transactional(connection = Constants.DataSource.FVIBERI)
abstract class OrderDataService {

	@Inject OrderTimeDataService orderTimeDataService
	@Inject BudgetDataService budgetDataService
	@Inject CarDataService carDataService
	@Inject ScooterDataService scooterDataService

	abstract Order findOrder(int number)

	@Where({ day == day && state != Constants.CANCELED_ORDER_STATE })
	abstract List<Order> findAllOrders(LocalDate day)

	@Where({ day >= from && day < to && state != Constants.CANCELED_ORDER_STATE })
	abstract List<Order> findAllOrders(LocalDate from, LocalDate to)

	@Where({ number in numbers })
	abstract List<Order> findAllOrders(List<Integer> numbers)

	Order find(int number) {
		Order order = findOrder(number)
		return fillOrder(order)
	}

	List<Order> findAll(LocalDate from, LocalDate to) {
		List<Order> orders = findAllOrders(from, to)
		return fillOrders(orders)
	}

	List<Order> findAll(LocalDate day) {
		List<Order> orders = findAllOrders(day)
		return fillOrders(orders)
	}

	List<Order> findAll(List<Integer> numbers) {
		List<Order> orders = findAllOrders(numbers)
		return fillOrders(orders)
	}

	List<Order> fillOrders(List<Order> orders) {
		List<OrderTime> ordersTime = orderTimeDataService.findAll((List<Integer>) orders.number)
		List<Integer> budgetNumbers = (List<Integer>) orders.collect {
			it.relatedBudgets.sort { it.number }.takeRight(it.relatedBudgets.size() - 1).number
		}.flatten()
		List<Budget> budgets = budgetNumbers ? budgetDataService.findAll(budgetNumbers) : []
		orders.each { Order order ->
			IVehicle vehicle = carDataService.find(order.carIdentifier) ?: scooterDataService.find(order.carIdentifier)
			order.vehicle = vehicle?.buildVehicle()

			OrderTime orderTime = ordersTime.find { it.orderNumber == order.number }
			order.code = orderTime.code
			order.mechanicCode = orderTime.mechanicCode
			order.keys = order.isAppointment() ? orderTime.day != null : true

			List<Integer> orderBudgetNumbers = (List<Integer>) order.relatedBudgets.sort { it.number }.takeRight(
				order.relatedBudgets.size() - 1
			).number
			order.budgets = orderBudgetNumbers.collect { int budgetNumber ->
				budgets.find { it.number == budgetNumber }
			}
		}
		return orders
	}

	Order fillOrder(Order order) {
		OrderTime orderTime = orderTimeDataService.find(order.number)
		IVehicle vehicle = carDataService.find(order.carIdentifier) ?: scooterDataService.find(order.carIdentifier)
		order.vehicle = vehicle.buildVehicle()

		order.code = orderTime.code
		order.mechanicCode = orderTime.mechanicCode
		order.keys = order.isAppointment() ? orderTime.day != null : true
		return order
	}

}
