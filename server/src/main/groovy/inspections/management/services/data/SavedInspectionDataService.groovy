package inspections.management.services.data


import grails.gorm.services.Service
import grails.gorm.services.Where
import inspections.management.domains.SavedInspection
import inspections.management.domains.fviberi.Order
import inspections.management.domains.items.Item
import inspections.management.domains.savedItems.SavedItem
import inspections.management.utils.Constants
import inspections.management.utils.Utils

import javax.inject.Inject
import java.time.LocalDateTime

@Service(SavedInspection)
abstract class SavedInspectionDataService {

	@Inject SavedItemDataService savedItemDataService
	@Inject ItemVehicleDataDataService itemVehicleDataDataService
	@Inject ItemDataService itemDataService

	abstract SavedInspection findSavedInspection(Integer orderNumber)

	abstract Integer findSavedInspectionOrderNumber(String numberPlate, Map args)

	abstract SavedInspection findSavedInspection(Integer orderNumber, String numberPlate)

	@Where({ orderNumber in orderNumbers })
	abstract List<SavedInspection> findAllSavedInspections(List<Integer> orderNumbers)

	abstract SavedInspection update(Serializable id, SavedInspection.State state, String sellerCode)

	abstract SavedInspection update(Serializable id, LocalDateTime sent, String sellerCode)

	SavedInspection find(Integer orderNumber, String numberPlate, boolean fillItem = false) {
		SavedInspection savedInspection = findSavedInspection(orderNumber, numberPlate)
		return savedInspection ? fillSavedInspection(savedInspection, fillItem) : null
	}

	SavedInspection find(int orderNumber, boolean fillItem = false) {
		SavedInspection savedInspection = findSavedInspection(orderNumber)
		return savedInspection ? fillSavedInspection(savedInspection, fillItem) : null
	}

	SavedInspection fillSavedInspection(SavedInspection savedInspection, boolean fillItem) {
		savedInspection.items = savedItemDataService.findAll(savedInspection.id)
		if (fillItem) {
			List<Item> items = itemDataService.findAll((List<String>) savedInspection.items.code)
			savedInspection.items.each { SavedItem savedItem ->
				savedItem.item = items.find { it.code == savedItem.code }
			}
		}
		return savedInspection
	}

	List<SavedInspection> findAll(List<Order> orders) {
		List<SavedInspection> savedInspections = findAllSavedInspections(orders.number as List<Integer>)
		savedInspections.each { SavedInspection savedInspection ->
			String orderState = orders.find { it.number == savedInspection.orderNumber }.state
			savedInspection.items = orderState in Constants.CLOSED_ORDER_STATES ?
				[] : savedItemDataService.findAll(savedInspection.id)
		}
		return savedInspections
	}

	SavedInspection update(SavedInspection savedInspection, SavedInspection existentSavedInspection) {
		List<Item> items = itemDataService.findAll((List<String>) savedInspection.items.code)
		savedInspection.items.each { SavedItem savedItem ->
			SavedItem existentSavedItem = existentSavedInspection.items.find { it.code == savedItem.code }
			if (!existentSavedItem) {
				savedItem.savedInspectionId = existentSavedInspection.id
				savedItemDataService.save(savedItem)
			} else if (savedItem != existentSavedItem) {
				Item item = Utils.findItem(savedItem.code, items)
				savedItemDataService.update(existentSavedItem, savedItem, item)
			}
		}
		SavedInspection.State state = SavedInspection.State.values().find {
			((Closure<Boolean>) it.check)(savedInspection.items, items)
		}
		return update(existentSavedInspection.id, state, savedInspection.sellerCode)
	}

}
