package inspections.management.domains

import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class VehicleSection implements GormEntity<VehicleSection> {

	String code
	String name
	int order

	static constraints = {
		name maxSize: 45
	}

	static mapping = {
		order column: '`order`'
	}

}
