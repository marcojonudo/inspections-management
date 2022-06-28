package inspections.management.services.data

import grails.gorm.services.Service
import inspections.management.domains.SavedInspectionData

@Service(SavedInspectionData)
interface SavedInspectionDataDataService {

	SavedInspectionData save(SavedInspectionData savedInspectionData)

}
