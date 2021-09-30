package inspections.management.services.data

import grails.gorm.services.Service
import grails.gorm.services.Where
import inspections.management.domains.ItemArticleCode

@Service(ItemArticleCode)
interface ItemArticleCodeDataService {

	@Where({ articleCode in articleCodes })
	List<ItemArticleCode> findAll(List<Integer> articleCodes)

}
