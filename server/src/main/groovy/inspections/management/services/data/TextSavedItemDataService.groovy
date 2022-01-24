package inspections.management.services.data

import grails.gorm.services.Service
import inspections.management.domains.savedItems.TextSavedItem
import inspections.management.domains.savedItems.TextSavedItemField

import javax.inject.Inject

@Service(TextSavedItem)
abstract class TextSavedItemDataService {

	@Inject TextSavedItemFieldDataService textSavedItemFieldDataService

	TextSavedItem update(TextSavedItem savedItem, Set<TextSavedItemField> fields) {
		fields.each {
			textSavedItemFieldDataService.update(savedItem, it.order, it.text)
		}
		return savedItem
	}

}
