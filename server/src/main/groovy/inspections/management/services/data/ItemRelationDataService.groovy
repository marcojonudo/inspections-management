package inspections.management.services.data

import grails.gorm.services.Service
import inspections.management.domains.ItemRelation

@Service(ItemRelationDataService)
interface ItemRelationDataService {

	List<ItemRelation> findAll()

}
