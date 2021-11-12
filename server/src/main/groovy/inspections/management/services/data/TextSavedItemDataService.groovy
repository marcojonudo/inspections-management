package inspections.management.services.data

import grails.gorm.services.Service
import inspections.management.domains.savedItems.TextSavedItem

@Service(TextSavedItem)
interface TextSavedItemDataService {

	TextSavedItem update(Serializable id, String text)

}
