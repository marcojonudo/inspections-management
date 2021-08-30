package inspections.management.services.data

import grails.gorm.services.Service
import grails.gorm.services.Where
import inspections.management.domains.SavedInspection

@Service(SavedInspection)
interface SavedInspectionDataService {

	@Where({ orderNumber in orderNumbers })
	List<SavedInspection> findAll(List<Integer> orderNumbers)

}
