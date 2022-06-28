package inspections.management.services.data

import grails.gorm.services.Service
import grails.gorm.services.Where
import inspections.management.domains.savedItems.SavedItem

@Service(SavedItem)
interface SavedItemDataService {

	@Where({ savedInspectionId in savedInspectionIds })
	abstract List<SavedItem> findAll(List<Integer> savedInspectionIds)

	abstract List<SavedItem> findAll(Long savedInspectionId)

	SavedItem save(SavedItem savedItem)

}
