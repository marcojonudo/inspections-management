package inspections.management.services.data


import grails.gorm.services.Service
import grails.gorm.transactions.Transactional
import inspections.management.domains.savedItems.SavedItem

import javax.inject.Inject
import java.time.LocalDateTime

@Service(SavedItem)
abstract class SavedItemDataService {

	@Inject TextSavedItemDataService textSavedItemDataService
	@Inject SelectSavedItemDataService selectSavedItemDataService
	@Inject TextAreaSavedItemDataService textAreaSavedItemDataService

	abstract SavedItem update(Serializable id, String employeeCode, boolean hidden, LocalDateTime filled)

	abstract SavedItem save(SavedItem savedItem)

	@Transactional
	SavedItem update(SavedItem existent, SavedItem savedItem) {
		update(existent.id, savedItem.employeeCode, savedItem.hidden, savedItem.filled)
		return ((Closure<SavedItem>) savedItem.item.type.updateSavedItem)(existent, savedItem, this)
	}

}
