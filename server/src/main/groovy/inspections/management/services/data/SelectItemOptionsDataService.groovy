package inspections.management.services.data

import grails.gorm.services.Service
import inspections.management.domains.items.SelectItemOptions

@Service(SelectItemOptions)
interface SelectItemOptionsDataService {

	List<SelectItemOptions> findAll()

}
