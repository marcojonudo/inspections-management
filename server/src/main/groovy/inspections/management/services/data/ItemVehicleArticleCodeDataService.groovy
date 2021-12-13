package inspections.management.services.data

import grails.gorm.services.Service

import inspections.management.domains.ItemVehicleArticleCode

@Service(ItemVehicleArticleCode)
interface ItemVehicleArticleCodeDataService {

	List<ItemVehicleArticleCode> findAll()

}
