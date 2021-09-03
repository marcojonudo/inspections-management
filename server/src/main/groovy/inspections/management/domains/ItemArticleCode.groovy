package inspections.management.domains


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class ItemArticleCode implements GormEntity<ItemArticleCode> {

	String itemCode
	int articleCode

}
