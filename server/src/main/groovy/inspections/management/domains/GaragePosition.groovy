package inspections.management.domains


import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class GaragePosition implements GormEntity<GaragePosition> {

	String code
	String name
	int order

	static constraints = {
		code maxSize: 15
		name maxSize: 45
	}

	static mapping = {
		order column: '`order`'
	}

}
