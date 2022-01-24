package inspections.management.services.data

import grails.gorm.services.Service
import inspections.management.domains.savedItems.TextAreaSavedItem

@Service(TextAreaSavedItem)
interface TextAreaSavedItemDataService {

	TextAreaSavedItem update(Serializable id, String text)

}
