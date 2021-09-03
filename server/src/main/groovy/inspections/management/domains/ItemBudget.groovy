package inspections.management.domains


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class ItemBudget implements GormEntity<ItemBudget> {

	String itemCode
	BudgetType budgetType

	enum BudgetType {

		URGENT,
		SECONDARY

	}

}
