package inspections.management.services.data


import grails.gorm.services.Service
import inspections.management.domains.ItemBudget

@Service(ItemBudget)
abstract class ItemBudgetDataService {

	List<ItemBudget> itemBudgets

	abstract List<ItemBudget> findAllItemBudget()

	List<ItemBudget> findAll() {
		itemBudgets = itemBudgets ?: findAllItemBudget()
		return itemBudgets
	}

}
