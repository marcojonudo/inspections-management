package inspections.management.services.data

import grails.gorm.services.Query
import grails.gorm.services.Service
import inspections.management.domains.ArticleCodeInspection
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

}
