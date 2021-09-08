package inspections.management.domains


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class BudgetNotification implements GormEntity<BudgetNotification> {

	int orderNumber
	String itemCode
	boolean accepted

}
