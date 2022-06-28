package inspections.management.services.data

import grails.gorm.services.Service
import inspections.management.domains.savedItems.SavedItemData

@Service(SavedItemData)
interface SavedItemDataDataService {

	SavedItemData save(SavedItemData savedItemData)

}
