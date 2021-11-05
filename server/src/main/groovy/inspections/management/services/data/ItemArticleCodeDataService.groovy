package inspections.management.services.data

import grails.gorm.services.Service
import inspections.management.domains.ItemArticleCode

@Service(ItemArticleCode)
interface ItemArticleCodeDataService {

	List<ItemArticleCode> findAll()

}
