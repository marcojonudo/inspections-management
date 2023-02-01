package inspections.management.services.data

import grails.gorm.services.Service
import inspections.management.domains.SavedInspection
import inspections.management.domains.SavedInspectionData
import inspections.management.domains.SavedInspectionData.Reason

@Service(SavedInspectionData)
interface SavedInspectionDataDataService {

	SavedInspectionData find(SavedInspection savedInspection, Reason reason)

}
