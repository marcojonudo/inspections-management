package inspections.management.services.data

import grails.gorm.services.Service
import inspections.management.domains.items.SelectItemOption

@Service(SelectItemOption)
interface SelectItemOptionDataService {

	List<SelectItemOption> findAll()

}
