package inspections.management.services.data

import grails.gorm.services.Query
import grails.gorm.services.Service
import inspections.management.domains.Inspection
import inspections.management.domains.InspectionInternalCode

@Service(Inspection)
abstract class InspectionDataService {

//	@Inject ItemDataService itemDataService
//
//	abstract List<Inspection> findAllInspections()
//
//	List<Inspection> findAll() {
//		List<Inspection> inspections = findAllInspections()
//		return inspections.collect { Builder.buildInspection(it, itemDataService.findAll(it)) }
//	}

	@Query("""
		select $inspection
		from ${Inspection inspection}
		join ${InspectionInternalCode code = inspection.internalCodes}
		where $code.code in $internalCodes
	""")
	abstract List<Inspection> findAll(List<Integer> internalCodes)

}
