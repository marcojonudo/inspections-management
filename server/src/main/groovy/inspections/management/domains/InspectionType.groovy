package inspections.management.domains

import grails.gorm.annotation.Entity
import org.grails.datastore.gorm.GormEntity

@Entity
class InspectionType implements GormEntity<InspectionType> {

	String code
	String name

	static constraints = {
		code maxSize: 15
		name maxSize: 45
	}

	enum Code {

		SE

	}

}
