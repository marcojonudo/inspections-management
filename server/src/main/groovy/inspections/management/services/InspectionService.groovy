package inspections.management.services

import groovy.transform.CompileStatic
import inspections.management.domains.Inspection
import inspections.management.domains.ItemBudget
import inspections.management.domains.SavedInspection
import inspections.management.domains.fviberi.Order
import inspections.management.domains.items.Item
import inspections.management.domains.savedItems.SelectSavedItem
import inspections.management.pogos.OrderInspection
import inspections.management.services.data.InspectionDataService
import inspections.management.services.data.ItemBudgetDataService
import inspections.management.services.data.SavedInspectionDataService
import inspections.management.utils.Constants
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import javax.inject.Inject
import javax.inject.Singleton

@Singleton
@CompileStatic
class InspectionService {

	private static final Logger LOG = LoggerFactory.getLogger(InspectionService)

	@Inject private ItemBudgetDataService itemBudgetDataService
	@Inject private InspectionDataService inspectionDataService
	@Inject private SavedInspectionDataService savedInspectionDataService

	List<OrderInspection> findOrderInspectionInfo(List<Order> orders) {
		List<OrderInspection> orderInspections = []
		if (orders) {
			List<ItemBudget> itemBudgets = itemBudgetDataService.findAll()

			orderInspections = findOrderInspections(orders)
			List<SavedInspection> savedInspections = savedInspectionDataService.findAll(
				orderInspections.order.number as List<Integer>
			)
			fillOrderInspections(orderInspections, savedInspections, itemBudgets)
		}
		/* Sólo se obtienen aquellas órdenes cuya revisión tenga algún elemento susceptible de presupuesto */
		return orderInspections.findAll { it.itemBudgets }
	}

	/**
	 * Busca las revisiones asociadas a las órdenes
	 * @param orders Lista de órdenes
	 * @return Lista de info de revisiones y órdenes
	 */
	List<OrderInspection> findOrderInspections(List<Order> orders) {
		List<OrderInspection> orderInspections = []
		orders.each {
			Inspection inspection = findOrderInspection(it)
			if (inspection) {
				orderInspections << new OrderInspection(it, inspection)
			}
		}
		return orderInspections
	}

	/**
	 * Busca y construye la revisión asociada a una orden
	 * @param order Orden
	 * @return Revisión
	 */
	Inspection findOrderInspection(Order order) {
		List<Inspection> inspections = inspectionDataService.findAll(order.lines*.articleCode.toList())
		return buildGroupedInspection(inspections)
	}

	/**
	 * Construye una revisión agrupada con todos los items de las recibidas como parámetro
	 * @param inspections Lista de revisiones
	 * @return Revisión con items agrupados
	 */
	static Inspection buildGroupedInspection(List<Inspection> inspections) {
		Inspection inspection = null
		if (inspections) {
			/* Se obtienen el código y nombre de la revisión con mayor número de items */
			Inspection maxInspection = inspections.max { it.items.size() }
			List<Item> items = ((List<Item>) inspections.items.flatten()).unique { it.code }
			inspection = new Inspection(code: maxInspection.code, name: maxInspection.name, items: items.toSet())
		}
		return inspection
	}

	/**
	 * Completa la información a partir de revisiones guardadas en BD
	 * @param orderInspections Lista de información de órdenes y revisiones
	 * @param savedInspections Lista de revisiones guardadas en DB
	 * @param itemBudgets Items que conllevan presupuesto
	 */
	static void fillOrderInspections(
		List<OrderInspection> orderInspections, List<SavedInspection> savedInspections, List<ItemBudget> itemBudgets
	) {
		orderInspections.each { OrderInspection orderInspection ->
			SavedInspection existent = savedInspections.find { it.orderNumber == orderInspection.order.number }
			if (existent) {
				orderInspection.savedInspection = existent
				orderInspection.state = existent.state
				orderInspection.itemBudgets = itemBudgets.findAll { ItemBudget itemBudget ->
					/* Los elementos con presupuesto van a ser siempre de selección */
					SelectSavedItem item = (SelectSavedItem) existent.items.find {
						it.item.type == Item.Type.SELECT && it.item.code == itemBudget.itemCode
					}
					return item?.filled && item.value != Constants.SELECT_CORRECT_OPTION_CODE
				}
			}
		}
	}

}
