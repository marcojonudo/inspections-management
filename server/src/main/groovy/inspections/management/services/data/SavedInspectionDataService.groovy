package inspections.management.services.data

import grails.gorm.services.Service
import grails.gorm.services.Where
import inspections.management.domains.SavedInspection
import inspections.management.domains.SavedInspectionData
import inspections.management.domains.fviberi.Order
import inspections.management.domains.items.Item
import inspections.management.domains.savedItems.SavedItem
import inspections.management.domains.savedItems.SavedItemData
import inspections.management.pogos.SendMethod
import inspections.management.utils.Constants

import javax.inject.Inject

@Service(SavedInspection)
abstract class SavedInspectionDataService {

	@Inject SavedInspectionDataDataService savedInspectionDataDataService
	@Inject SavedItemDataService savedItemDataService
	@Inject ItemVehicleDataDataService itemVehicleDataDataService
	@Inject ItemDataService itemDataService
	@Inject SavedItemDataDataService savedItemDataDataService

	abstract SavedInspection findSavedInspection(Integer orderNumber)

	abstract Integer findSavedInspectionOrderNumber(String numberPlate, Map args)

	abstract SavedInspection findSavedInspection(Integer orderNumber, String numberPlate)

	@Where({ orderNumber in orderNumbers })
	abstract List<SavedInspection> findAllSavedInspections(List<Integer> orderNumbers)

	abstract SavedInspection save(SavedInspection savedInspection)

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

		SavedInspectionData newSavedInspectionData = savedInspection.data
			.max { it.saved }
			.tap {
				it.savedInspection = existentSavedInspection
				it.reason = SavedInspectionData.Reason.UPDATED
			}
		existentSavedInspection.addToData(newSavedInspectionData)
		savedInspection.items.each { SavedItem savedItem ->
			SavedItem existentSavedItem = existentSavedInspection.items.find { it.code == savedItem.code }
			if (!existentSavedItem) {
				fillSavedItem(savedItem, existentSavedInspection)
				savedItemDataService.save(savedItem)
			} else if (savedItem.data.size() != existentSavedItem.data.size()) {
				addSavedItem(savedItem, existentSavedItem)
			}
		}
		existentSavedInspection.state = findState(savedInspection, items)
		return save(existentSavedInspection)
	}

	static void fillSavedItem(SavedItem savedItem, SavedInspection savedInspection) {
		savedItem.savedInspectionId = savedInspection.id
		savedItem.data.each { it.fill(savedItem) }
	}

	void addSavedItem(SavedItem savedItem, SavedItem existentSavedItem) {
		/* Si hay algún elemento nuevo en el array 'data', significa que se ha modificado en el front */
		SavedItemData data = savedItem.data.max { it.filled }
		data.fill(existentSavedItem)
		existentSavedItem.addToData(data)
		savedItemDataDataService.save(data)
	}

	static SavedInspection.State findState(SavedInspection savedInspection, List<Item> items) {
		return SavedInspection.State.values().find {
			((Closure<Boolean>) it.check)(savedInspection.items, items)
		}
	}

	SavedInspection updateSent(SavedInspection savedInspection, String employeeCode, SendMethod sendMethod) {
		SavedInspectionData newData = new SavedInspectionData(
			savedInspection, employeeCode, SavedInspectionData.Reason.SENT, sendMethod
		)
		savedInspection.addToData(newData)
		return save(savedInspection)
	}

}
