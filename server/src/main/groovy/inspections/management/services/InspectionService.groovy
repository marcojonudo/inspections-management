package inspections.management.services

import groovy.transform.CompileStatic
import inspections.management.domains.InspectionVehicle
import inspections.management.domains.fviberi.Order
import inspections.management.domains.items.Item
import inspections.management.pogos.OrderInspection
import inspections.management.services.data.InspectionVehicleDataService
import inspections.management.services.data.ItemBudgetDataService
import inspections.management.services.data.OrderDataService
import inspections.management.services.data.SavedInspectionDataService
import inspections.management.utils.Builder
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import javax.inject.Inject
import javax.inject.Singleton
import java.time.LocalDate
import java.time.LocalTime
import java.time.temporal.ChronoUnit

@Singleton
@CompileStatic
class InspectionService {

	private static final Logger LOG = LoggerFactory.getLogger(InspectionService)

	private static final int DAYS_OFFSET = 7

	@Inject private ItemBudgetDataService itemBudgetDataService
	@Inject private InspectionVehicleDataService inspectionVehicleDataService
	@Inject private SavedInspectionDataService savedInspectionDataService
	@Inject private OrderDataService orderDataService

	List<Order> findOrders(LocalDate day, boolean to) {
		List<Order> orders
		List<Integer> savedOrderNumbers
		if (to) {
			orders = orderDataService.findAll(day, day.minusDays(DAYS_OFFSET))
			savedOrderNumbers = savedInspectionDataService.findOrderNumbers(day, day.minusDays(DAYS_OFFSET))
		} else {
			orders = orderDataService.findAll(day)
			savedOrderNumbers = savedInspectionDataService.findOrderNumbers(day)
		}

		return handleNotInspectionOrders(orders, savedOrderNumbers)
	}

	List<Order> handleNotInspectionOrders(List<Order> orders, List<Integer> savedOrderNumbers) {
		/* Se buscan los números de orden guardados en revisiones, que no figuren en la lista de ordenes. Esto significa
		 * que no tienen ningún código de artículo de revisión, pero se guardó alguna anomalía */
		List<Integer> notInspectionOrderNumbers = []
		savedOrderNumbers.each { Integer orderNumber ->
			boolean existent = orders.find { it.number == orderNumber }
			if (!existent) {
				notInspectionOrderNumbers << orderNumber
			}
		}
		List<Order> notInspectionOrders = notInspectionOrderNumbers ?
			orderDataService.findAll(notInspectionOrderNumbers) : []
		return orders + notInspectionOrders
	}

	List<OrderInspection> findOrderInspections(List<Order> orders) {
		return orders.collect {
			InspectionVehicle inspectionVehicle = findInspection(it)
			return new OrderInspection(it, inspectionVehicle)
		}
	}

	/**
	 * Busca y construye la revisión asociada a una orden
	 * @param order Orden
	 * @return Revisión
	 */
	InspectionVehicle findInspection(Order order) {
		LocalTime refTime = LocalTime.now()
		List<InspectionVehicle> inspectionsVehicle = inspectionVehicleDataService.findAll(
			order.lines*.articleCode.toList()
		)
		LOG.info("INSPECTIONS VEHICLE: ${ChronoUnit.MILLIS.between(refTime, LocalTime.now())}")
		return buildGroupedInspection(inspectionsVehicle)
	}

	/**
	 * Construye una revisión agrupada con todos los items de las recibidas como parámetro
	 * @param inspections Lista de revisiones
	 * @return Revisión con items agrupados
	 */
	static InspectionVehicle buildGroupedInspection(List<InspectionVehicle> inspectionsVehicle) {
		InspectionVehicle inspectionVehicle = null
		if (inspectionsVehicle) {
			/* Se obtienen el código y nombre de la revisión con mayor número de items */
			InspectionVehicle maxInspection = inspectionsVehicle.max { it.items.size() }
			List<Item> items = ((List<Item>) inspectionsVehicle.items.flatten()).unique { it.code }
			inspectionVehicle = Builder.buildInspectionVehicle(maxInspection, items)
		}
		return inspectionVehicle
	}

}
