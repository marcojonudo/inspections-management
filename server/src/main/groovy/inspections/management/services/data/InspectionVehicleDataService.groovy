package inspections.management.services.data

import grails.gorm.services.Query
import grails.gorm.services.Service
import inspections.management.domains.ArticleCodeInspection
import inspections.management.domains.InspectionType
import inspections.management.domains.InspectionVehicle

@Service(InspectionVehicle)
interface InspectionVehicleDataService {

	@Query("""
		select $inspectionVehicle
		from ${InspectionVehicle inspectionVehicle}
		join ${ArticleCodeInspection articleCodeInspection = inspectionVehicle.articleCodes}
		where $articleCodeInspection.articleCode in $articleCodes
	""")
	List<InspectionVehicle> findAll(List<Integer> articleCodes)

	@Query("""
		select $inspectionVehicle
		from ${InspectionVehicle inspectionVehicle}
		join ${InspectionType type = inspectionVehicle.inspectionType}
		where $type.code = $inspectionTypeCode and $inspectionVehicle.vehicle = $vehicle
	""")
	InspectionVehicle find(String inspectionTypeCode, String vehicle)

}
