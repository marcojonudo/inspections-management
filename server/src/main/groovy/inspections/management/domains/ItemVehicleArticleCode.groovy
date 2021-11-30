package inspections.management.domains


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class ItemVehicleArticleCode implements GormEntity<ItemVehicleArticleCode> {

	String itemCode
	String vehicle
	int articleCode

}
