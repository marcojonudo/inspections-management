package inspections.management.services.data


import grails.gorm.services.Service
import grails.gorm.services.Where
import inspections.management.domains.SavedInspection
import inspections.management.domains.savedItems.SavedItem

import javax.inject.Inject
import java.time.LocalDateTime

@Service(SavedInspection)
abstract class SavedInspectionDataService {

	@Inject SavedItemDataService savedItemDataService
	@Inject ItemVehicleDataDataService itemVehicleDataDataService

	abstract SavedInspection find(Integer orderNumber)

	abstract Integer findSavedInspectionOrderNumber(String numberPlate, Map args)

	abstract SavedInspection find(Integer orderNumber, String numberPlate)

	@Where({ orderNumber in orderNumbers })
	abstract List<SavedInspection> findAll(List<Integer> orderNumbers)

	abstract SavedInspection update(Serializable id, SavedInspection.State state, String sellerCode)

	abstract SavedInspection update(Serializable id, LocalDateTime sent, String sellerCode)

	SavedInspection update(SavedInspection savedInspection, SavedInspection existentSavedInspection) {
		savedInspection.items.each { SavedItem savedItem ->
			SavedItem existentSavedItem = existentSavedInspection.items.find { it.item.code == savedItem.item.code }
			if (!existentSavedItem) {
				fillSavedItem(savedItem, existentSavedInspection)
				savedItemDataService.save(savedItem)
			} else if (savedItem != existentSavedItem) {
				savedItemDataService.update(existentSavedItem, savedItem)
			}
		}
		SavedInspection.State state = SavedInspection.State.values().find {
			((Closure<Boolean>) it.check)(savedInspection.items)
		}
		return update(existentSavedInspection.id, state, savedInspection.sellerCode)
	}

	void fillSavedItem(SavedItem savedItem, SavedInspection savedInspection) {
		savedItem.savedInspection = savedInspection
		savedItem.item = itemVehicleDataDataService.find(savedItem.item.code)
	}

}
