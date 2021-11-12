package inspections.management.services.data

import grails.gorm.services.Service
import inspections.management.domains.savedItems.SelectSavedItem

@Service(SelectSavedItem)
interface SelectSavedItemDataService {

	SelectSavedItem update(Serializable id, String value)

}
