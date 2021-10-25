package inspections.management.services.data


import grails.gorm.services.Service
import inspections.management.domains.ItemBudget

@Service(ItemBudget)
interface ItemBudgetDataService {

	List<ItemBudget> findAll()

}
