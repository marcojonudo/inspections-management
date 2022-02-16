package inspections.management.services.data

import grails.gorm.services.Service
import inspections.management.domains.InspectionType

@Service(InspectionType)
interface InspectionTypeDataService {

	String findInspectionTypeName(String code)

}
