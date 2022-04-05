package inspections.management.domains.items


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class SelectItemOptions implements GormEntity<SelectItemOptions> {

	String itemCode
	SelectItemOption option

	static mapping = {
		option fetch: 'join'
	}

}
